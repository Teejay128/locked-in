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

		// Aggregate trends from all list containers, grouped by topic
		const trendCountMap = new Map();

		timelineChildren.each((index, container) => {
			const itemElements = $(container).find("ol.trend-card__list > li");
			const topTenItems = itemElements.slice(0, 10);

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
					const existing = trendCountMap.get(trendName);
					trendCountMap.set(trendName, {
						topic: trendName,
						count: existing ? existing.count + 1 : 1,
					});
				}
			});
		});

		if (trendCountMap.size === 0) {
			throw new Error("No trend items found in any list-container");
		}

		// Convert to array of objects with topic and count fields
		const aggregatedTrends = Array.from(trendCountMap.values());

		console.log(aggregatedTrends);
		return aggregatedTrends;
	} catch (error) {
		console.error("Failed to fetch context from Trends24:", error);
		throw error;
      }
}

module.exports = { fetchNaijaTrendingContext };
