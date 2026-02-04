const { db, admin } = require("../config/firebase");
const { generateApiKey } = require("../utils/cryptoUtils");

// This endpoint is protected by Firebase Auth Token, NOT the API Key
exports.generateKey = async (req, res) => {
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

exports.registerUser = async (req, res) => {
	const { email, password, username, origin } = req.body;

	if (!email || !password || !username) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		const userRecord = await admin.auth().createUser({
			email: email,
			password: password,
			displayName: username,
		});

		const initialData = {
			username: username,
			email: email,
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
			platform: origin || "web", // track if they came from 'whatsapp', 'telegram', etc.
			currentStreak: 0,
			tier: "free",
		};

		await db.collection("users").doc(userRecord.uid).set(initialData);

		return res.status(201).json({
			message: "User created successfully",
			uid: userRecord.uid,
		});
	} catch (error) {
		console.error("Registration Error:", error);
		if (error.code === "auth/email-already-exists") {
			return res.status(409).json({ error: "Email already in use" });
		}
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
