const express = require("express");
const cors = require("cors");
require("dotenv").config();

const journalRouter = require("./routes/journalRouter");
const toolsRouter = require("./routes/toolsRouter");
const authRouter = require("./routes/authRouter")

const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Register Routes
app.use("/journal", journalRouter);
app.use("/tools", toolsRouter);
app.use("/auth", authRouter)

app.get("/", (req, res) => {
	res.send("Motivation API is running 🚀");
});

module.exports = app;
