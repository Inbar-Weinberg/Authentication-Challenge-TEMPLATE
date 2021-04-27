const express = require("express");
const app = express();
const { users, api } = require("./routes");
app.use(express.json());

app.use("/api", api);
app.use("/users", users);

app.use("*", (req, res) => {
  res.sendStatus(404);
});
module.exports = app;
