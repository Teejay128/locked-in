const admin = require("firebase-admin");
const functions = require("firebase-functions/v1");
const logger = require("firebase-functions/logger");
const { defineSecret } = require("firebase-functions/params");
const { genkit } = require("genkit");
const { googleAI } = require("@genkit-ai/google-genai");

const { FieldValue } = require("firebase-admin/firestore");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");

const { getYesterdayDate, aggregator } = require("./services/utils");
const { fetchNaijaTrendingContext } = require("./services/trends");
const { sendDiscordMessage } = require("./services/dispersal");
const { synthesizeTrends } = require("./services/genkit");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

admin.initializeApp();
const db = admin.firestore();

// user functions
exports.onEntryCreated = onDocumentCreated(
	"users/{userId}/entries/{entryId}",
	async (event) => {
		const snapshot = event.data;
		if (!snapshot) return;

		const { userId } = event.params;
		const newEntry = snapshot.data();
		
		let entryDate = newEntry.date;
		if (!entryDate && newEntry.createdAt) {
			const dateObj = typeof newEntry.createdAt.toDate === "function"
				? newEntry.createdAt.toDate()
				: new Date(newEntry.createdAt);
			entryDate = dateObj.toISOString().split("T")[0];
		}
		if (!entryDate) {
			entryDate = new Date().toISOString().split("T")[0];
		}

		const userRef = db.collection("users").doc(userId);

		await db.runTransaction(async (t) => {
			const userDoc = await t.get(userRef);
			if (!userDoc.exists) return;

			const userData = userDoc.data();
			const lastDate = userData.lastEntryDate;

			// If we have a previous entry date and this entry is on or before that date,
			// just increment totalEntries without altering the current streak.
			if (lastDate && entryDate <= lastDate) {
				t.update(userRef, {
					totalEntries: admin.firestore.FieldValue.increment(1),
				});
				return;
			}

			const yesterday = getYesterdayDate(entryDate);
			let newStreak = 1; // Default reset

			if (lastDate === yesterday) {
				newStreak = (userData.currentStreak || 0) + 1;
			}

			const longestStreak = Math.max(userData.longestStreak || 0, newStreak);

			// --- 3. COMMIT UPDATE ---
			t.update(userRef, {
				currentStreak: newStreak,
				longestStreak: longestStreak,
				lastEntryDate: entryDate,
				totalEntries: admin.firestore.FieldValue.increment(1),
			});
		});

		logger.info(`Streak updated for user ${userId}`);
	},
);

exports.onUserSignUp = functions.auth.user().onCreate(async (user) => {
	const { uid, email } = user;

	let defaultUsername = user.displayName || (email
		? email.split("@")[0]
		: "User_" + uid.substring(0, 5));

	// Default Data
	const newProfile = {
		email: email || "",
		username: defaultUsername,
		usernameIsDefault: true,
		createdAt: admin.firestore.FieldValue.serverTimestamp(),
		currentStreak: 0,
		longestStreak: 0,
		totalEntries: 0,
		tier: "free",
		platform: "web",
	};

	try {
		await db.collection("users").doc(uid).set(newProfile);
		console.log(`Profile initialized for ${defaultUsername}`);
	} catch (error) {
		console.error("Error creating user profile:", error);
	}
});

// quote functions
exports.generateDailyQuote = onSchedule(
	{ schedule: "every day 07:00", secrets: [geminiApiKey] },
	async (event) => {
		try {
			const today = new Date();
			const todayStr = today.toISOString().split("T")[0];
			const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

			let quoteText = "";
			let trendTopic = null;
			let trendContext = null;
			let trendSources = null;

			if (dayOfWeek === 0) {
				// Sunday quote is a simple default
				quoteText =
					"Sunday is for rest and reflection. Prepare yourself for the week ahead!";
			} else {
				// Monday - Saturday: Fetch latest weekly summary
				const weeklySummarySnapshot = await db
					.collection("weekly_summaries")
					.orderBy("createdAt", "desc")
					.limit(1)
					.get();

				let dayTrend = null;
				if (!weeklySummarySnapshot.empty) {
					const weeklySummary = weeklySummarySnapshot.docs[0].data();
					dayTrend = (weeklySummary.trendSummaries || []).find(
						(t) => t.day === dayOfWeek,
					);
				}

				// Fetch 3 most recent quotes to avoid duplicates
				const recentQuotesSnapshot = await db
					.collection("quotes")
					.orderBy("createdAt", "desc")
					.limit(3)
					.get();

				const recentQuotes = recentQuotesSnapshot.docs
					.map((doc) => doc.data().quote)
					.join(" | ");

				const ai = genkit({
					plugins: [googleAI({ apiKey: geminiApiKey.value() })],
				});
				const aiModel = googleAI.model("gemini-2.5-flash-lite");

				if (dayTrend) {
					trendTopic = dayTrend.topic;
					trendContext = dayTrend.context || "";
					trendSources = dayTrend.sources || [];
					const prompt = `
						You are a motivational quote assistant.
						Generate a powerful, inspiring daily motivational quote inspired by this trending topic: "${dayTrend.topic}".
						Here is the context about this trend: "${dayTrend.context}".

						To ensure variety, avoid writing quotes similar to these recent quotes:
						${recentQuotes}

						Requirements:
						- The quote must be highly motivational, punchy, and professional.
						- Make a metaphorical or thematic connection to the trend if appropriate, but keep it accessible.
						- Output ONLY the quote itself. Do not include any JSON, quotation marks around the whole text, explanations, or metadata.
					`;
					const response = await ai.generate({
						model: aiModel,
						prompt: prompt,
					});
					quoteText = response.text.trim();
				} else {
					// Fallback if no trend context is available for this day
					const prompt = `
						You are a motivational quote assistant.
						Generate a powerful, inspiring daily motivational quote.

						To ensure variety, avoid writing quotes similar to these recent quotes:
						${recentQuotes}

						Requirements:
						- The quote must be highly motivational, punchy, and professional.
						- Output ONLY the quote itself. Do not include any JSON, quotation marks around the whole text, explanations, or metadata.
					`;
					const response = await ai.generate({
						model: aiModel,
						prompt: prompt,
					});
					quoteText = response.text.trim();
				}
			}

			// Clean quoteText by stripping surrounding quotes if Gemini accidentally outputs them
			quoteText = quoteText.replace(/^["']|["']$/g, "").trim();

			// Save to Firestore
			const newQuote = {
				quote: quoteText,
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			};
			if (trendTopic) {
				newQuote.trendTopic = trendTopic;
				newQuote.trendContext = trendContext;
				newQuote.trendSources = trendSources;
			}

			await db.collection("quotes").doc(todayStr).set(newQuote);

			// Send to discord
			await sendDiscordMessage(quoteText);
			console.log(
				`Successfully generated quote for ${todayStr}: ${quoteText}`,
			);
			return null;
		} catch (error) {
			console.error("Error generating daily quote:", error);
			return null;
		}
	},
);

exports.scrapeDailyTrends = onSchedule(
	{ schedule: "0 23 * * *", timeZone: "Africa/Lagos" },
	async (event) => {
		try {
			const trends = await fetchNaijaTrendingContext(
				"https://trends24.in/nigeria/",
			);

			// Save trends with today's date
			const today = new Date().toISOString().split("T")[0];
			const trendsDoc = {
				date: today,
				trends: trends,
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			};

			await db.collection("trends").doc(today).set(trendsDoc);
			logger.info(`Successfully scraped and saved trends for ${today}`);
			return null;
		} catch (error) {
			logger.error("Error scraping daily trends:", error);
			return null;
		}
	},
);

exports.synthesizeWeeklyTrends = onSchedule(
	{
		schedule: "30 23 * * 6",
		timeZone: "Africa/Lagos",
		secrets: [geminiApiKey],
	},
	async (event) => {
		try {
			const today = new Date();
			const endDate = today.toISOString().split("T")[0];
			const weekAgo = new Date(today);
			weekAgo.setDate(today.getDate() - 6);
			const startDate = weekAgo.toISOString().split("T")[0];

			const trendsSnapshot = await db
				.collection("trends")
				.where("date", ">=", startDate)
				.where("date", "<=", endDate)
				.orderBy("date")
				.get();

			const weeklyTrends = trendsSnapshot.docs.map((doc) => doc.data());

			if (weeklyTrends.length === 0) {
				logger.warn(
					"No trend entries found for the past 7 days. Skipping weekly synthesis.",
				);
				return null;
			}

			const aggregatedWeeklyTrends = aggregator(weeklyTrends);

			// Map top 6 trends to Mon-Sat (1 to 6)
			const weeklyTrendsWithDays = aggregatedWeeklyTrends.map(
				(trend, idx) => ({
					...trend,
					day: idx + 1,
				}),
			);

			const ai = genkit({
				plugins: [googleAI({ apiKey: geminiApiKey.value() })],
			});
			const aiModel = googleAI.model("gemini-2.5-flash-lite");
			const trendSummaries = await synthesizeTrends(
				weeklyTrendsWithDays,
				ai,
				aiModel,
			);

			const summaryDocName = today.toLocaleDateString("en-US", {
				weekday: "long",
				month: "long",
				day: "numeric",
			});

			// Save to top-level weekly_summaries collection
			await db
				.collection("weekly_summaries")
				.doc(`weekly_${endDate}`)
				.set({
					date: endDate,
					displayDate: summaryDocName,
					startDate,
					endDate,
					trendSummaries,
					createdAt: admin.firestore.FieldValue.serverTimestamp(),
				});

			logger.info(
				`Successfully synthesized weekly trends for ${startDate} to ${endDate}`,
			);
			return null;
		} catch (error) {
			logger.error("Error synthesizing weekly trends:", error);
			return null;
		}
	},
);
