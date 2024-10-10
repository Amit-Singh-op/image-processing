const Status = require("../models/Status");

const getStatus = async (req, res) => {
  const { requestId } = req.params;

  try {
    const status = await Status.find({ requestId });
    res.status(200).json(status);
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getStatus };
