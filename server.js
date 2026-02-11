const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

// Import our modular routes
const transactionRoutes = require('./backend/routes/transactions');
const inventoryRoutes = require('./backend/routes/inventory');

// Mount the API
app.use('/api/transactions', transactionRoutes);
app.use('/api/tools', inventoryRoutes);

// Serve the frontend
// The (.*) gives the wildcard a "name" so the parser doesn't crash
// This is the most compatible way to write a catch-all in modern Express
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
🚀 Server running at http://localhost:${PORT}
📂 Inventory Route: /api/tools
📂 Transaction Route: /api/transactions
    `);
});
