const { Router } = require("express");
const toolsController = require("../controllers/toolsController");

const toolsRouter = Router();

toolsRouter.post("/social", toolsController.createSocialDraft);

module.exports = toolsRouter;
