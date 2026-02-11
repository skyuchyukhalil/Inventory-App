const db = require('../config/database');

const inventoryController = {
    // SECTION A: Data Retrieval (Dashboard & Modals)
    getSummary: (req, res) => {
        const sql = `SELECT name, category, COUNT(*) as total_count FROM tools GROUP BY name`;
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    },

    getDetails: (req, res) => {
        const toolName = req.params.name;
        const sql = `
            SELECT t.*, trans.user_name AS current_user, trans.time_taken, trans.id AS transaction_id,
            (SELECT user_name FROM transactions WHERE tool_id = t.id ORDER BY id DESC LIMIT 1) AS last_user
            FROM tools t
            LEFT JOIN transactions trans ON t.id = trans.tool_id AND trans.status = 'ACTIVE'
            WHERE t.name = ?`;
        
        db.all(sql, [toolName], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    },

    // SECTION B: Management (Add & Delete)
    addTool: (req, res) => {
        const { name, category, serial_number } = req.body;
        const sql = `INSERT INTO tools (name, category, serial_number, current_status) VALUES (?, ?, ?, 'ACTIVE')`;
        db.run(sql, [name, category, serial_number], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID, message: "Tool created successfully" });
        });
    },

    decommissionTool: (req, res) => {
        const { toolId, transactionId } = req.body;
        const sqlDeleteTool = `DELETE FROM tools WHERE id = ?`;
        const sqlCloseTrans = `UPDATE transactions SET time_returned = datetime('now'), status = 'DESTROYED' WHERE id = ?`;

        db.serialize(() => {
            db.run(sqlDeleteTool, [toolId]);
            if (transactionId) db.run(sqlCloseTrans, [transactionId]);
            res.json({ success: true, message: "Tool purged" });
        });
    },

    // SECTION C: Status (Damaged & Repaired)
    updateStatus: (req, res) => {
        const { toolId, status, note } = req.body;
        const isRepairing = status === 'AVAILABLE';

        const sqlTool = isRepairing 
            ? `UPDATE tools SET current_status = ?, damage_reason = NULL, damage_date = NULL WHERE id = ?`
            : `UPDATE tools SET current_status = ?, damage_reason = ?, damage_date = datetime('now') WHERE id = ?`;

        const params = isRepairing ? [status, toolId] : [status, note, toolId];

        db.run(sqlTool, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (status === 'DAMAGED') {
                const sqlTrans = `UPDATE transactions SET time_returned = datetime('now'), status = 'DAMAGED' 
                                  WHERE tool_id = ? AND time_returned IS NULL`;
                db.run(sqlTrans, [toolId]);
            }
            res.json({ success: true });
        });
    }
};

module.exports = inventoryController;