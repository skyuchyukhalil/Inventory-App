// frontend/handlers/InventoryLifecycleHandler.js
import { ToolInventoryService } from '../services/ToolInventoryService.js';

export const InventoryLifecycleHandler = {
    // Registers a brand new physical tool into the database
    async submitNewAsset(refreshDashboardCallback) {
       const toolName = document.getElementById('new-name').value;
           const serialNumber = document.getElementById('new-serial').value;
           const categoryName = document.getElementById('new-category').value;
       
           if (!toolName || !serialNumber) return alert("Validation Failed: Name and Serial are required.");
       
           // MATCHED: registerNewTool
           await ToolInventoryService.registerNewTool({ 
               name: toolName, 
               serial_number: serialNumber, 
               category: categoryName 
           });
           
           document.getElementById('tool-modal').classList.add('hidden');
           refreshDashboardCallback();
    },

    // Permanently removes an asset and its associated history
    async decommissionAsset(toolId, transactionId, toolName, refreshDetailCallback, refreshDashboardCallback) {
        const isConfirmed = confirm("DANGER: Permanently decommission this asset? This cannot be undone.");
        if (!isConfirmed) return;

        // Execute decommissioning through the service
        await ToolInventoryService.decommissionToolFromSystem(toolId, transactionId);
        
        // Synchronize the modal view (in case other serials exist) and the dashboard
        await refreshDetailCallback(toolName);
        refreshDashboardCallback();
    }
};