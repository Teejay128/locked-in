const { Router } = require("express");
const { validateFirebaseToken } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

const authRouter = Router();

authRouter.post(
	"/generate-key",
	validateFirebaseToken,
	authController.generateKey,
);

module.exports = authRouter;
