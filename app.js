const express = require("express");
const app = express();
const { users, api, options } = require("./routes");
app.use(express.json());

app.use("/api/v1", api);
app.use("/users", users);
app.options("/", options);
app.use("*", (req, res) => {
  res.sendStatus(404);
});
module.exports = app;
