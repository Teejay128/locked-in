const { admin } = require("../config/firebase");
const UserModel = require("../models/userModel");
const AIService = require("../services/aiService");

exports.createEntry = async (req, res) => {
	const { content, imageUrls = [] } = req.body;

	if (!content) {
		return res
			.status(400)
			.json({ error: "Content required to create an entry." });
	}

	try {
		const user = req.user;
		const [saveResult, socialPackage] = await Promise.all([
			user.ref.collection("entries").add({
				content,
				imageUrls,
				source: user.authSource,
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			}),
			AIService.generateSocialPackage(content),
		]);

		// 3. Response
		res.json({
			success: true,
			message: "Entry saved successfully!",
			entryId: saveResult.id,
			images: imageUrls,
			social: socialPackage,
			content: content,
		});
	} catch (error) {
		console.error("Controller Error:", error);
		res.status(500).json({ error: "Server Error" });
	}
};
