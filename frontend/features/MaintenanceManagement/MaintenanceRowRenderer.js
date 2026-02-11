// frontend/features/MaintenanceManagement/MaintenanceRowRenderer.js

export const renderMaintenanceRow = (item, toolName, menuHtml) => {
    const dateStr = item.damage_date ? item.damage_date.split(' ')[0] : 'N/A';
    
    return `
        <div data-status="DAMAGED" 
             class="tool-card flex flex-col gap-3 p-4 bg-orange-50/30 rounded-xl border border-orange-100 animate-fadeIn">
            
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div>
                        <span class="text-[9px] font-bold text-orange-400 uppercase tracking-widest block">Serial No.</span>
                        <p class="font-mono font-bold text-orange-600">${item.serial_number}</p>
                    </div>
                    <div class="h-8 w-[1px] bg-orange-100"></div>
                    <div>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Reported</span>
                        <p class="text-xs font-bold text-slate-600">${dateStr}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button onclick="window.markRepaired(${item.id}, '${toolName}')" 
                            class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-[11px] font-bold transition-all">
                        Complete Repair
                    </button>
                    ${menuHtml}
                </div>
            </div>

            <div class="bg-white/50 p-3 rounded-lg border border-orange-100/50">
                <span class="text-[9px] font-bold text-red-400 uppercase tracking-widest block mb-1">Issue Details</span>
                <p class="text-[12px] font-medium text-slate-700 italic leading-relaxed">
                    "${item.damage_reason || 'No details provided'}"
                </p>
            </div>
        </div>
    `;
};