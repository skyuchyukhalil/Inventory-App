// frontend/InventoryApp.js

// 1. Service Layer
import { ToolInventoryService } from './services/ToolInventoryService.js';

// 2. Specialized Domain Handlers
import { AssetActionHandler } from './handlers/AssetActionHandler.js';
import { MaintenanceHandler } from './handlers/MaintenanceHandler.js';
import { InventoryLifecycleHandler } from './handlers/InventoryLifecycleHandler.js';

// 3. Renderers
import { renderPrimaryToolList } from './features/DashboardOverview/DashboardRenderer.js';
import { renderAddToolForm } from './features/InventoryManagement/AddToolFormRenderer.js';
import { renderGlobalSearchBar } from './features/DashboardOverview/SearchBarRenderer.js';

// --- Initialization ---

// Start the app once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    refreshInventoryDashboard();
    renderGlobalSearchBar();
    
    // Global listener to close any open action menus when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('[id^="menu-"]').forEach(menu => menu.classList.add('hidden'));
    });
});

// Primary function to fetch data and refresh the main dashboard view
async function refreshInventoryDashboard() {
    try {
        const summaryData = await ToolInventoryService.fetchDashboardSummary();
        renderPrimaryToolList(summaryData);
    } catch (err) {
        console.error("Critical: Dashboard failed to refresh", err);
    }
}

// --- Window Bridges (Connecting HTML to Domain Handlers) ---

// UI: Open the registration modal
window.openAddModal = () => {
    document.getElementById('tool-modal').classList.remove('hidden');
    renderAddToolForm();
};
// Actions: Handle the global search input
window.handleSearch = (query) => AssetActionHandler.handleGlobalSearch(query);

window.filterModalSerials = (query) => AssetActionHandler.filterModalSerials(query);s

// Lifecycle: Register a new physical tool
window.submitNewTool = () => InventoryLifecycleHandler.submitNewAsset(refreshInventoryDashboard);

// Lifecycle: Permanently remove a tool
window.decommissionTool = (id, tId, name) => 
    InventoryLifecycleHandler.decommissionAsset(id, tId, name, AssetActionHandler.refreshDetailView, refreshInventoryDashboard);

// Actions: Open specific tool details
window.openToolDetail = (name) => AssetActionHandler.refreshDetailView(name);

// Actions: Process tool check-in (Return)
window.handleReturn = (tId, name) => AssetActionHandler.handleReturn(tId, name, refreshInventoryDashboard);

// Actions: Process tool check-out (Assignment)
window.confirmAssign = (id, name) => AssetActionHandler.confirmAssignment(id, name, refreshInventoryDashboard);

// Actions: UI Helpers for menus and filters
window.toggleActionMenu = (event, id) => {
    event.stopPropagation();
    const menu = document.getElementById(`menu-${id}`);
    document.querySelectorAll('[id^="menu-"]').forEach(m => m !== menu && m.classList.add('hidden'));
    menu?.classList.toggle('hidden');
};

window.applyFilter = (type) => AssetActionHandler.toggleFilter(type);

// Maintenance: Report a new issue
window.markDamaged = (id, name) => 
    MaintenanceHandler.reportDamage(id, name, AssetActionHandler.refreshDetailView, refreshInventoryDashboard);

// Maintenance: Confirm repair completion
window.markRepaired = (id, name) => 
    MaintenanceHandler.completeRepair(id, name, AssetActionHandler.refreshDetailView, refreshInventoryDashboard);

// Maintenance: Toggle the detailed view for repair items
window.toggleMaintenanceDetail = (dId, iId) => MaintenanceHandler.toggleMaintenanceRow(dId, iId);

// Bridge: Show the assignment input field (Keep this localized to UI interactions)
window.showAssignmentInput = (id, toolName, serial) => {
    const container = document.getElementById(`action-container-${id}`);
    if (!container) return;
    container.innerHTML = `
        <div class="flex items-center gap-2 animate-fadeIn">
            <input type="text" id="input-${id}" placeholder="Operator Name" 
                   class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-32 focus:ring-2 focus:ring-blue-500/20 outline-none">
            <button onclick="window.confirmAssign(${id}, '${toolName}')" 
                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors">
                Confirm
            </button>
        </div>
    `;
    document.getElementById(`input-${id}`).focus();
};