const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { VertexAI } = require("@google-cloud/vertexai");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

admin.initializeApp();
const db = admin.firestore();

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
			if (!userDoc.exists) return; // Should not happen

			const userData = userDoc.data();
			const lastDate = userData.lastEntryDate;

			// --- 1. IDEMPOTENCY CHECK ---
			// If the user already has a "lastEntryDate" of today, do NOT increment streak.
			// This handles the case where a user posts 5 times in one day.
			if (lastDate === entryDate) {
				// Just update total entries, but don't touch streak
				t.update(userRef, {
					totalEntries: admin.firestore.FieldValue.increment(1),
				});
				return;
			}

			// --- 2. STREAK CALCULATION ---
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

function getYesterdayDate(dateString) {
	const date = new Date(dateString);
	date.setDate(date.getDate() - 1);
	return date.toISOString().split("T")[0];
}
