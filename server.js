const fs = require("fs");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
app.use(express.json());

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

app.post("/products", (req, res) => {
  const { title } = req.body;
  const { price } = req.body;
  const { description } = req.body;
  const { category } = req.body;
  const { image } = req.body;
  res.send("check");

  fs.readFile("./products.json", "utf8", (err, data) => {
    const products = JSON.parse(data);
    const newProduct = {
      id: uuidv4(),
      title,
      price,
      description,
      category,
      image,
    };
    products.push(newProduct);
    fs.writeFile("./products.json", JSON.stringify(products), (err) => {});
  });
});
