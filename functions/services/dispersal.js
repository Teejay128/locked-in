async function sendDiscordMessage(text) {
	const webhookUrl =
		"https://discordapp.com/api/webhooks/1492646543533146327/tHp7C0RAmDDpfWe_0hyy7NrkzKUUQCkpvXOY1R6JQH4K_iRH_7xUWlpvCicgmsK9yj6N";

	if (!webhookUrl) {
		console.error("Missing Discord Webhook URL");
		return;
	}

	try {
		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				content: text,
			}),
		});

		if (!response.ok) {
			console.error("Failed to send message to Discord");
		}
	} catch (error) {
		console.error("Error sending message to Discord:", error);
	}
}

module.exports = { sendDiscordMessage };
