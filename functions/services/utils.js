function getYesterdayDate(dateString) {
	const date = new Date(dateString);
	date.setDate(date.getDate() - 1);
	return date.toISOString().split("T")[0];
}

const dayNameToNumber = {
	sunday: 1,
	monday: 2,
	tuesday: 3,
	wednesday: 4,
	thursday: 5,
	friday: 6,
	saturday: 7,
};

function normalizeDayValue(day) {
	if (day === undefined || day === null) return null;

	if (typeof day === "number") {
		return Number.isInteger(day) && day >= 1 && day <= 7 ? day : null;
	}

	const text = String(day).trim().toLowerCase();
	if (!text) return null;

	const parsedNumber = parseInt(text, 10);
	if (!Number.isNaN(parsedNumber) && parsedNumber >= 1 && parsedNumber <= 7) {
		return parsedNumber;
	}

	for (const [name, value] of Object.entries(dayNameToNumber)) {
		if (text.includes(name)) {
			return value;
		}
	}

	const parsedDate = Date.parse(text);
	if (!Number.isNaN(parsedDate)) {
		return new Date(parsedDate).getDay() + 1;
	}

	return null;
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
			const dayValue = normalizeDayValue(trend.day);

			const existing = trendMap.get(topic);
			if (!existing) {
				trendMap.set(topic, {
					topic,
					count,
					day: dayValue,
					_dayValue: dayValue,
				});
				continue;
			}

			existing.count += count;
			if (
				dayValue !== null &&
				(existing._dayValue === null || dayValue < existing._dayValue)
			) {
				existing.day = dayValue;
				existing._dayValue = dayValue;
			}
		}
	}

	const aggregated = Array.from(trendMap.values()).map(
		({ _dayValue, ...rest }) => rest,
	);
	aggregated.sort((a, b) => {
		const aDay = a.day || 0;
		const bDay = b.day || 0;
		if (aDay !== bDay) return aDay - bDay;
		if (a.count !== b.count) return b.count - a.count;
		return a.topic.localeCompare(b.topic);
	});

	return aggregated.slice(0, 10);
}

module.exports = { getYesterdayDate, aggregator };
