const Product = require("../models/Product");
const fs = require("fs").promises;
const path = require("path");

/* HOME */
exports.home = async (req, res) => {
  const products = await Product.find({ owner: req.user._id }).lean();
  res.render("index", { title: "Home", products });
};

/* ADD PAGE */
exports.addPage = (_, res) => {
  res.render("add", { title: "Add Product" });
};

/* ADD */
exports.addProduct = async (req, res) => {
  await Product.create({
    ...req.body,
    image: req.file.filename,
    owner: req.user._id,
  });

  req.session.message = { type: "success", message: "Product added" };
  res.redirect("/");
};

/* EDIT PAGE */
exports.editPage = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    owner: req.user._id,
  }).lean();

  if (!product) {
    req.session.message = { type: "danger", message: "Unauthorized" };
    return res.redirect("/");
  }

  res.render("edit", { title: "Edit Product", product });
};

/* EDIT */
exports.editProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!product) {
    req.session.message = { type: "danger", message: "Unauthorized" };
    return res.redirect("/");
  }

  if (req.file) {
    const oldPath = path.join(
      __dirname,
      "../public/uploads",
      product.image
    );

    await fs.unlink(oldPath).catch(() => {});
    product.image = req.file.filename;
  }

  Object.assign(product, req.body);

  await product.save();

  req.session.message = { type: "success", message: "Product updated" };
  res.redirect("/");
};

/* DELETE */
exports.deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
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