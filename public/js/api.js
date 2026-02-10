export const ToolAPI = {

    async getSummary() {
        const res = await fetch('/api/tools/summary');
        return res.json();
    },

    async getDetail(name) {
        const res = await fetch(`/api/tools/detail/${encodeURIComponent(name)}`);
        return res.json();
    },

    async addTool(toolData) {
        const res = await fetch('/api/tools/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toolData)

        });
        return res.json();
    },

    async assign(data) {
        return fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    async return(transactionId) {
        return fetch(`/api/transactions/${transactionId}`, { method: 'PUT' });
    },

    async decommission(toolId, transactionId) {
        const res = await fetch('/api/tools/decommission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId, transactionId })
        });
        return res.json();
    },

    async updateStatus(toolId, status, note = "") {
    const res = await fetch('/api/tools/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, status, note })
    });
    return res.json();
}
    
};