import { ToolAPI } from './api.js';
import { UI } from './ui/index.js';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    refreshDashboard();
    
    // Global click to close menus
    document.addEventListener('click', () => {
        document.querySelectorAll('[id^="menu-"]').forEach(m => m.classList.add('hidden'));
    });
});

async function refreshDashboard() {
    try {
        const data = await ToolAPI.getSummary();
        UI.renderToolList(data);
    } catch (err) {
        console.error("Load failed", err);
    }
}

window.openAddModal = () => {
    document.getElementById('tool-modal').classList.remove('hidden');
    UI.renderAddToolForm();
};

window.submitNewTool = async () => {
    const name = document.getElementById('new-name').value;
    const serial_number = document.getElementById('new-serial').value;
    const category = document.getElementById('new-category').value;

    if (!name || !serial_number) return alert("Please fill in Name and Serial");

    await ToolAPI.addTool({ name, serial_number, category });
    document.getElementById('tool-modal').classList.add('hidden');
    
    // Refresh the background list
    const data = await ToolAPI.getSummary();
    UI.renderToolList(data);
};

// --- Window Bridge (For HTML Onclicks) ---
window.openToolDetail = async (name) => {
    const modal = document.getElementById('tool-modal');
    modal.classList.remove('hidden');
    try {
        const details = await ToolAPI.getDetail(name);
        UI.renderModalUI(name, details);
    } catch (err) {
        console.error(err);
    }
};

window.handleReturn = async (id, name) => {
    if (!confirm(`Return ${name}?`)) return;
    await ToolAPI.return(id);
    await window.openToolDetail(name);
    refreshDashboard();
};

window.toggleActionMenu = (event, id) => {
    event.stopPropagation();
    const menu = document.getElementById(`menu-${id}`);
    document.querySelectorAll('[id^="menu-"]').forEach(m => m !== menu && m.classList.add('hidden'));
    menu?.classList.toggle('hidden');
};

window.showAssignmentInput = (id, toolName, serial) => {
    const container = document.getElementById(`action-container-${id}`);
    container.innerHTML = `
        <input type="text" id="input-${id}" placeholder="Name" class="border rounded-lg px-2 py-1 text-sm w-32">
        <button onclick="window.confirmAssign(${id}, '${toolName}', '${serial}')" class="bg-green-600 text-white px-3 py-1 rounded-lg text-xs">Confirm</button>
    `;
    document.getElementById(`input-${id}`).focus();
};

window.confirmAssign = async (id, name, serial) => {
    const user = document.getElementById(`input-${id}`).value;
    if (!user) return;
    await ToolAPI.assign({ toolId: id, user_name: user, tool_name: name, tool_serial: serial });
    await window.openToolDetail(name);
    refreshDashboard();
};

window.decommissionTool = async (toolId, transactionId, toolName) => {
    const reason = confirm("Are you sure you want to mark this tool as DESTROYED? This will remove it from active inventory.");
    
    if (reason) {
        try {
            // Optional: Show your loading state here if you want
            // UI.renderLoadingState("Updating records...", "Marking as destroyed...");

            await ToolAPI.decommission(toolId, transactionId);
            
            // Refresh the specific tool view and the main dashboard
            await window.openToolDetail(toolName);
            refreshDashboard();
        } catch (err) {
            console.error("Failed to decommission tool:", err);
            alert("Error updating tool status.");
        }
    }
};
window.markDamaged = async (toolId, toolName) => {
    const note = prompt("Briefly describe the damage (e.g., 'Broken trigger', 'Missing guard'):");
    if (note === null) return; // User cancelled

    try {
        UI.renderLoadingState("Updating Status", "Moving to Service Required...");
        
        await ToolAPI.updateStatus(toolId, 'DAMAGED', note);
        
        await window.openToolDetail(toolName);
        refreshDashboard();
    } catch (err) {
        console.error(err);
    }
};

window.applyFilter = (filterType) => {
    const container = document.getElementById('modal-items-list');
    const items = container.children;

    for (let item of items) {
        const isOut = item.innerText.includes('Return');
        const isDamaged = item.innerText.includes('text-orange-600');
        const isAvailable = !isOut && !isDamaged;

        item.classList.remove('hidden');

        if (filterType === 'AVAILABLE' && !isAvailable) item.classList.add('hidden');
        if (filterType === 'TAKEN' && !isOut) item.classList.add('hidden');
        if (filterType === 'DAMAGED' && !isDamaged) item.classList.add('hidden');
    }

    // 2. Simplified Border Toggle
document.querySelectorAll('[id^="filter-"]').forEach(el => {
    const isActive = el.id === `filter-${filterType.toLowerCase()}`;
    
    if (isActive) {
        el.classList.add('border-blue-600', 'shadow-md');
        el.classList.remove('border-transparent');
    } else {
        el.classList.remove('border-blue-600', 'shadow-md');
        el.classList.add('border-transparent');
    }
});
};