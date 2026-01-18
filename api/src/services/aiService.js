const { genkit } = require("genkit");
const { googleAI } = require("@genkit-ai/google-genai");

const ai = genkit({
	plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
	model: googleAI.model("gemini-2.0-flash-lite"),
});

async function generateSocialContent(originalText, platform) {
	let prompt = "";
	if (platform === "twitter") {
		prompt = `Rewrite the following text for Twitter. Keep it under 280 characters, engaging, and include 2-3 relevant hashtags. Do not use quotation marks, give options or add anything else, just provide the text that will be posted directly. Text: "${originalText}"`;
	} else if (platform === "linkedin") {
		prompt = `Rewrite the following text for a LinkedIn professional post. Use a professional but authentic tone, use line breaks for readability, and include relevant hashtags. Do not use quotation marks, give options or add anything else, just provide the text that will be posted directly. Text: "${originalText}"`;
	}

	try {
		const { text } = await ai.generate(prompt);
		return text;
	} catch (e) {
		console.error(`AI Error (${platform}):`, e);
		return originalText; // Fallback to original if AI fails
	}
}

exports.generateSocialPackage = async function (content) {
	// 1. Run AI in parallel
	const [twitterText, linkedInText] = await Promise.all([
		generateSocialContent(content, "twitter"),
		generateSocialContent(content, "linkedin"),
	]);

	// 2. Format the Links (Logic moved here!)
	return {
		twitter: {
			text: twitterText,
			link: `https://x.com/intent/post?text=${encodeURIComponent(twitterText)}`,
		},
		linkedin: {
			text: linkedInText,
			link: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInText)}`,
		},
	};
};
