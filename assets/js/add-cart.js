// (Add these variables and updated function to your existing add-cart.js)
let checkoutBasket = [];

function appendToCart(gameId) {
    const matched = GAMES_DATA.find(g => g.id === gameId);
    if(matched) {
        checkoutBasket.push(matched);
        updateCartDisplay();
    }
}

// Updated Display Logic: Updates multiple badge instances (desktop/mobile)
function updateCartDisplay() {
    // 1. Update both the desktop sidebar badge and the mobile FAB badge
    const count = checkoutBasket.length;
    document.querySelectorAll('.js-cart-badge').forEach(badge => badge.innerText = count);
    
    // Update main View (If user is currently viewing the cart pane)
    const container = document.getElementById("cartItemsList");
    const totalElem = document.getElementById("cartTotal");
    if(!container) return;
    
    if(checkoutBasket.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your checkout list is clear.</p>';
        totalElem.innerText = "$0.00";
        return;
    }
    
    container.innerHTML = checkoutBasket.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:15px;">
            <span>${item.title}</span>
            <span style="font-weight:600;">$${item.price.toFixed(2)}</span>
        </div>
    `).join("");
    
    let sum = checkoutBasket.reduce((acc, current) => acc + current.price, 0);
    totalElem.innerText = `$${sum.toFixed(2)}`;
}