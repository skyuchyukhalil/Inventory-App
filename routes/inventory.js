const express = require('express');
const router = express.Router();
const db = require('../database'); // Our central DB file

// GET: Summary for dashboard cards
router.get('/summary', (req, res) => {
    const sql = `SELECT name, category, COUNT(*) as total_count FROM tools GROUP BY name`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET: Details for the specific tool modal
router.get('/detail/:name', (req, res) => {
    const toolName = req.params.name;
    const sql = `
        SELECT t.*, trans.user_name AS current_user, trans.time_taken, trans.id AS transaction_id
        FROM tools t
        LEFT JOIN transactions trans ON t.id = trans.tool_id AND trans.status = 'ACTIVE'
        WHERE t.name = ?`;
    
    db.all(sql, [toolName], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/add', (req, res) => {
    const { name, category, serial_number } = req.body;
    const sql = `INSERT INTO tools (name, category, serial_number, current_status) VALUES (?, ?, ?, 'ACTIVE')`;

    db.run(sql, [name, category, serial_number], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, message: "Tool created successfully" });
    });
});

// 
router.post('/decommission', (req, res) => {
    const { toolId, transactionId } = req.body;

    // 1. DELETE the tool from the tools table
    const sqlDeleteTool = `DELETE FROM tools WHERE id = ?`;
    // 2. CLOSE the transaction if it was out (so logs stay accurate)
    const sqlCloseTrans = `UPDATE transactions SET time_returned = datetime('now'), status = 'DESTROYED' WHERE id = ?`;

    db.serialize(() => {
        db.run(sqlDeleteTool, [toolId]);
        if (transactionId) {
            db.run(sqlCloseTrans, [transactionId]);
        }
        res.json({ success: true, message: "Tool purged from inventory" });
    });
});
module.exports = router;