const User = require("../models/User");
const Product = require("../models/Product");
const fs = require("fs").promises;
const path = require("path");
const { request } = require("http");


// GET /
exports.home = async (req, res) => {
  const products = await Product.find({ owner: req.session.user }).lean();
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
    owner: req.session.user
  });
  await product.save();

  req.session.message = { type: "success", message: "Product added" };
  res.redirect("/");
};

// GET /edit/:id
exports.editPage = async (req, res) => {
  const product = await Product.findById({ _id: req.params.id, owner: req.session.user }).lean();
  if (!product) {
    req.session.message = { type: "danger", message: "Unauthorized" };
    return res.redirect("/");
  }
  res.render("edit", { title: "Edit Product", product });
};

// POST /edit/:id
exports.editProduct = async (req, res) => {
  let image = req.body.old_image;

  if (req.file) {
    image = req.file.filename;
    await fs.unlink(
      path.join(__dirname, "../public/uploads", req.body.old_image),
    );
  }

  await Product.findByIdAndUpdate(req.params.id, { owner: req.session.user }, {
    ...req.body,
    image,
  });

  req.session.message = { type: "success", message: "Product updated" };
  res.redirect("/");
};

// POST /delete/:id
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete({ _id: req.params.id, owner: req.session.user });

  if (product?.image) {
    await fs.unlink(path.join(__dirname, "../public/uploads/", product.image));
  }
  req.session.message = { type: "info", message: "Product deleted" };
  res.redirect("/");
};


