const { db, admin } = require("../config/firebase");

exports.universalAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith("Bearer ")) {
			const token = authHeader.split("Bearer ")[1];
			const decodedToken = await admin.auth().verifyIdToken(token);

			const userDoc = await db
				.collection("users")
				.doc(decodedToken.uid)
				.get();
			if (!userDoc.exists) {
				return res
					.status(403)
					.json({ error: "User profile not found in database." });
			}

			req.user = {
				id: userDoc.id,
				ref: userDoc.ref,
				data: userDoc.data(),
				authSource: "web_app",
			};

			return next();
		}

		// implement source here somehow...
		// maybe through x-auth-source header
		// just something to know what platform is being used
		const apiKey = req.headers["x-api-key"];
		if (apiKey) {
			// use a composite index to make this faster...
			const usersSnapshot = await db
				.collection("users")
				.where("apiKey", "==", apiKey)
				.limit(1)
				.get();

			if (usersSnapshot.empty) {
				return res.status(403).json({ error: "Invalid API Key." });
			}
			const userDoc = usersSnapshot.docs[0];
			req.user = {
				id: userDoc.id,
				ref: userDoc.ref,
				data: userDoc.data(),
				authSource: "external",
			};

			return next(); // Let them in
		}

		return res.status(401).json({
			error: "Missing Authentication. Provide a Bearer token or x-api-key header.",
		});
	} catch (error) {
		console.error("Universal Auth Error:", error);

		if (error.code && error.code.startsWith("auth/")) {
			return res
				.status(401)
				.json({ error: "Invalid or expired Firebase token." });
		}

		return res
			.status(500)
			.json({ error: "Internal Server Error during authentication." });
	}
};
