// frontend/features/DashboardOverview/SearchBarRenderer.js

// Injects the global search bar with an integrated 'Clear' button logic
export const renderGlobalSearchBar = () => {
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer) return;

    searchContainer.innerHTML = `
        <div class="relative w-full mb-6 group animate-fadeIn">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <input type="text" 
                   id="global-search-input"
                   oninput="handleSearchInput(this.value)"
                   placeholder="Search 540+ assets by name or category..." 
                   class="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-12 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium">
            
            <button id="clear-search" 
                    onclick="clearGlobalSearch()"
                    class="hidden absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    `;
};

// Internal UI helper to manage the 'Clear' button visibility
window.handleSearchInput = (val) => {
    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) clearBtn.classList.toggle('hidden', val.length === 0);
    window.handleSearch(val);
};

// Resets the search state and shows all tool cards
window.clearGlobalSearch = () => {
    const input = document.getElementById('global-search-input');
    if (input) {
        input.value = '';
        window.handleSearchInput('');
        input.focus();
    }
};