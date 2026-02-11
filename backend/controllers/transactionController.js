const db = require('../config/database');

const transactionController = {
    // 1. Assign Tool to User
    assignTool: (req, res) => {
        const { toolId, user_name, tool_name, tool_serial } = req.body;
        const time_taken = new Date().toLocaleString();

        db.serialize(() => {
            // Log the transaction
            db.run(`INSERT INTO transactions (tool_id, tool_name, tool_serial, user_name, time_taken, status) VALUES (?, ?, ?, ?, ?, 'ACTIVE')`, 
                   [toolId, tool_name, tool_serial, user_name, time_taken]);
            
            // Update the tool status
            db.run(`UPDATE tools SET current_status = 'TAKEN' WHERE id = ?`, [toolId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Assigned successfully' });
            });
        });
    },

    // 2. Process Tool Return
    returnTool: (req, res) => {
        const { id } = req.params;
        const time_returned = new Date().toLocaleString();

        db.serialize(() => {
            // Close the transaction
            db.run(`UPDATE transactions SET time_returned = ?, status = 'RETURNED' WHERE id = ?`, [time_returned, id]);
            
            // Find which tool this transaction belonged to and make it active again
            db.get(`SELECT tool_id FROM transactions WHERE id = ?`, [id], (err, row) => {
                if (row) db.run(`UPDATE tools SET current_status = 'ACTIVE' WHERE id = ?`, [row.tool_id]);
                res.json({ message: 'Returned successfully' });
            });
        });
    },

    // 3. Handle Tool Destruction/Loss
    destroyTool: (req, res) => {
        const { transactionId } = req.params;
        const time_now = new Date().toLocaleString();

        db.get(`SELECT tool_name, tool_serial FROM transactions WHERE id = ?`, [transactionId], (err, row) => {
            if (!row) return res.status(404).send("Not found");
            
            db.serialize(() => {
                // Update transaction log
                db.run(`UPDATE transactions SET time_returned = ?, status = 'DESTROYED' WHERE id = ?`, [time_now, transactionId]);
                
                // Delete the physical tool entry
                db.run(`DELETE FROM tools WHERE name = ? AND serial_number = ?`, [row.tool_name, row.tool_serial], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: "Tool removed" });
                });
            });
        });
    }
};

module.exports = transactionController;