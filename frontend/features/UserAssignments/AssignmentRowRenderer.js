// frontend/features/UserAssignments/AssignmentRowRenderer.js

/**
 * AssignmentRowRenderer
 * Responsibility: Rendering the UI for tools currently assigned to a user (Checked Out).
 */

export const renderAssignmentRow = (item, toolName, menuHtml) => {
    // Format the date for readability
    const checkoutDate = item.time_taken ? item.time_taken.split(',')[0] : 'Unknown Date';

    return `
        <div data-status="TAKEN" 
             class="tool-card flex items-center justify-between p-4 bg-blue-50/30 rounded-xl border border-blue-100 hover:border-blue-200 transition-all animate-fadeIn">
            
            <div>
                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Serial No.</span>
                <p class="font-mono font-bold text-blue-600">${item.serial_number}</p>
            </div>

            <div class="flex items-center gap-6">
                <div class="bg-white/80 border border-blue-100 px-3 py-1.5 rounded-lg shadow-sm">
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-1">Since</span>
                    <span class="text-[13px] font-bold text-slate-600">${checkoutDate}</span>
                </div>

                <div class="text-right">
                    <span class="text-[9px] text-blue-400 uppercase font-black tracking-widest block mb-0.5">Assigned To</span>
                    <span class="text-[15px] font-bold text-slate-800">${item.current_user}</span>
                </div>
                
                <div class="flex items-center gap-2">
                    <button onclick="window.handleReturn(${item.transaction_id}, '${toolName}')" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95">
                        Return Tool
                    </button>
                    ${menuHtml}
                </div>
            </div>
        </div>
    `;
};