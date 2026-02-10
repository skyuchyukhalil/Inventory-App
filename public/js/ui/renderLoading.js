export function renderLoadingState(message, progress = "") {
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;

    modalContent.innerHTML = `
        <div class="p-16 text-center flex flex-col items-center animate-fadeIn">
            <div class="relative w-16 h-16 mb-6">
                <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <h3 class="text-xl font-bold text-slate-800 mb-2">${message}</h3>
            
            <div class="bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                <p class="text-[11px] font-mono font-bold text-blue-500 uppercase tracking-widest">
                    ${progress}
                </p>
            </div>
        </div>
    `;
}