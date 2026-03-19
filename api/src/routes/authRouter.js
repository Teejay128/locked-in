const { Router } = require("express");
const { universalAuth } = require("../middleware/authMiddleware");
const {
	generateKey,
	updateUserProfile,
} = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/generate-key", universalAuth, generateKey);
authRouter.put("/profile", universalAuth, updateUserProfile);

module.exports = authRouter;
