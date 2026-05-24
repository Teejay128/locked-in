const admin = require("firebase-admin");
const functions = require("firebase-functions/v1");
const logger = require("firebase-functions/logger");

const { FieldValue } = require("firebase-admin/firestore");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");

const { genkit } = require("genkit");
const { googleAI } = require("@genkit-ai/google-genai");

admin.initializeApp();
const db = admin.firestore();
const geminiApiKey = defineSecret("GEMINI_API_KEY");

function getYesterdayDate(dateString) {
	const date = new Date(dateString);
	date.setDate(date.getDate() - 1);
	return date.toISOString().split("T")[0];
}

async function sendDiscordMessage(text) {
	const webhookUrl = "https://discordapp.com/api/webhooks/1492646543533146327/tHp7C0RAmDDpfWe_0hyy7NrkzKUUQCkpvXOY1R6JQH4K_iRH_7xUWlpvCicgmsK9yj6N"

	if(!webhookUrl) {
		console.error("Missing Discord Webhook URL")
		return
	}

	try {
		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify({
				content: text,
			})
		})

		if(!response.ok) {
			console.error("Failed to send message to Discord")
		}
	} catch (error) {
		console.error("Error sending message to Discord:", error)
	}
}

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

exports.generateDailyQuote = onSchedule(
	{ schedule: "every day 07:00", secrets: [geminiApiKey] },
	async (event) => {
		try {
			// FETCH CONTEXT
			let quoteContext = "No additional context today. SKIP.";
			try {
				// fetch context from external source
			} catch (e) {
				console.log("Failed to fetch context");
			}
			const recentQuotesSnapshot = await db
				.collection("quotes")
				.orderBy("createdAt", "desc")
				.limit(5)
				.get();

			const recentQuotes = recentQuotesSnapshot.docs
				.map((doc) => doc.data().quote)
				.join(" | ");

			// GENERATE QUOTE
			const ai = genkit({
				plugins: [googleAI({ apiKey: geminiApiKey.value() })],
				model: googleAI.model("gemini-2.0-flash-lite"),
			});

			const prompt = `
			You are an inspiring mentor for software developers who are trying to be consistent. Generate ONE short, punch motivational quote for today. Bonus points if you include a twist in it.

			HERE'S SOME CONTEXT FOR YOU TO USE:
			${quoteContext}
			
			RULES:
			- Keep it under 2 sentences.
      - Make it relevant to building software, coding, or technology.
      - DO NOT repeat similar concepts to these recent quotes: [${recentQuotes}]
      - Do not include quotation marks in the output.
      - Subtly weave the provided context into the motivation if appropriate, but keep the focus on developer productivity.
		`;

			const { text } = await ai.generate(prompt);

			// SAVE TO FIRESTORE
			const today = new Date().toISOString().split("T")[0];
			const newQuote = {
				quote: text,
				createdAt: FieldValue.serverTimestamp(),
			};
			
			await db.collection("quotes").doc(today).set(newQuote);
			
			// Send to discord
			await sendDiscordMessage(text)
			console.log(`Successfully generated quote for ${today}: ${text}`);
			return null;
		} catch (error) {
			console.error("Error generating daily quote:", error);
			return null;
		}
	},
);
