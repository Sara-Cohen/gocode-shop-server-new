const fs = require("fs");

const express = require("express");

const app = express();

const { v4: uuidv4 } = require("uuid");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
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

app.get("/products", (req, res) => {
  fs.readFile("./products.json", "utf8", (err, data) => {
    if (err) {
      fs.writeFile("products.json", "utf8", (err) => {});
      res.send("Not found");
    } else {
      const { title, description, category, min, max } = req.query;
      let products = JSON.parse(data);
      if (title) {
        products = products.filter((product) =>
          product.title
            ? product.title.toLowerCase().includes(title.toLocaleLowerCase())
            : false
        );
      }
      if (description) {
        products = products.filter((product) =>
          product.description
            ? product.description
                .toLowerCase()
                .includes(description.toLocaleLowerCase())
            : false
        );
      }
      if (category) {
        products = products.filter((product) =>
          product.category ? product.category.includes(category) : false
        );
      }
      if (min) {
        products = products.filter((product) => product.price >= min);
      }
      if (max) {
        products = products.filter((product) => product.price <= max);
      }
      res.send(products);
    }
  });
});

app.listen(8000);
