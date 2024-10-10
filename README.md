# Technical Design Document for Image Processing System

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
   - [High-Level Architecture](#high-level-architecture)
   - [Component Description](#component-description)
3. [Data Models](#data-models)
   - [Product Model](#product-model)
   - [Status Model](#status-model)
4. [API Specifications](#api-specifications)
   - [Upload API](#upload-api)
   - [Status API](#status-api)
5. [Workflow](#workflow)
6. [Dependencies](#dependencies)
7. [Setup Instructions](#setup-instructions)
8. [Conclusion](#conclusion)

## Overview

This project provides a system for uploading CSV files containing product information and associated image URLs. The system processes these images by compressing them to 50% of their original quality and stores the output. It notifies users via a webhook when the processing is complete.

## System Architecture

### High-Level Architecture

The architecture consists of several key components working together to handle user requests efficiently.

![System Architecture](https://www.example.com/path/to/architecture-diagram) <!-- Replace with actual diagram link -->

1. **API Gateway**: A Node.js Express server that handles incoming requests from the client.
2. **Database**: MongoDB is used for storing product information and processing status.
3. **Image Processing Service**: A background service that processes images, using Bull for task queuing and compression.
4. **Webhook Service**: A service that sends notifications to users once processing is complete.
5. **Cloud Storage**: A service where processed images are stored and accessible via URLs.

### Component Description

1. **API Gateway (Express.js)**

   - This is the main entry point for client requests.
   - It provides endpoints for uploading CSV files and checking processing statuses.

2. **Database (MongoDB)**

   - MongoDB is used to store the `Product` and `Status` models.
   - Each product entry references its processing status.

3. **Image Processing Service**

   - Uses Bull to queue image processing tasks asynchronously.
   - Compresses images to 50% quality using the Sharp library.

4. **Webhook Service**

   - Sends HTTP requests to user-defined webhook URLs upon the completion of image processing.

5. **Cloud Storage**
   - Stores compressed images and generates accessible URLs for each processed image.

## Data Models

### Product Model

This model stores information about each product and its processing status.

```javascript
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  serialNumber: { type: Number, required: true },
  productName: { type: String, required: true },
  inputImageUrls: { type: [String], required: true },
  outputImageUrls: { type: [String], default: [] },
  statusId: { type: mongoose.Schema.Types.ObjectId, ref: "Status" },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
```

### Status Model

This model tracks the processing status of each request.

```javascript
const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
    default: "PENDING",
  },
});

const Status = mongoose.model("Status", StatusSchema);
module.exports = Status;
```

## API Specifications

### Upload API

- **Method**: `POST /api/images/upload`
- **Description**: Accepts a CSV file and returns a unique request ID along with the initial status.
- **Request Body**: CSV file containing product details.
- **Response**:
  ```json
  {
    "requestId": "unique-request-id"
  }
  ```

### Status API

- **Method**: `GET /api/images/status/:requestId`
- **Description**: Fetches the current status of processing for the given request ID.
- **Response**:
  ```json
  {
    "status": "PROCESSING",
    "requestId": "unique-request-id"
  }
  ```

## Workflow

1. **User Uploads CSV**:
   - Users upload a CSV file through the client interface.
2. **API Gateway Receives CSV**:

   - The API extracts the product information from the CSV and generates a unique request ID.

3. **Image Processing Queue**:

   - The API adds each image URL from the product entries to a Bull queue.
   - A new status document is created with the initial status set to `PENDING`.

4. **Image Processing**:

   - Workers consume tasks from the Bull queue, compressing each image to 50% quality using the Sharp library and uploading it to cloud storage.
   - The output image URLs are collected and stored in the corresponding Product document.

5. **Status Update**:

   - As images are processed, the status document is updated (e.g., from `PROCESSING` to `COMPLETED`).

6. **Webhook Notification**:
   - Upon processing completion, a notification is sent to the specified webhook URL, providing the request ID and status.

## Dependencies

- Node.js
- Express.js
- MongoDB
- Mongoose
- Bull
- Multer (for file uploads)
- Sharp (for image processing)
- dotenv (for managing environment variables)
- path

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   - Create a `.env` file in the root directory and add necessary configurations, such as:
     ```
     MONGODB_URI=<your-mongodb-uri>
     REDIS_HOST=127.0.0.1
     REDIS_PORT=6379
     ```

4. **Run the application**:

   ```bash
   npm start
   ```

5. **Start Redis Server** (required for Bull):
   ```bash
   redis-server
   ```

## Conclusion

This document outlines the architecture, components, and workflow of the image processing system. Each component's role and functionality have been detailed, ensuring a comprehensive understanding of how the system operates. This modular approach enables scalability and maintainability to handle multiple user requests efficiently.
