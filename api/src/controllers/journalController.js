const { admin } = require("../config/firebase");
const UserModel = require("../models/userModel");
const AIService = require("../services/aiService");

exports.createEntry = async (req, res) => {
	const { content, imageUrls = [] } = req.body;
	const user = req.user;

	if (!content) {
		return res.status(400).json({ error: "Content required" });
	}

	try {
		const [saveResult, socialPackage] = await Promise.all([
			user.ref.collection("entries").add({
				content,
				imageUrls,
				source: "api",
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			}),
			AIService.generateSocialPackage(content),
		]);

		// 3. Response
		res.json({
			success: true,
			message: "Entry saved!",
			images: imageUrls,
			social: socialPackage,
		});
	} catch (error) {
		console.error("Controller Error:", error);
		res.status(500).json({ error: "Server Error" });
	}
};
