const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

if (!admin.apps.length) {
	const serviceAccountPath = path.resolve(
		__dirname,
		"../service-account.json"
	);

	if (fs.existsSync(serviceAccountPath)) {
		console.log("🔥 Running Locally: Using service-account.json");
		admin.initializeApp({
			credential: admin.credential.cert(require(serviceAccountPath)),
		});
	} else {
		// CLOUD RUN MODE: Use automatic IAM authentication
		console.log("☁️ Running in Cloud: Using Default Credentials");
		admin.initializeApp({
			credential: admin.credential.applicationDefault(),
		});
	}
}

const db = admin.firestore();
module.exports = { db, admin };
