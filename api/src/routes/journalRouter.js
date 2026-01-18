const { Router } = require("express");
const journalController = require("../controllers/journalController");

const journalRouter = Router();

// journalRouter.get("/", journalController.fetchEntries);
journalRouter.post("/entry", journalController.createEntry);

module.exports = journalRouter;
