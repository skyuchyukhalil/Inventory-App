// frontend/features/InventoryManagement/InventoryModalRenderer.js

import { renderAvailableRow } from './AvailableRowRenderer.js';
import { renderAssignmentRow } from '../UserAssignments/AssignmentRowRenderer.js';
import { renderMaintenanceRow } from '../MaintenanceManagement/MaintenanceRowRenderer.js';

export const renderInventoryModal = (toolName, items) => {
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;

    // 1. Stats Calculation
    const total = items.length;
    const taken = items.filter(i => i.current_status === 'TAKEN' || i.current_user).length;
    const damaged = items.filter(i => i.current_status === 'DAMAGED').length;
    const available = total - taken - damaged;

    // 2. Header and Statistics Ribbon
    let html = `
    <div class="flex justify-between items-start mb-6">
        <div>
            <h2 class="text-3xl font-bold text-slate-800">${toolName}</h2>
            <p class="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Inventory Overview</p>
        </div>
        <button onclick="document.getElementById('tool-modal').classList.add('hidden')" 
                class="bg-slate-100 p-2 rounded-xl hover:bg-slate-200 transition-all text-slate-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
    </div>

    <div class="grid grid-cols-4 gap-2 mb-8 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        ${renderStatTab('all', 'Total', total, 'slate', true)}
        ${renderStatTab('available', 'Available', available, 'green')}
        ${renderStatTab('taken', 'Out', taken, 'blue')}
        ${renderStatTab('damaged', 'In Repair', damaged, 'orange')}
    </div>

    <div id="modal-items-list" class="space-y-3">`;

    // 3. Items Loop
    items.forEach(item => {
        const statusValue = item.current_user ? 'TAKEN' : (item.current_status === 'DAMAGED' ? 'DAMAGED' : 'AVAILABLE');

        // Shared Dropdown Menu Logic
        const menuHtml = renderActionMenu(item, toolName);

        // Switch through domain renderers
        if (statusValue === 'TAKEN') {
            html += renderAssignmentRow(item, toolName, menuHtml);
        } else if (statusValue === 'DAMAGED') {
            html += renderMaintenanceRow(item, toolName, menuHtml);
        } else {
            html += renderAvailableRow(item, toolName, menuHtml);
        }
    });

    html += `</div>`;
    modalContent.innerHTML = html;
};

// Helper to keep the main function clean
function renderStatTab(id, label, count, color, isActive = false) {
    const activeClass = isActive ? `border-blue-600 shadow-md` : `border-transparent`;
    return `
        <div id="filter-${id}" onclick="window.applyFilter('${id.toUpperCase()}')" 
             class="text-center py-3 bg-${color}-50/50 rounded-xl cursor-pointer transition-all border-2 ${activeClass}">
            <span class="block text-[10px] font-bold text-${color}-600 uppercase tracking-tighter">${label}</span>
            <span class="text-xl font-black text-${color}-700">${count}</span>
        </div>`;
}

function renderActionMenu(item, toolName) {
    return `
        <div class="relative ml-2">
            <button onclick="window.toggleActionMenu(event, ${item.id})" 
                    class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            <div id="menu-${item.id}" class="hidden absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-md shadow-xl border border-slate-100 rounded-xl w-44 z-[50] p-1 overflow-hidden">
                <button onclick="window.markDamaged(${item.id}, '${toolName}')" class="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all text-left">
                    Mark Damaged
                </button>
                <button onclick="window.decommissionTool(${item.id}, ${item.transaction_id || 'null'}, '${toolName}')" class="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-slate-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all text-left">
                    Destroy Tool
                </button>
            </div>
        </div>`;
}