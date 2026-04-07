const Dataset = require('../models/Dataset.model');

exports.registerDataset = async (req, res) => {
  try {
    const { datasetId, name, ownerWallet, fileHash, storageUrl, description, fileName, fileSize } = req.body;

    // Validate required fields
    if (!datasetId || !name || !ownerWallet || !fileHash || !storageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if dataset already exists
    const existingDataset = await Dataset.findOne({ datasetId });
    if (existingDataset) {
      return res.status(409).json({
        success: false,
        message: 'Dataset ID already exists'
      });
    }

    // Create dataset
    const dataset = new Dataset({
      datasetId,
      name,
      ownerWallet,
      fileHash,
      storageUrl,
      description,
      fileName,
      fileSize,
      versions: [{
        version: 1,
        fileHash,
        timestamp: new Date(),
        changeDescription: 'Initial registration'
      }]
    });

    await dataset.save();

    res.status(201).json({
      success: true,
      message: 'Dataset registered successfully',
      dataset: {
        datasetId: dataset.datasetId,
        name: dataset.name,
        fileHash: dataset.fileHash
      }
    });
  } catch (error) {
    console.error('Register dataset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering dataset: ' + error.message
    });
  }
};

exports.getDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;

    const dataset = await Dataset.findOne({ datasetId });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    res.json({
      success: true,
      dataset
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dataset: ' + error.message
    });
  }
};

exports.getDatasets = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const datasets = await Dataset.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Dataset.countDocuments();

    res.json({
      success: true,
      datasets,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching datasets: ' + error.message
    });
  }
};

exports.updateDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { fileHash, changeDescription, updatedByWallet } = req.body;

    const dataset = await Dataset.findOne({ datasetId });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Verify ownership
    if (dataset.ownerWallet !== updatedByWallet) {
      return res.status(403).json({
        success: false,
        message: 'Only dataset owner can update'
      });
    }

    // Create new version
    const newVersion = {
      version: (dataset.version || 1) + 1,
      fileHash,
      timestamp: new Date(),
      changeDescription
    };

    dataset.versions.push(newVersion);
    dataset.version = newVersion.version;
    dataset.fileHash = fileHash;
    dataset.updatedAt = new Date();

    await dataset.save();

    res.json({
      success: true,
      message: 'Dataset updated successfully',
      dataset: {
        datasetId: dataset.datasetId,
        version: dataset.version,
        fileHash: dataset.fileHash
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating dataset: ' + error.message
    });
  }
};

exports.getDatasetHistory = async (req, res) => {
  try {
    const { datasetId } = req.params;

    const dataset = await Dataset.findOne({ datasetId });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    res.json({
      success: true,
      datasetId,
      versions: dataset.versions || [],
      currentVersion: dataset.version || 1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching history: ' + error.message
    });
  }
};

exports.deleteDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { ownerWallet } = req.body;

    const dataset = await Dataset.findOne({ datasetId });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    if (dataset.ownerWallet !== ownerWallet) {
      return res.status(403).json({
        success: false,
        message: 'Only dataset owner can delete'
      });
    }

    await Dataset.deleteOne({ datasetId });

    res.json({
      success: true,
      message: 'Dataset deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting dataset: ' + error.message
    });
  }
};
