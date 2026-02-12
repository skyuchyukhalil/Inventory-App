// frontend/handlers/AssetActionHandler.js
import { ToolInventoryService } from '../services/ToolInventoryService.js';
import { renderInventoryModal } from '../features/InventoryManagement/InventoryModalRenderer.js';

export const AssetActionHandler = {
    // Processes the return of a tool back into the available pool
    async handleReturn(transactionId, toolName, refreshCallback) {
        // Guard clause to prevent accidental returns
        if (!confirm(`Confirm return for ${toolName}?`)) return;
        
        // Finalize the transaction in the database via the service layer
        await ToolInventoryService.processToolReturn(transactionId);
        
        // Synchronize both the specific tool modal and the background dashboard
        await this.refreshDetailView(toolName);
        refreshCallback();
    },

    // Handles the logic for assigning a tool to a specific operator
    async confirmAssignment(toolId, toolName, refreshCallback) {
        // Retrieve operator name from the dynamic input field
        const operatorName = document.getElementById(`input-${toolId}`).value;
        if (!operatorName) return;
        
        // FIXED: Using toolName (passed in) and operatorName
        // Note: We don't strictly need serial here if the backend uses toolId, 
        // but we'll include it to match your service expectations.
        await ToolInventoryService.assignToolToUser({ 
            toolId, 
            user_name: operatorName, 
            tool_name: toolName
        });
        
        // Refresh UI components to reflect the new 'Taken' status
        await this.refreshDetailView(toolName);
        refreshCallback();
    },

    // Helper method to fetch fresh data and re-render the modal content
    async refreshDetailView(toolName) {
        const modal = document.getElementById('tool-modal');
        // Ensure modal is visible during refresh
        modal.classList.remove('hidden');
        try {
            // Fetch fresh data for the specific tool group
            const detailRecords = await ToolInventoryService.fetchToolDetails(toolName);
            // Re-render the modal with updated statuses
            renderInventoryModal(toolName, detailRecords);
        } catch (err) {
            console.error("Detail Load Error:", err);
        } // Fixed misplaced brace here
    },

    // Filters the visible tool cards based on status
    toggleFilter(filterType) {
        const cards = document.querySelectorAll('.tool-card'); 
        cards.forEach(card => {
            const cardStatus = card.getAttribute('data-status');
            card.classList.toggle('hidden', filterType !== 'ALL' && cardStatus !== filterType);
        });

        // Update Tab UI styles to show which filter is active
        ['all', 'available', 'taken', 'damaged'].forEach(id => {
            const el = document.getElementById(`filter-${id}`);
            if (!el) return;
            const isActive = id === filterType.toLowerCase();
            el.classList.toggle('border-blue-600', isActive);
            el.classList.toggle('shadow-md', isActive);
            el.classList.toggle('border-transparent', !isActive);
        });
    },

    //Filter dashboard cards based on a user's search input
    handleGlobalSearch(query) {
        // Normalize the search term for a case-insensitive, whitespace-agnostic match
        const searchTerm = query.toLowerCase().trim();

        // Select all top-level tool category cards from the dashboard list
        const toolCards = document.querySelectorAll('#tool-list > div');

        toolCards.forEach(card => {
            // 1. Extract visible text (Name and Category displayed on the card)
            const visibleContent = card.innerText.toLowerCase();

            // 2. Extract hidden metadata (The serial numbers we just embedded in the data-serials attribute)
            const hiddenSerials = card.getAttribute('data-serials') || "";
            const serialContent = hiddenSerials.toLowerCase();

            // 3. Determine if the search term exists in either the visible text OR the hidden serials
            const isMatch = visibleContent.includes(searchTerm) || serialContent.includes(searchTerm);

            // Toggle the 'hidden' class: display the card if a match is found, hide it otherwise
            card.classList.toggle('hidden', !isMatch);
        });
    },
    
    //Filters rows inside the modal by checking the serial number text.
    filterModalSerials(query) {
        const searchTerm = query.toLowerCase().trim();
        // Look only for tool cards inside the modal list
        const rows = document.querySelectorAll('#modal-items-list .tool-card');

        rows.forEach(row => {
            // We assume the serial number is in an element with the 'font-mono' class
            // (Used in all your row renderers: Assignment, Maintenance, and Available)
            const serialEl = row.querySelector('.font-mono');
            if (!serialEl) return;

            const serialText = serialEl.innerText.toLowerCase();
            // Toggle visibility
            row.classList.toggle('hidden', !serialText.includes(searchTerm));
        });
    }
};