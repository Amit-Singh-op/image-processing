// utils/csvUtils.js

const fs = require("fs");
const csv = require("csv-parser");
const Product = require("../models/Product");

const parseCSV = async (filePath, requestId) => {
  return new Promise((resolve, reject) => {
    const products = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        const {
          "S. No.": serialNumber,
          "Product Name": productName,
          "Input Image Urls": inputImageUrls,
        } = row;

        const product = new Product({
          requestId,
          serialNumber: parseInt(serialNumber),
          productName,
          inputImageUrls: inputImageUrls.split(",").map((url) => url.trim()),
        });

        // Save each product
        await product.save();
        products.push(product);
      })
      .on("end", () => {
        resolve(products); // Resolve with the list of products
      })
      .on("error", (error) => {
        reject(error); // Reject on error
      });
  });
};

module.exports = { parseCSV };
