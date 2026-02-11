// frontend/features/MaintenanceManagement/MaintenanceRowRenderer.js

export const renderMaintenanceRow = (item, toolName, menuHtml) => {
    const dateStr = item.damage_date ? item.damage_date.split(' ')[0] : 'N/A';
    const detailId = `details-${item.id}`;
    const iconId = `icon-${item.id}`;

    return `
        <div data-status="DAMAGED" 
             class="tool-card flex flex-col gap-2 p-4 bg-orange-50/40 rounded-xl border border-orange-100 hover:border-orange-200 transition-all animate-fadeIn">
            
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div>
                        <span class="text-[9px] font-bold text-orange-400 uppercase tracking-widest block">Serial No.</span>
                        <p class="font-mono font-bold text-orange-600">${item.serial_number}</p>
                    </div>
                    <div class="h-8 w-[1px] bg-orange-100"></div>
                    <div>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Status</span>
                        <p class="text-[11px] font-bold text-orange-500 uppercase">In Repair</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button onclick="window.markRepaired(${item.id}, '${toolName}')" 
                            class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-[11px] font-bold shadow-sm transition-all active:scale-95">
                        Complete Repair
                    </button>
                    
                    <button onclick="toggleMaintenanceDetail('${detailId}', '${iconId}')" 
                            class="p-2 hover:bg-orange-100 rounded-lg text-orange-400 transition-all">
                        <svg id="${iconId}" class="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    ${menuHtml}
                </div>
            </div>

            <div id="${detailId}" class="hidden mt-2 pt-3 border-t border-orange-100/50 animate-fadeIn">
                <div class="grid grid-cols-2 gap-4 mb-3">
                    <div>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Reported On</span>
                        <p class="text-xs font-bold text-slate-700">${dateStr}</p>
                    </div>
                    <div>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Reported By</span>
                        <p class="text-xs font-bold text-slate-700">${item.last_user || 'System Admin'}</p>
                    </div>
                </div>
                <div class="bg-white/60 p-3 rounded-lg border border-orange-100/30">
                    <span class="text-[9px] font-black text-red-400 uppercase tracking-widest block mb-1">Issue Details</span>
                    <p class="text-[12px] font-medium text-slate-600 italic leading-relaxed">
                        "${item.damage_reason || 'No specific fault notes provided.'}"
                    </p>
                </div>
            </div>
        </div>
    `;
};