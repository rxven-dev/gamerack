// ==========================================================================
// GLOBALS & EXCHANGE RATES DEFINITIONS
// ==========================================================================
window.EXCHANGE_RATES = {
    USD: { rate: 1.0, sign: '$' },
    EUR: { rate: 0.92, sign: '€' },
    PHP: { rate: 58.50, sign: '₱' }
};

// Default setup fallback state
window.currentCurrency = window.currentCurrency || 'USD';

// ==========================================================================
// CORE PROJECT DATA GRID MATRIX
// ==========================================================================
const GAMES_DATA = [
    { id: 1, title: "Cyber Horizon 2088", category: "RPG", price: 59.99, downloads: "12K", rating: 4.8 },
    { id: 2, title: "Veloce Racing Mobile", category: "Simulation", price: 19.99, downloads: "84K", rating: 4.5 },
    { id: 3, title: "Shadow Rogue Arena", category: "Action", price: 0.00, downloads: "230K", rating: 4.2 }
];