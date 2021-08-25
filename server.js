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
    const product = products.find((product) => product.id === id);
    if (product) {
      res.send(product);
    } else {
      res.send("Product not found!");
    }
  });
});

app.listen(8000);

app.post("/products", (req, res) => {
  const { title, price, description, category, image } = req.body;
  if (
    title === "" ||
    price === "" ||
    description === "" ||
    category === "" ||
    image === ""
  ) {
    res.send(
      "Missing details about the product, the product was not added to the database!"
    );
  } else {
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
    res.send("The Product added successfully!");
  }
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { title, price, description, category, image } = req.body;
  fs.readFile("./products.json", "utf8", (err, data) => {
    const products = JSON.parse(data);
    const product = products.find((product) => product.id === id);
    if (product) {
      product.title = title;
      product.price = price;
      product.description = description;
      product.category = category;
      product.image = image;
      fs.writeFile("./products.json", JSON.stringify(products), (err) => {});
      res.send("The product has been updated!");
    } else {
      res.send("Product not found, no data updated!");
    }
  });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("./products.json", "utf8", (err, data) => {
    const products = JSON.parse(data);
    const product = products.find((product) => product.id === id);
    if (product) {
      const updateProducts = products.filter((product) => product.id !== id);
      fs.writeFile(
        "./products.json",
        JSON.stringify(updateProducts),
        (err) => {}
      );
      //       const productIndex = products.findIndex((product) => product.id === id);
      //       products.splice(productIndex, 1);
      //       fs.writeFile("./products.json", JSON.stringify(products), (err) => {});
      res.send("The product has deleted!");
    } else {
      res.send("Product not found");
    }
  });
});
