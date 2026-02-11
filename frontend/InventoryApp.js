import { ToolInventoryService } from './services/ToolInventoryService.js';
import { UI } from './ui/index.js'; // We will refactor this folder next

/**
 * Initialization: Setup global listeners and initial data fetch
 */
document.addEventListener('DOMContentLoaded', () => {
    refreshInventoryDashboard();
    
    // Global listener to close context menus when clicking elsewhere
    document.addEventListener('click', () => {
        document.querySelectorAll('[id^="menu-"]').forEach(menu => menu.classList.add('hidden'));
    });
});

/**
 * Orchestrator: Refreshes the main dashboard view
 */
async function refreshInventoryDashboard() {
    try {
        const summaryData = await ToolInventoryService.fetchInventoryDashboardSummary();
        UI.renderToolList(summaryData);
    } catch (err) {
        console.error("Critical: Dashboard failed to refresh", err);
    }
}

/**
 * Window Bridges: 
 * These remain global for now so your index.html 'onclick' attributes can find them.
 * In the next phase, we will move these into "Handler" files.
 */

window.openAddModal = () => {
    document.getElementById('tool-modal').classList.remove('hidden');
    UI.renderAddToolForm();
};

window.submitNewTool = async () => {
    const toolName = document.getElementById('new-name').value;
    const serialNumber = document.getElementById('new-serial').value;
    const categoryName = document.getElementById('new-category').value;

    if (!toolName || !serialNumber) return alert("Validation Failed: Name and Serial are required.");

    await ToolInventoryService.registerNewInventoryItem({ 
        name: toolName, 
        serial_number: serialNumber, 
        category: categoryName 
    });
    
    document.getElementById('tool-modal').classList.add('hidden');
    refreshInventoryDashboard();
};

window.openToolDetail = async (toolName) => {
    const modal = document.getElementById('tool-modal');
    modal.classList.remove('hidden');
    try {
        const detailRecords = await ToolInventoryService.fetchToolGroupDetails(toolName);
        UI.renderModalUI(toolName, detailRecords);
    } catch (err) {
        console.error("Detail Load Error:", err);
    }
};

window.handleReturn = async (transactionId, toolName) => {
    if (!confirm(`Confirm return for ${toolName}?`)) return;
    await ToolInventoryService.finalizeToolReturn(transactionId);
    await window.openToolDetail(toolName);
    refreshInventoryDashboard();
};

window.toggleActionMenu = (event, id) => {
    event.stopPropagation();
    const menu = document.getElementById(`menu-${id}`);
    document.querySelectorAll('[id^="menu-"]').forEach(m => m !== menu && m.classList.add('hidden'));
    menu?.classList.toggle('hidden');
};

window.showAssignmentInput = (id, toolName, serial) => {
    const container = document.getElementById(`action-container-${id}`);
    container.innerHTML = `
        <div class="flex items-center gap-2 animate-fadeIn">
            <input type="text" id="input-${id}" placeholder="Operator Name" 
                   class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-32 focus:ring-2 focus:ring-blue-500/20 outline-none">
            <button onclick="window.confirmAssign(${id}, '${toolName}', '${serial}')" 
                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors">
                Confirm
            </button>
        </div>
    `;
    document.getElementById(`input-${id}`).focus();
};

window.confirmAssign = async (toolId, name, serial) => {
    const operatorName = document.getElementById(`input-${toolId}`).value;
    if (!operatorName) return;
    
    await ToolInventoryService.assignToolToUser({ 
        toolId, 
        user_name: operatorName, 
        tool_name: name, 
        tool_serial: serial 
    });
    
    await window.openToolDetail(name);
    refreshInventoryDashboard();
};

window.decommissionTool = async (toolId, transactionId, toolName) => {
    if (confirm("DANGER: Permanently decommission this asset? This removes it from active tracking.")) {
        await ToolInventoryService.permanentlyDecommissionTool(toolId, transactionId);
        await window.openToolDetail(toolName);
        refreshInventoryDashboard();
    }
};

window.markDamaged = async (toolId, toolName) => {
    const reason = prompt("Describe the detected fault/damage:");
    if (!reason) return;

    try {
        UI.renderLoadingState("Status Update", "Relocating to Service Registry...");
        await ToolInventoryService.updateToolFunctionalStatus(toolId, 'DAMAGED', reason);
        await window.openToolDetail(toolName);
        refreshInventoryDashboard();
    } catch (err) {
        console.error(err);
    }
};

window.markRepaired = async (toolId, toolName) => {
    if (!confirm(`Has the ${toolName} been cleared for service?`)) return;

    try {
        UI.renderLoadingState("System Sync", "Restoring to Available Inventory...");
        await ToolInventoryService.updateToolFunctionalStatus(toolId, 'AVAILABLE', 'Maintenance Cycle Complete');
        await window.openToolDetail(toolName);
        refreshInventoryDashboard();
    } catch (err) {
        console.error(err);
    }
};

window.applyFilter = (filterType) => {
    const cards = document.querySelectorAll('.tool-card'); 
    cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        card.classList.toggle('hidden', filterType !== 'ALL' && cardStatus !== filterType);
    });

    // Update Tab UI
    ['all', 'available', 'taken', 'damaged'].forEach(id => {
        const el = document.getElementById(`filter-${id}`);
        if (!el) return;
        const isActive = id === filterType.toLowerCase();
        el.classList.toggle('border-blue-600', isActive);
        el.classList.toggle('shadow-md', isActive);
        el.classList.toggle('border-transparent', !isActive);
    });
};