const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Define the transaction routes
router.post('/', transactionController.assignTool);
router.put('/:id', transactionController.returnTool);
router.delete('/destroy/:transactionId', transactionController.destroyTool);

module.exports = router;