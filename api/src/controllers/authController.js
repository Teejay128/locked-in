const { db, admin } = require("../config/firebase");
const { generateApiKey } = require("../utils/cryptoUtils");

// This endpoint is protected by Firebase Auth Token, NOT the API Key
exports.generateKey = async (req, res) => {
	// We assume another middleware has already verified the Firebase Auth ID Token
	// and put the uid in req.uid
	const userId = req.uid;

	try {
		const newKey = generateApiKey();

		await db.collection("users").doc(userId).set(
			{
				apiKey: newKey,
				updatedAt: admin.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true },
		);

		res.json({ apiKey: newKey });
	} catch (error) {
		res.status(500).json({ error: "Failed to generate key" });
	}
};
