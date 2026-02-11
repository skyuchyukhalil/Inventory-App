// frontend/features/InventoryManagement/AvailableRowRenderer.js

/**
 * AvailableRowRenderer
 * Responsibility: Rendering tools that are currently in stock and ready for assignment.
 */

export const renderAvailableRow = (item, toolName, menuHtml) => {
    return `
        <div data-status="AVAILABLE" 
             class="tool-card flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-200 transition-all animate-fadeIn">
            <div>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Serial No.</span>
                <p class="font-mono font-bold text-slate-700">${item.serial_number}</p>
            </div>
            
            <div class="flex items-center gap-2">
                <div id="action-container-${item.id}">
                    <button onclick="window.showAssignmentInput(${item.id}, '${toolName}', '${item.serial_number}')"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
                        Assign Tool
                    </button>
                </div>
                ${menuHtml}
            </div>
        </div>
    `;
};