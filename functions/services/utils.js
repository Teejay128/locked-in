function getYesterdayDate(dateString) {
	const date = new Date(dateString);
	date.setDate(date.getDate() - 1);
	return date.toISOString().split("T")[0];
}

function aggregator(weeklyTrends) {
	if (!Array.isArray(weeklyTrends)) {
		return [];
	}

	const trendMap = new Map();

	for (const entry of weeklyTrends) {
		const trends = Array.isArray(entry?.trends) ? entry.trends : entry;
		if (!Array.isArray(trends)) continue;

		for (const trend of trends) {
			if (!trend || !trend.topic) continue;

			const topic = String(trend.topic).trim();
			const count = Number(trend.count) || 0;

			const existing = trendMap.get(topic);
			if (!existing) {
				trendMap.set(topic, {
					topic,
					count,
				});
				continue;
			}

			existing.count += count;
		}
	}

	const aggregated = Array.from(trendMap.values());
	
	// Sort by count descending, then alphabetically by topic
	aggregated.sort((a, b) => {
		if (b.count !== a.count) {
			return b.count - a.count;
		}
		return a.topic.localeCompare(b.topic);
	});

	// Return top 6 trends
	return aggregated.slice(0, 6);
}

module.exports = { getYesterdayDate, aggregator };
