const { admin } = require("../config/firebase");
const UserModel = require("../models/userModel");
const AIService = require("../services/aiService");

exports.createEntry = async (req, res) => {
	const { platform, platformId, content, imageUrls = [] } = req.body;

	if (!platform || !platformId || !content) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		const userRef = await UserModel.getOrCreate(platform, platformId);

		const [saveResult, socialPackage] = await Promise.all([
			userRef.collection("entries").add({
				content,
				imageUrls,
				source: platform,
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			}),
			AIService.generateSocialPackage(content),
		]);

		// 3. Response
		res.json({
			success: true,
			message: "Note saved!",
			original: content,
			images: imageUrls,
			social: socialPackage,
		});
	} catch (error) {
		console.error("Controller Error:", error);
		res.status(500).json({ error: "Server Error" });
	}
};
