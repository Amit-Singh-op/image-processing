const Queue = require("bull");
const { processImages } = require("./services/imageService");

const imageQueue = new Queue("imageProcessingQueue", {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});

imageQueue.process(async (job) => {
  const { requestId } = job.data;
  await processImages(requestId);
});

module.exports = imageQueue;
