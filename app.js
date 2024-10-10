const express = require("express");
const connectDB = require("./config/database");
const imageRoutes = require("./routes/imageRoutes");
const cors = require("cors");
const app = express();
require("dotenv").config();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
