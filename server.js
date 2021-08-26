const fs = require("fs");

const express = require("express");

const app = express();

const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");

app.use(express.json());

const productSchema = new mongoose.Schema({
  id: String,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
});

const Product = mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  Product.findById(id, (err, product) => {
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
    const product = new Product({
      id: uuidv4(),
      title,
      price,
      description,
      category,
      image,
    });
    product.save();
    res.send("The Product added successfully!");
  }
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { title, price, description, category, image } = req.body;
  const updateProduct = {};
  title ? (updateProduct.title = title) : null;
  price ? (updateProduct.price = price) : null;
  description ? (updateProduct.description = description) : null;
  category ? (updateProduct.category = category) : null;
  image ? (updateProduct.image = image) : null;

  Product.findByIdAndUpdate(id, updateProduct, (err, product) => {
    if (product) {
      res.send("The product has been updated!");
    } else {
      res.send("Not found!");
    }
  });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  Product.findByIdAndDelete(id, (err, product) => {
    if (product) {
      res.send("The product has deleted!");
    } else {
      res.send("Product not found");
    }
  });
});

app.get("/products", (req, res) => {
  Product.find((err, products) => {
    if (err) {
      res.send("Not found");
    } else {
      const { title, description, category, min, max } = req.query;

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
// function initProducts() {
//   Product.findOne((err, product) => {
//     if (!product) {
//       fs.readFile("/initialProducts.json", "utf80", (err, data) => {
//         let initialProducts = JSON.parse(data);
//         initialProducts = initialProducts.map((product) => ({
//           ...product,
//           id: uuidv4(),
//         }));
//         Product.insertMany(initialProducts, (err, products) => {});
//       });
//     }
//   });
// }

// initProducts();
