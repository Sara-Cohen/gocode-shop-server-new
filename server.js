const fs = require("fs");

const express = require("express");

const app = express();

const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");
app.use(express.json());

const productSchema = new mongoose.Schema({
  id: String,
  title: String,
  price: String,
  description: String,
  category: String,
  image: String,
});

const Product = mongoose.model("Product", productSchema);

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

app.post("/products", (req, res) => {
  const { title, price, description, category, image } = req.body;
  const product = new Product({
    id: uuidv4(),
    title,
    price,
    description,
    category,
    image,
  });

  product.save();
  res.send("OK!");
});

mongoose.connect(
  "mongodb://localhost/gocode_shop",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => {
    app.listen(8000);
  }
);
