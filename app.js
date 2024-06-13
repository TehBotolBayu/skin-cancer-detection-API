require("dotenv").config();

const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 3000,
  cors = require("cors"),
  router = require("./routes"),
  { loadModel, predict } = require('./utils/tfutil');

app.use(express.json({ strict: false }));

app.use(cors());
app.use("/", router);

app.get("*", (req, res) => {
  return res.status(404).json({
    error: "End point is not registered",
  });
});

module.exports = app;