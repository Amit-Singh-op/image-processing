const sharp = require("sharp");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const BUCKET_NAME = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;

const uploadToCloudStorage = async () => {
  const outputImageName = `compressed-${Date.now()}.jpg`;
  const file = storage.bucket(BUCKET_NAME).file(outputImageName);

  await file.save(outputImageBuffer, {
    resumable: false,
    metadata: {
      contentType: "image/jpeg",
    },
  });

  return `https://storage.googleapis.com/${BUCKET_NAME}/${outputImageName}`;
};

const compressImage = async (url) => {
  try {
    const imageBuffer = await axios
      .get(url, { responseType: "arraybuffer" })
      .then((res) => res.data);

    const compressedImage = await sharp(imageBuffer)
      .jpeg({ quality: 50 }) // Compress image to 50%
      .withMetadata(false)
      .toBuffer();

    const folderPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const imagePath = path.join(folderPath, `${Date.now()}-img.jpg`);

    fs.writeFileSync(imagePath, compressedImage);

    if (!BUCKET_NAME) return "Image has been uploaded to upload folder";
    const outputUrl = await uploadToCloudStorage(compressedImage); // Define this function
    return outputUrl;
  } catch (error) {
    console.error("err", error);
    throw error;
  }
};

module.exports = { compressImage };
