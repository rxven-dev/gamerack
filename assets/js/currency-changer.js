function initCurrencySwitcher() {
    const selector = document.getElementById('currencyChanger');
    if (!selector) return;

    selector.addEventListener('change', (e) => {
        const targetCurrency = e.target.value;

        // Call the central loader overlay script first
        triggerCentralSync(`Syncing Currency to ${targetCurrency}`, () => {
            
            // This code now executes safely right behind the blur window!
            window.currentCurrency = targetCurrency;
            
            if (typeof renderCatalog === 'function') {
                renderCatalog();
            }

            const grossElement = document.getElementById('grossEarnings');
            if (grossElement) {
                const baseEarnings = 128450.00;
                const config = window.EXCHANGE_RATES[window.currentCurrency];
                const converted = baseEarnings * config.rate;
                
                grossElement.textContent = config.sign + converted.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', initCurrencySwitcher);