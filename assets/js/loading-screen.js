// ==========================================================================
// DYNAMIC CENTRAL SYNC LOADING SCREEN ENGINE
// ==========================================================================
function triggerCentralSync(message, completeCallback) {
    // 1. Clean out any legacy duplicated instance overlays surviving in memory
    const existingOverlay = document.getElementById('globalSyncOverlay');
    if (existingOverlay) existingOverlay.remove();

    // 2. Build out the primary full-viewport engine card wrappers
    const overlay = document.createElement('div');
    overlay.id = 'globalSyncOverlay';
    overlay.className = 'global-sync-overlay';
    
    overlay.innerHTML = `
        <div class="sync-card">
            <div class="sync-spinner" id="syncSpinner"></div>
            <div class="sync-message" id="syncStatus">
                <span>⚡</span> ${message}...
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Force browser repaint cycle grid tracking ticks to trigger animations correctly
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    // 3. Phase Two: Simulate execution buffer framework tick
    setTimeout(() => {
        const spinner = document.getElementById('syncSpinner');
        const textNode = document.getElementById('syncStatus');
        
        if (spinner) spinner.style.display = 'none'; // Drops spinner away
        if (textNode) textNode.innerHTML = `<span>⚡</span> Complete!`;

        // Run your layout price transformations cleanly behind the blur wall
        if (typeof completeCallback === 'function') {
            completeCallback();
        }

        // 4. Phase Three: Gracefully dissolve the entire dashboard window curtain
        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }, 800); // Display validation message duration window frame

    }, 1200); // Database simulation execution lag buffer
}

// CUSTOM PREMIUM GLASS MODAL ALTERNATIVE TO DEFAULT BROWSER ALERTS
function triggerCentralAlert(message) {
    // 1. Clear out any hanging older instances
    const existingAlert = document.getElementById('globalAlertOverlay');
    if (existingAlert) existingAlert.remove();

    // 2. Generate UI structures dynamically matching the loader layout templates
    const overlay = document.createElement('div');
    overlay.id = 'globalAlertOverlay';
    overlay.className = 'global-alert-overlay';
    
    overlay.innerHTML = `
        <div class="alert-card">
            <div class="alert-message">${message}</div>
            <button class="alert-btn" id="closeAlertBtn">Confirm</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // 3. Smooth fade-in activation loop
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    // 4. Kill-switch clean event handler closure
    document.getElementById('closeAlertBtn').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    });
}