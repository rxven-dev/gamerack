// ==========================================================================
// DYNAMIC CORE CATALOG RENDER ENGINE (Paste it right here!)
// ==========================================================================
function renderCatalog() {
    const grid = document.getElementById("catalogGrid");
    if (!grid) return;
    grid.innerHTML = "";
    
    // Read your current active selection layout string configurations safely
    const currentActive = window.currentCurrency || 'USD';
    const activeConfig = window.EXCHANGE_RATES[currentActive];
    
    GAMES_DATA.forEach(game => {
        // Calculate the currency multiplier math shifts safely
        const convertedPrice = game.price * activeConfig.rate;
        const priceDisplay = game.price === 0 ? 'FREE' : `${activeConfig.sign}${convertedPrice.toFixed(2)}`;

        const card = document.createElement("div");
        card.className = "ios-card glass catalog-item-card";
        card.innerHTML = `
            <div onclick="openCardDetails(${game.id})">
                <h4>${game.title}</h4>
                <p style="color:var(--text-secondary); font-size:13px;">${game.category}</p>
                <div class="catalog-price-row">
                    <span style="font-weight:700;">${priceDisplay}</span>
                    <button class="ios-btn-primary" style="width:auto; padding:6px 12px; font-size:13px;" onclick="event.stopPropagation(); appendToCart(${game.id})">Get</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================================================================
// DYNAMIC SEARCH FILTER ENGINE (Keep this right underneath it)
// ==========================================================================
function initCatalogSearch() {
    const searchInput = document.getElementById('dashboardSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('#catalogGrid .catalog-item-card');
        
        cards.forEach(card => {
            const titleText = card.querySelector('h4').textContent.toLowerCase();
            const categoryText = card.querySelector('p').textContent.toLowerCase();
            
            if (titleText.includes(searchTerm) || categoryText.includes(searchTerm)) {
                card.style.display = ""; 
                card.style.opacity = "1";
            } else {
                card.style.display = "none"; 
            }
        });
    });
}

// Global lifecycle initialization bootloader
window.addEventListener("DOMContentLoaded", () => {
    renderCatalog();
    initCatalogSearch(); 
});