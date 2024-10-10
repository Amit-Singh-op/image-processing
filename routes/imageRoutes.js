const express = require("express");
const multer = require("multer");
const { uploadCSV } = require("../controllers/uploadController");
const { getStatus } = require("../controllers/statusController");
const { getProducts } = require("../controllers/productController");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadCSV);
router.get("/status/:requestId", getStatus);
router.get("/", getProducts);

module.exports = router;
