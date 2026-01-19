const crypto = require("crypto");

exports.generateApiKey = () => {
	// Generates a random string like "mk_live_a1b2c3d4..."
	return "lock_in_" + crypto.randomBytes(16).toString("hex");
};
