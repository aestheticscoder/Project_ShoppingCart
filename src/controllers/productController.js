const { uploadFiles } = require("../aws/aws");
const productModel = require("../models/productModel");
const { sizeCheck } = require("../utils/validation");
const { ObjectIdCheck } = require("../utils/validation");

// Create Product

const createProduct = async (req, res) => {
  try {
    const files = req.files;
    const {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes,
      installments,
    } = req.body;
    if (
      !title ||
      !description ||
      !price ||
      !currencyId ||
      !currencyFormat ||
      !isFreeShipping ||
      !style ||
      !availableSizes ||
      !installments
    ) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Missing Field. Please Enter all Fields",
        });
    }
    const product = await productModel.findOne({ title });
    if (product) {
      return res
        .status(400)
        .json({ status: false, message: "Product Title Already Exists" });
    }
    if (!availableSizes) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Invalid Size. Please Enter Valid Sizes",
        });
    }
    if (
      !sizeCheck(
        availableSizes
          .toUpperCase()
          .split(",")
          .map((e) => e.trim())
      )
    ) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Invalid Size. Please Enter Valid Sizes",
        });
    }
    if (!Number.isInteger(Number(price))) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter Valid Price" });
    }
    if (currencyId != "INR") {
      return res
        .status(400)
        .json({ status: false, message: "Please Enter Valid Currency" });
    }
    if (currencyFormat != "₹") {
      return res
        .status(400)
        .json({ status: false, message: "Please Enter Valid Currency Format" });
    }
    if (files.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Please Upload Product Image" });
    }
    const url = await uploadFiles(files[0]);
    let productImage = url;
    const productDetail = {
      title: title,
      description: description,
      price: price,
      currencyId: currencyId,
      currencyFormat: currencyFormat,
      isFreeShipping: isFreeShipping,
      productImage: productImage,
      style: style,
      availableSizes: availableSizes
        .toUpperCase()
        .split(",")
        .map((e) => e.trim()),
      installments: installments,
    };

    const newProduct = await productModel.create(productDetail);
    return res
      .status(201)
      .json({ status: true, message: "Product Created", data: newProduct });
  } catch (error) {
    if (error.message.includes("duplicate")) {
      return res.status(400).json({ status: false, message: error.message });
    } else if (error.message.includes("validation")) {
      return res.status(400).json({ status: false, message: error.message });
    } else {
      return res.status(500).json({ status: false, message: error.message });
    }
  }
};

// Get all Products

const getProduct = async (req, res) => {
  try {
    const { size, priceSort, name, priceGreaterThan, priceLessThan } =
      req.query;
    const filterDetail = { isDeleted: false };
    if (size) {
      filterDetail.availableSizes = size;
    }
    if (name) {
      filterDetail.title = { $regex: name, $options: "i" };
    }
    if (priceGreaterThan) {
      filter.price = { $gt: parseFloat(priceGreaterThan) };
    }
    if (priceLessThan) {
      filter.price = { ...filter.price, $lt: parseFloat(priceLessThan) };
    }
    let sortOption = {};
    if (priceSort) {
      sortOption.price = JSON.parse(parseInt(priceSort));
    }
    const products = await productModel.find(filterDetail).sort(sortOption);
    if (products.length == 0) {
      return res
        .status(404)
        .json({ status: false, message: "Products not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Products found", data: products });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
// Get Product by ID

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res
        .status(400)
        .json({ status: false, message: "ProductId not found" });
    }
    if (!ObjectIdCheck(productId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ProductId" });
    }
    const product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Product found", data: product });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Product

const updateProduct = async (req, res) => {
  try {
    const { title, productImage } = req.body;
    const productId = req.params.productId;
    if (!productId) {
      return res
        .status(400)
        .json({ status: false, message: "ProductId not found" });
    }
    if (!ObjectIdCheck(productId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid productId" });
    }
    const product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    if (!req.body || Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter Data" });
    }
    if (productImage) {
      const url = await uploadFiles(req.files[0]);
      req.body.productImage = url;
    }
    if (title) {
      const titleCheck = await productModel.findOne({ title: title });
      if (titleCheck) {
        return res
          .status(400)
          .json({ status: false, message: "Product title already exists" });
      } else {
        req.body.title = title;
      }
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Product Updated", data: updatedProduct });
  } catch (error) {
    if (error.message.includes("duplicate")) {
      res.status(400).json({ status: false, message: error.message });
    } else if (error.message.includes("validation")) {
      res.status(400).json({ status: false, message: error.message });
    } else {
      res.status(500).json({ status: false, message: error.message });
    }
  }
};

// Delete Product

const deletedProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res
        .status(400)
        .json({ status: false, message: "ProductId not found" });
    }
    if (!ObjectIdCheck(productId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid productId" });
    }
    const product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();
    res.status(200).json({ status: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getProductById,
  updateProduct,
  deletedProduct,
};
