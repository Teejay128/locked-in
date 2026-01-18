const { db, admin } = require("../config/firebase");
const collection = db.collection("users");

class UserModel {
	/**
	 * Find a user by their platform ID (e.g., WhatsApp number)
	 */
	static async findByPlatformId(platform, platformId) {
		const query = await collection
			.where(`linkedAccounts.${platform}`, "==", platformId)
			.limit(1)
			.get();

		if (query.empty) return null;
		return query.docs[0];
	}

	/**
	 * Create a new user document
	 */
	static async create(platform, platformId) {
		return await collection.add({
			linkedAccounts: { [platform]: platformId },
			currentStreak: 0,
			totalEntries: 0,
			lastEntryDate: "",
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
		});
	}

	/**
	 * Helper to get Ref, creating if necessary
	 */
	static async getOrCreate(platform, platformId) {
		const existing = await this.findByPlatformId(platform, platformId);
		if (existing) return existing.ref;

		return await this.create(platform, platformId);
	}

	/**
	 * Get just the streak/stats info for a user.
	 * Useful for the "GET /streaks/status" endpoint.
	 */
	static async getStats(userRef) {
		const doc = await userRef.get();
		const data = doc.data();

		return {
			currentStreak: data.currentStreak || 0,
			totalEntries: data.totalEntries || 0,
			lastEntryDate: data.lastEntryDate || null,
		};
	}
}

module.exports = UserModel;
