const { Router } = require("express");
const journalController = require("../controllers/journalController");
const {validateApiKey} = require("../middleware/authMiddleware");

const journalRouter = Router();

// journalRouter.get("/", journalController.fetchEntries);
journalRouter.post("/entry", validateApiKey, journalController.createEntry);

module.exports = journalRouter;
