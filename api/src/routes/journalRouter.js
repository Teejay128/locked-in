const { Router } = require("express");
const journalController = require("../controllers/journalController");
const { universalAuth } = require("../middleware/authMiddleware");

const journalRouter = Router();

// journalRouter.get("/", journalController.fetchEntries);
journalRouter.post("/entry", universalAuth, journalController.createEntry);

module.exports = journalRouter;
