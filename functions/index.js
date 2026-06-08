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
		const entryDate = newEntry.date;

		const userRef = db.collection("users").doc(userId);

		await db.runTransaction(async (t) => {
			const userDoc = await t.get(userRef);
			if (!userDoc.exists) return;

			const userData = userDoc.data();
			const lastDate = userData.lastEntryDate;

			if (lastDate === entryDate) {
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

			// --- 3. COMMIT UPDATE ---
			t.update(userRef, {
				currentStreak: newStreak,
				lastEntryDate: entryDate,
				totalEntries: admin.firestore.FieldValue.increment(1),
			});
		});

		logger.info(`Streak updated for user ${userId}`);
	},
);

exports.onUserSignUp = functions.auth.user().onCreate(async (user) => {
	const { uid, email } = user;

	let defaultUsername = email
		? email.split("@")[0]
		: "User_" + uid.substring(0, 5);

	// Default Data
	const newProfile = {
		email: email,
		username: defaultUsername,
		usernameIsDefault: true,
		createdAt: admin.firestore.FieldValue.serverTimestamp(),
		currentStreak: 0,
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
			const recentQuotesSnapshot = await db
				.collection("quotes")
				.orderBy("createdAt", "desc")
				.limit(3)
				.get();

			const recentQuotes = recentQuotesSnapshot.docs
				.map((doc) => doc.data().quote)
				.join(" | ");

			// GENERATE QUOTE
			const motivationalQuote = generateQuote(recentQuotes);

			// SAVE TO FIRESTORE
			const today = new Date().toISOString().split("T")[0];
			const newQuote = {
				quote: text,
				createdAt: FieldValue.serverTimestamp(),
			};

			await db.collection("quotes").doc(today).set(newQuote);

			// Send to discord
			await sendDiscordMessage(text);
			console.log(`Successfully generated quote for ${today}: ${text}`);
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
			const ai = genkit({
				plugins: [googleAI({ apiKey: geminiApiKey.value() })],
			});
			const aiModel = googleAI.model("gemini-2.5-flash-lite");
			const trendSummaries = await synthesizeTrends(
				aggregatedWeeklyTrends,
				ai,
				aiModel,
			);

			const summaryDocName = today.toLocaleDateString("en-US", {
				weekday: "long",
				month: "long",
				day: "numeric",
			});

			await db
				.collection("trends")
				.doc(endDate)
				.collection("summaries")
				.doc(summaryDocName)
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
