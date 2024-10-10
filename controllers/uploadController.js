const Status = require("../models/Status");
const imageQueue = require("../imageQueue");
const { parseCSV } = require("../utils/csvUtils");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const WEB_HOOK_URL = process.env.WEB_HOOK_URL;

const uploadCSV = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const requestId = uuidv4();

    res.status(200).json({ requestId });

    // Parse the CSV and create products
    await parseCSV(file.path, requestId);

    // Remove the uploaded file after processing
    fs.unlinkSync(file.path);

    // Save the status
    await Status.create({ requestId, status: "PENDING" });
    // Add the requestId to the queue for processing
    await imageQueue.add({ requestId });

    // Send webhook notification after processing is complete
    if (WEB_HOOK_URL) {
      await axios.post(WEB_HOOK_URL, {
        requestId: product.requestId,
        status: Status.status,
        outputImageUrls: product.outputImageUrls,
      });
    }
  } catch (error) {
    console.error("Error uploading CSV:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { uploadCSV };
