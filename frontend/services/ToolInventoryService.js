/**
 * ToolInventoryService
 * Domain: Handles all network communication related to tool assets and transactions.
 */
export const ToolInventoryService = {
    
    async fetchDashboardSummary() {
        const response = await fetch('/api/tools/summary');
        return response.json();
    },

    async fetchToolDetails(toolName) {
        const response = await fetch(`/api/tools/detail/${encodeURIComponent(toolName)}`);
        return response.json();
    },

    async registerNewTool(toolData) {
        const response = await fetch('/api/tools/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toolData)
        });
        return response.json();
    },

    async assignToolToUser(assignmentData) {
        return fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assignmentData)
        });
    },

    async processToolReturn(transactionId) {
        return fetch(`/api/transactions/${transactionId}`, { method: 'PUT' });
    },

    async updateToolStatus(toolId, status, note = "") {
        const response = await fetch('/api/tools/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId, status, note })
        });
        return response.json();
    },

    async decommissionToolFromSystem(toolId, transactionId) {
        const response = await fetch('/api/tools/decommission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId, transactionId })
        });
        return response.json();
    }
};