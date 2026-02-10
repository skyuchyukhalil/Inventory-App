export function renderToolList(tools, onCardClick) {
        const listContainer = document.getElementById('tool-list');
        if (!listContainer) return; // Safety check
        
        listContainer.innerHTML = tools.map(tool => `
            <div onclick="window.openToolDetail('${tool.name}')" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group">
                <div class="flex items-center gap-4">
                    <div class="bg-slate-100 text-slate-600 font-bold px-3 py-2 rounded-lg border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        x${tool.total_count}
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800">${tool.name}</h3>
                        <p class="text-xs text-gray-500 uppercase tracking-wider">${tool.category}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }