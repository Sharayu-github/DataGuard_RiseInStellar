const mongoose = require('mongoose');

const DatasetSchema = new mongoose.Schema(
  {
    datasetId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    ownerWallet: {
      type: String,
      required: true,
      index: true
    },
    fileHash: {
      type: String,
      required: true
    },
    storageUrl: {
      type: String,
      required: true
    },
    description: String,
    fileName: String,
    fileSize: Number,
    version: {
      type: Number,
      default: 1
    },
    versions: [{
      version: Number,
      fileHash: String,
      timestamp: Date,
      changeDescription: String
    }],
    blockchainTxId: String,
    blockchainVerified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dataset', DatasetSchema);
