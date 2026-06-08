const cheerio = require("cheerio");

async function fetchNaijaTrendingContext(url) {
	try {
		// Fetch HTML content from the provided URL
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch URL: ${response.status} ${response.statusText}`,
			);
		}

		const html = await response.text();

		// Parse HTML with cheerio
		const $ = cheerio.load(html);

		const dayNameToNumber = {
			sunday: 1,
			monday: 2,
			tuesday: 3,
			wednesday: 4,
			thursday: 5,
			friday: 6,
			saturday: 7,
		};

		const normalizeDayLabel = (label) => {
			if (!label) return null;
			const raw = String(label).trim().toLowerCase();
			if (!raw) return null;

			const dayNumber = parseInt(raw, 10);
			if (!Number.isNaN(dayNumber)) {
				return dayNumber;
			}

			for (const [name, value] of Object.entries(dayNameToNumber)) {
				if (raw.includes(name)) {
					return value;
				}
			}

			const parsedDate = Date.parse(raw);
			if (!Number.isNaN(parsedDate)) {
				return new Date(parsedDate).getDay() + 1;
			}

			return null;
		};

		const timelineElements = $(
			"#timeline-container > div.px-2.scroll-smooth.flex.gap-x-4.w-fit.pt-8",
		);
		if (!timelineElements.length) {
			throw new Error("No #timeline-container element found on the page");
		}

		const timelineChildren = timelineElements
			.children("div.list-container")
			.filter((_, el) => $(el).find("ol.trend-card__list").length > 0);
		if (!timelineChildren.length) {
			throw new Error(
				"No valid list-container children with trend lists found in #timeline-container",
			);
		}

		// Aggregate trends from all list containers, grouped by topic and day
		const trendCountMap = new Map();

		timelineChildren.each((index, container) => {
			const itemElements = $(container).find("ol.trend-card__list > li");
			const topTenItems = itemElements.slice(0, 10);

			const rawDayLabel = $(container)
				.find(
					".trend-card__header, .trend-card__title, h3, h2, .date, time",
				)
				.first()
				.text()
				.trim();

			const normalizedDay = normalizeDayLabel(rawDayLabel);
			const dayLabel =
				normalizedDay !== null ? normalizedDay : Math.min(index + 1, 7);
			topTenItems.each((_, li) => {
				const linkText = $(li).find("a.trend-link").text().trim();
				const trendName =
					linkText ||
					$(li)
						.find(".trend-name")
						.text()
						.replace(/\s+/g, " ")
						.trim();

				if (trendName) {
					const key = `${trendName}||${dayLabel}`;
					const existing = trendCountMap.get(key);
					trendCountMap.set(key, {
						topic: trendName,
						day: dayLabel,
						count: existing ? existing.count + 1 : 1,
					});
				}
			});
		});

		if (trendCountMap.size === 0) {
			throw new Error("No trend items found in any list-container");
		}

		// Convert to array of objects with topic, day and count fields
		const aggregatedTrends = Array.from(trendCountMap.values());

		console.log(aggregatedTrends);
		return aggregatedTrends;
	} catch (error) {
		console.error("Failed to fetch context from Trends24:", error);
		throw error;
	}
}

module.exports = { fetchNaijaTrendingContext };
