const express = require('express');
const router = express.Router();
const datasetController = require('../controllers/dataset.controller');

// Register dataset
router.post('/register', datasetController.registerDataset);

// Get single dataset
router.get('/:datasetId', datasetController.getDataset);

// Get all datasets
router.get('/', datasetController.getDatasets);

// Update dataset
router.put('/:datasetId', datasetController.updateDataset);

// Get dataset history
router.get('/:datasetId/history', datasetController.getDatasetHistory);

// Delete dataset
router.delete('/:datasetId', datasetController.deleteDataset);

module.exports = router;
