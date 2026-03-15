const Product = require("../models/Product");
const fs = require("fs").promises;
const path = require("path");

// GET /
exports.home = async (req, res) => {
  const products = await Product.find({
    owner: req.user._id
  }).lean();

  res.render("index", { title: "Home", products });
};

// GET /add
exports.addPage = (req, res) => {
  res.render("add", { title: "Add New Product" });
};

// POST /add
exports.addProduct = async (req, res) => {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
    owner: req.user._id
  });

  await product.save();

  req.session.message = {
    type: "success",
    message: "Product added",
  };

  res.redirect("/");
};

// GET /edit/:id
exports.editPage = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    owner: req.user._id
  }).lean();

  if (!product) {
    req.session.message = { type: "danger", message: "Unauthorized" };
    return res.redirect("/");
  }

  res.render("edit", { title: "Edit Product", product });
};

// POST /edit/:id
exports.editProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    owner: req.user._id
  });

  if (!product) {
    req.session.message = { type: "danger", message: "Unauthorized" };
    return res.redirect("/");
  }

  let image = product.image;

  if (req.file) {
    image = req.file.filename;

    const filePath = path.join(
      __dirname,
      "../public/uploads",
      product.image
    );

    await fs.unlink(filePath).catch(() => {});
  }

  product.name = req.body.name;
  product.price = req.body.price;
  product.category = req.body.category;
  product.quantity = req.body.quantity;
  product.image = image;

  await product.save();

  req.session.message = { type: "success", message: "Product updated" };
  res.redirect("/");
};

// DELETE
exports.deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id
  });

  if (!product) {
    req.session.message = { type: "danger", message: "Unauthorized" };
    return res.redirect("/");
  }

  if (product.image) {
    const filePath = path.join(
      __dirname,
      "../public/uploads",
      product.image
    );

    await fs.unlink(filePath).catch(() => {});
  }

  req.session.message = { type: "info", message: "Product deleted" };
  res.redirect("/");
};