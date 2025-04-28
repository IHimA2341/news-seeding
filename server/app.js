const express = require("express");
const app = express();
const endpointsJson = require("../endpoints.json");

app.use(express.json());

app.get("/api", (req, res) => {
  console.log(endpointsJson);
  return res.status(200).send({ endpoints: endpointsJson });
});

app.get("/*splat", (req, res) => {
  res.send(404).send({ msg: "Page not found" });
});

app.use((err, req, res, next) => {
  res.status(400).send({ msg: err });
});

module.exports = app;
