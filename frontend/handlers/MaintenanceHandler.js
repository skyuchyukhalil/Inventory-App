// frontend/handlers/MaintenanceHandler.js
import { ToolInventoryService } from '../services/ToolInventoryService.js';
import { renderLoadingState } from '../components/SharedUIElements.js';

export const MaintenanceHandler = {
    // Transitions an active tool into the 'Damaged' state
    async reportDamage(toolId, toolName, refreshDetailCallback, refreshDashboardCallback) {
        const reason = prompt("Describe the detected fault/damage:");
        if (!reason) return;

        try {
            // Visual feedback to the user while the database updates
            renderLoadingState("Status Update", "Relocating to Maintenance Tracking...");
            await ToolInventoryService.updateToolStatus(toolId, 'DAMAGED', reason);

            // Cascade refreshes to both views
            await refreshDetailCallback(toolName);
            refreshDashboardCallback();
        } catch (err) {
            console.error("Maintenance update failed:", err);
        }
    },

    // Restores a damaged tool to the 'Available' pool after repair
    async completeRepair(toolId, toolName, refreshDetailCallback, refreshDashboardCallback) {
        // Single confirmation check
        if (!confirm(`Clear ${toolName} for service?`)) return;

        try {
            // Visual feedback
            renderLoadingState("System Sync", "Restoring to Available Inventory...");
            
            // Execute status update to 'AVAILABLE'
            await ToolInventoryService.updateToolStatus(toolId, 'AVAILABLE', 'Maintenance Cycle Complete');
            
            // Refresh UI
            await refreshDetailCallback(toolName);
            refreshDashboardCallback();
        } catch (err) {
            console.error("Repair sync failed:", err);
        }
    },

    // Manages the UI state of the maintenance detail dropdowns
    toggleMaintenanceRow(detailId, iconId) {
        const detail = document.getElementById(detailId);
        const icon = document.getElementById(iconId);
        
        // Toggle visibility and icon rotation
        if (detail && icon) {
            detail.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        }
    }
};