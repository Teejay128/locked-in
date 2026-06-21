const { db, admin } = require("../config/firebase");
const { generateApiKey } = require("../utils/cryptoUtils");

exports.generateKey = async (req, res) => {
	const user = req.user;
	if (user.authSource !== "web_app") {
		return res.status(403).json({
			error: "Forbidden: API keys can only be generated via the web dashboard.",
		});
	}
	try {
		const newKey = generateApiKey();

		await user.ref.set(
			{
				apiKey: newKey,
				updatedAt: admin.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true },
		);

		res.json({ apiKey: newKey });
	} catch (error) {
		res.status(500).json({ error: "Failed to generate key" });
	}
};

exports.updateUserProfile = async (req, res) => {
	const { fullName, username, bio, location, company, skills, links } =
		req.body;
	const user = req.user;

	try {
		const updatePayload = {
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		};

		if (fullName !== undefined) {
			updatePayload.fullName = String(fullName).trim();
		}
		if (username) {
			updatePayload.username = String(username).trim();
			updatePayload.usernameIsDefault = false; // Flag that they changed it
		}
		if (bio !== undefined) {
			updatePayload.bio = String(bio).trim();
		}
		if (location !== undefined) {
			updatePayload.location = String(location).trim();
		}
		if (company !== undefined) {
			updatePayload.company = String(company).trim();
		}
		if (skills !== undefined) {
			if (Array.isArray(skills)) {
				updatePayload.skills = skills
					.map((s) => String(s).trim())
					.filter(Boolean);
			} else {
				updatePayload.skills = [];
			}
		}
		if (links !== undefined) {
			if (typeof links === "object" && links !== null) {
				updatePayload.links = {
					github: links.github ? String(links.github).trim() : "",
					linkedin: links.linkedin
						? String(links.linkedin).trim()
						: "",
					twitter: links.twitter ? String(links.twitter).trim() : "",
					portfolio: links.portfolio
						? String(links.portfolio).trim()
						: "",
				};
			} else {
				updatePayload.links = {};
			}
		}

		await user.ref.update(updatePayload);

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
		});
	} catch (error) {
		console.error("Profile Update Error:", error);
		return res.status(500).json({ error: "Failed to update profile." });
	}
};
