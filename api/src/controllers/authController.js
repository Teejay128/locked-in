const { db, admin } = require("../config/firebase");
const { generateApiKey } = require("../utils/cryptoUtils");

exports.generateKey = async (req, res) => {
	const user = req.user;
	if (user.authSource !== "web_app") {
		return res.status(403).json({
			error: "Forbidden: API keys can only be generated via the web dashboard.",
		});
	}
	try {
		const newKey = generateApiKey();

		await user.ref.set(
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

exports.updateUserProfile = async (req, res) => {
	const { username, bio } = req.body;
	const user = req.user;

	try {
		const updatePayload = {
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		};

		if (username) {
			updatePayload.username = username;
			updatePayload.usernameIsDefault = false; // Flag that they changed it
		}
		if (bio !== undefined) {
			updatePayload.bio = bio;
		}

		await user.ref.update(updatePayload);

		return res.status(20).json({
			success: true,
			message: "Profile updated successfully",
		});
	} catch (error) {
		console.error("Profile Update Error:", error);
		return res.status(500).json({ error: "Failed to update profile." });
	}
};
