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
  res.send("check");
  const { title } = req.body;
  fs.readFile("./products.json", "utf8", (err, data) => {
    const products = JSON.parse(data);
    const newProduct = {
      //  id: uuidv4(),
      id: products.length + 1,
      title,
      price: 39,
      description: "beautiful jewelry",
      category: "jewelery",
      image:
        "https://cashcow-cdn.azureedge.net/images/a45bec16-b540-45c5-9915-b5d14f42e467.jpg",
    };
    products.push(newProduct);
    fs.writeFile("./products.json", JSON.stringify(products), (err) => {});
  });
});
