const { compressImage } = require("../utils/imageUtils");
const Product = require("../models/Product");
const Status = require("../models/Status");

const processImages = async (requestId) => {
  const products = await Product.find({ requestId });

  for (const product of products) {
    try {
      await Status.updateOne({ requestId }, { status: "PROCESSING" });

      const compressedUrls = await Promise.all(
        product.inputImageUrls.map((url) => compressImage(url))
      );

      product.outputImageUrls = compressedUrls.length
        ? compressedUrls
        : product.inputImageUrls;
      await product.save();

      await Status.updateOne({ requestId }, { status: "COMPLETED" });
    } catch (error) {
      console.error(
        "Error processing images for product:",
        product.productName,
        error
      );
      await Status.updateOne({ requestId }, { status: "FAILED" });
    }
  }
};

module.exports = { processImages };
