const { admin } = require("../config/firebase");
const AIService = require("../services/aiService");

exports.createEntry = async (req, res) => {
	const { content, imageUrls = [], date, tags = [] } = req.body;

	if (!content) {
		return res
			.status(400)
			.json({ error: "Content required to create an entry." });
	}

	try {
		const requestTime = new Date();
		const user = req.user;

		const socialPackage = await AIService.generateSocialPackage(content);
		const entryDate = date || requestTime.toISOString().split("T")[0];
		const saveResult = await user.ref.collection("entries").add({
			content,
			imageUrls,
			date: entryDate,
			tags: Array.isArray(tags)
				? tags.map((t) => String(t).trim()).filter(Boolean)
				: [],
			source: user.authSource || "web_app",
			social: socialPackage,
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
		});

		// 3. Response
		res.json({
			success: true,
			message: "Entry saved successfully!",
			entryId: saveResult.id,
			images: imageUrls,
			social: socialPackage,
			content: content,
			createdAt: requestTime.toISOString(),
		});
	} catch (error) {
		console.error("Controller Error:", error);
		res.status(500).json({ error: "Server Error" });
	}
};
