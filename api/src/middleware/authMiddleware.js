const { db, admin } = require("../config/firebase");

exports.validateApiKey = async (req, res, next) => {
	// 1. Get the Key from Headers
	const apiKey = req.headers["x-api-key"];

	if (!apiKey) {
		return res
			.status(401)
			.json({ error: "Missing API Key (x-api-key header)" });
	}

	try {
		// 2. Lookup User by API Key
		// Note: We need a Composite Index for this query to be fast later
		const usersSnapshot = await db
			.collection("users")
			.where("apiKey", "==", apiKey)
			.limit(1)
			.get();

		if (usersSnapshot.empty) {
			return res.status(403).json({ error: "Invalid API Key" });
		}

		// 3. Attach User to Request Object
		// This makes the user available to ALL controllers
		const userDoc = usersSnapshot.docs[0];
		req.user = {
			id: userDoc.id,
			ref: userDoc.ref,
			data: userDoc.data(),
		};

		next(); // Pass control to the controller
	} catch (error) {
		console.error("Auth Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.validateFirebaseToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Missing Auth Token" });
	}

	const token = authHeader.split("Bearer ")[1];

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		req.uid = decodedToken.uid; // Attach UID to request
		next();
	} catch (error) {
		res.status(403).json({ error: "Invalid Token" });
	}
};
