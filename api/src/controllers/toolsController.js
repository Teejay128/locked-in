const AIService = require("../services/aiService");

exports.createSocialDraft = async (req, res) => {
	const { content } = req.body;

	if (!content) {
		return res.status(400).json({ error: "Content is required" });
	}

	if (content.length > 500) {
		return res
			.status(400)
			.json({ error: "Guest drafts are limited to 500 characters." });
	}

	try {
		const socialPackage = await AIService.generateSocialPackage(content);

		// 3. Response
		res.json({
			success: true,
			isGuest: true, // Helpful flag for frontend
			social: socialPackage,
		});
	} catch (error) {
		console.error("Tools Controller Error:", error);
		res.status(500).json({ error: "Server Error" });
	}
};
