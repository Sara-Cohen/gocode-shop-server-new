const fs = require("fs");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});
app.get("/products", (req, res) => {
  fs.readFile("./products.json", "utf8", (err, data) => {
    res.send(JSON.parse(data));
  });
});
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("./products.json", "utf8", (err, data) => {
    const products = JSON.parse(data);
    const product = products.find((a) => a.id === id);
    res.send(product);
  });
});
app.listen(8000);
