export function renderModalUI(toolName, items) {
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;

    // Use || to handle different naming conventions in your DB
    const total = items.length;
    const taken = items.filter(i => i.current_status === 'TAKEN' || i.status === 'TAKEN').length;
    const damaged = items.filter(i => i.current_status === 'DAMAGED' || i.status === 'DAMAGED').length;
    const available = total - taken - damaged;

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
        <div id="filter-all" onclick="window.applyFilter('ALL')" 
            class="text-center py-3 bg-slate-50 rounded-xl cursor-pointer border-2 border-blue-600 shadow-md transition-all">
            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total</span>
            <span class="text-xl font-black text-slate-700">${total}</span>
        </div>
        
        <div id="filter-available" onclick="window.applyFilter('AVAILABLE')" 
             class="text-center py-3 bg-green-50/50 rounded-xl cursor-pointer transition-all border-2 border-transparent">
            <span class="block text-[10px] font-bold text-green-600 uppercase tracking-tighter">Available</span>
            <span class="text-xl font-black text-green-700">${available}</span>
        </div>
        
        <div id="filter-taken" onclick="window.applyFilter('TAKEN')" 
             class="text-center py-3 bg-blue-50/50 rounded-xl cursor-pointer transition-all border-2 border-transparent">
            <span class="block text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Out</span>
            <span class="text-xl font-black text-blue-700">${taken}</span>
        </div>
        
        <div id="filter-damaged" onclick="window.applyFilter('DAMAGED')" 
             class="text-center py-3 bg-orange-50/50 rounded-xl cursor-pointer transition-all border-2 border-transparent">
            <span class="block text-[10px] font-bold text-orange-600 uppercase tracking-tighter">In Repair</span>
            <span class="text-xl font-black text-orange-700">${damaged}</span>
        </div>
    </div>

    <div id="modal-items-list" class="space-y-3">
    `;

    items.forEach(item => {
        let actionHtml = '';
        
        // Logic: Pick a color based on the item's status
        let statusColor = "text-slate-700"; 
        if (item.status === 'TAKEN') statusColor = "text-blue-600";
        if (item.status === 'DAMAGED') statusColor = "text-orange-600";
        if (item.current_user) {
            actionHtml = `
                <div class="flex items-center gap-6 animate-fadeIn">
                    <div class="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                        <span class="text-[10px] font-medium text-slate-400 uppercase tracking-tighter block leading-none mb-1">Since</span>
                        <span class="text-[16px] font-semibold text-slate-600">${item.time_taken.split(',')[0]}</span>
                    </div>

                    <div class="flex flex-col text-right">
                        <span class="text-[9px] text-blue-400 uppercase font-bold tracking-widest leading-none mb-1">Assigned to</span>
                        <span class="text-[16px] font-medium text-slate-800 leading-none">${item.current_user}</span>
                    </div>
                    
                    <button onclick="handleReturn(${item.transaction_id}, '${toolName}')" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95">
                        Return
                    </button>

                    <div class="relative">
                        <button type="button" 
                                onclick="toggleActionMenu(event, ${item.id})" 
                                class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                        
                        <div id="menu-${item.id}" 
                            class="hidden absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 rounded-xl w-44 z-[999] p-1 overflow-hidden">
                            
                            <button onclick="markDamaged(${item.id})" 
                                    class="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                                <svg class="text-orange-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                                Damaged
                            </button>

                            <button onclick="decommissionTool(${item.id}, ${item.transaction_id}, '${toolName}')" 
                                    class="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-slate-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all">
                                <svg class="text-red-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                Destroyed
                            </button>
                        </div>
                    </div>
                </div>
            `;
} else {
            actionHtml = `
                <div id="action-container-${item.id}" class="flex items-center gap-2">
                    <button 
                        onclick="showAssignmentInput(${item.id}, '${toolName}', '${item.serial_number}')"
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
                        Assign Tool
                    </button>
                </div>
            `;
        }

        // IMPORTANT: We use the statusColor variable here in the class!
        html += `
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Serial No.</span>
                    <p class="font-mono font-bold ${statusColor}">${item.serial_number}</p>
                </div>
                ${actionHtml}
            </div>
        `;
    });

    html += `</div>`;
    modalContent.innerHTML = html;
}


