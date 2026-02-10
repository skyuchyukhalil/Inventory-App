const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

// Import our modular routes
const transactionRoutes = require('./routes/transactions');
const inventoryRoutes = require('./routes/inventory');

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
// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const app = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(express.static('public'));

// const db = new sqlite3.Database('./inventory.db');

// app.get('/api/inventory/summary', (req, res) => {
//     // We use current_status to match your database
//     const sql = `
//         SELECT name, category, COUNT(*) as total_count 
//         FROM tools 
//         WHERE (current_status != 'DECOMMISSIONED' OR current_status IS NULL)
//         GROUP BY name
//     `;
//     db.all(sql, [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// // --- 2. TOOL DETAILS (Modal View) ---
// app.get('/api/tools/by-name/:name', (req, res) => {
//     const { name } = req.params;
    
//     const sql = `
//         SELECT t.*, tr.user_name as current_user, tr.time_taken, tr.id as transaction_id
//         FROM tools t
//         LEFT JOIN transactions tr ON t.id = tr.tool_id AND tr.status = 'ACTIVE'
//         WHERE t.name = ? AND (t.current_status != 'DECOMMISSIONED' OR t.current_status IS NULL)
//     `;

//     db.all(sql, [name], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });
// // --- 3. CHECK-OUT (Flip Status to 'TAKEN') ---
// app.post('/api/transactions', (req, res) => {
//     const { toolId, user_name, tool_name, tool_serial } = req.body;
//     const time_taken = new Date().toLocaleString();

//     // Use serialize to ensure the status updates ONLY if the log is created
//     db.serialize(() => {
//         const logSql = `INSERT INTO transactions (tool_id, tool_name, tool_serial, user_name, time_taken, status) VALUES (?, ?, ?, ?, ?, 'ACTIVE')`;
//         db.run(logSql, [toolId, tool_name, tool_serial, user_name, time_taken]);

//         // This is the key fix: Update the tool table itself
//         const toolSql = `UPDATE tools SET current_status = 'TAKEN' WHERE id = ?`;
//         db.run(toolSql, [toolId], function(err) {
//             if (err) return res.status(400).json({ error: err.message });
//             res.json({ message: 'Success' });
//         });
//     });
// });
// // Add this so http://localhost:3000/api/transactions actually works
// app.get('/api/transactions', (req, res) => {
//     const sql = `SELECT * FROM transactions ORDER BY time_taken DESC`;
//     db.all(sql, [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// // --- 4. RETURN (Flip Status back to 'ACTIVE') ---
// app.put('/api/transactions/:id', (req, res) => {
//     const { id } = req.params;
//     const time_returned = new Date().toLocaleString();

//     db.serialize(() => {
//         // 1. Close transaction
//         db.run(`UPDATE transactions SET time_returned = ?, status = 'RETURNED' WHERE id = ?`, [time_returned, id]);

//         // 2. Find the tool ID associated with this transaction
//         db.get(`SELECT tool_id FROM transactions WHERE id = ?`, [id], (err, row) => {
//             if (row) {
//                 // 3. Update the tool status
//                 db.run(`UPDATE tools SET current_status = 'ACTIVE' WHERE id = ?`, [row.tool_id], (err) => {
//                     // 4. ONLY send the response once the DB confirms the update is done
//                     if (err) return res.status(500).json({ error: err.message });
//                     res.json({ message: 'Database updated successfully' });
//                 });
//             } else {
//                 res.status(404).json({ error: "Transaction not found" });
//             }
//         });
//     });
// });

// app.delete('/api/tools/destroy/:toolId/:transactionId', (req, res) => {
//     const { toolId, transactionId } = req.params;
//     const time_now = new Date().toLocaleString();

//     // 1. Get the tool details from the transaction before we delete anything
//     db.get(`SELECT tool_name, tool_serial FROM transactions WHERE id = ?`, [transactionId], (err, row) => {
//         if (err || !row) return res.status(400).json({ error: "Could not find tool details in logs" });

//         const { tool_name, tool_serial } = row;

//         db.serialize(() => {
//             // 2. Mark the transaction as DESTROYED
//             db.run(`UPDATE transactions SET time_returned = ?, status = 'DESTROYED' WHERE id = ?`, [time_now, transactionId]);

//             // 3. Remove the specific tool from the tools table using Name + Serial
//             const deleteSql = `DELETE FROM tools WHERE name = ? AND serial_number = ?`;
//             db.run(deleteSql, [tool_name, tool_serial], function(err) {
//                 if (err) return res.status(500).json({ error: err.message });
//                 res.json({ message: "Tool physically removed from inventory records." });
//             });
//         });
//     });
// });
// // --- 6. ADD NEW TOOL ---
// app.post('/api/tools', (req, res) => {
//     const { name, serial_number, category } = req.body;
//     const added_date = new Date().toISOString();

//     // We add 'status' to the columns and a 4th '?' to the values
//     const sql = `INSERT INTO tools (name, serial_number, category, added_date, status) VALUES (?, ?, ?, ?, 'ACTIVE')`;

//     db.run(sql, [name, serial_number, category, added_date], function(err) {
//         if (err) {
//             return res.status(400).json({ error: err.message });
//         }

//         res.json({
//             message: 'Tool added successfully',
//             toolId: this.lastID
//         });
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });