export const renderPrimaryToolList = (tools) => {
    const listContainer = document.getElementById('tool-list');
    const countBadge = document.getElementById('tool-count');
    
    if (!listContainer) return;

    // Update the "Types" count badge
    if (countBadge) countBadge.innerText = `${tools.length} Categories`;

    listContainer.innerHTML = tools.map(tool => {
        // Normalize serials into a searchable string; handles cases where serials might be missing
        const serialsString = tool.serials ? tool.serials.join(' ') : '';

        return `
            <div onclick="window.openToolDetail('${tool.name}')" 
                 data-serials="${serialsString}"
                 class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group">
                <div class="flex items-center gap-4">
                    <div class="bg-slate-100 text-slate-600 font-bold px-3 py-2 rounded-lg border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        x${tool.total_count}
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800">${tool.name}</h3>
                        <p class="text-xs text-gray-500 uppercase tracking-wider">${tool.category}</p>
                    </div>
                </div>
                <div class="text-slate-300 group-hover:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
            </div>
        `;
    }).join('');
};