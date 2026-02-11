// frontend/features/InventoryManagement/AddToolFormRenderer.js

export const renderAddToolForm = () => {
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;
    
    modalContent.innerHTML = `
        <div class="admin-only animate-fadeIn">
            <div class="flex items-center gap-3 mb-8 border-b pb-4">
                <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Register New Asset</h2>
                    <p class="text-sm text-slate-400 font-medium">Add a new physical tool to the system</p>
                </div>
            </div>

            <div class="space-y-6">
                <div class="group">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Tool Name</label>
                    <input type="text" id="new-name" placeholder="e.g. Bosch Impact Drill" 
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Serial Number</label>
                        <input type="text" id="new-serial" placeholder="SN-XXXX" 
                            class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-mono">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Category</label>
                        <input type="text" id="new-category" placeholder="Power Tools" 
                            class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
                    </div>
                </div>

                <div class="flex items-center gap-3 pt-4">
                    <button onclick="window.submitNewTool()" 
                        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                        Confirm Registration
                    </button>
                    <button onclick="document.getElementById('tool-modal').classList.add('hidden')" 
                        class="px-6 py-3.5 text-slate-400 hover:text-slate-600 font-bold">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
};