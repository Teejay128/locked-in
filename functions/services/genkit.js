async function synthesizeTrends(weeklyTrends, ai, aiModel) {
	if (!Array.isArray(weeklyTrends) || weeklyTrends.length === 0) {
		return [];
	}

	const trendSummaries = [];

	for (const trend of weeklyTrends) {
		if (!trend || !trend.topic) continue;

		const topic = String(trend.topic).trim();
		const count = Number(trend.count) || 0;
		const day = Number(trend.day) || 0;

		const prompt = `Topic: ${topic}\nPlease provide a short explanation of why this topic was trending last week, based on likely public context from Google search.`;

		if (!ai || !aiModel) {
			return [];
		}

		const response = await ai.generate({
			model: aiModel,
			prompt: `${prompt}`,
			config: {
				googleSearchRetrieval: {},
				maxOutputTokens: 1000,
			},
		});

		const groundingMetadata =
			response.custom?.candidates?.[0]?.groundingMetadata || null;
		const groundingChunks = groundingMetadata?.groundingChunks || [];
		const sources = groundingChunks
			.map((chunk) => chunk.web?.uri || chunk.web?.title)
			.filter(Boolean);

		trendSummaries.push({
			topic,
			day,
			count,
			context: response.text?.trim() ?? "No context found.",
			sources,
			comment: "",
			status: "Draft",
		});
	}

	return trendSummaries;
}

module.exports = { synthesizeTrends };
