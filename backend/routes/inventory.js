const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// All paths are now mapped to controller functions
router.get('/summary', inventoryController.getSummary);
router.get('/detail/:name', inventoryController.getDetails);
router.post('/add', inventoryController.addTool);
router.post('/decommission', inventoryController.decommissionTool);
router.post('/status', inventoryController.updateStatus);

module.exports = router;