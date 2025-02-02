const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getProducts };
