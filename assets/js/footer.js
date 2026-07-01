// ==========================================================================
// 🔌 DYNAMIC CONSOLE CLIENT METRIC FOOTER GENERATOR WITH SOCIAL LINK VIEWS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const viewportWrapper = document.querySelector('.viewport-wrapper');
    
    if (viewportWrapper) {
        const footerContainer = document.createElement('footer');
        footerContainer.className = 'ios-footer';
        
        const currentYear = new Date().getFullYear();
        
        footerContainer.innerHTML = `
            <div class="footer-top-row">
                <div class="footer-brand-info">
                    <div class="footer-brand-title">🎮 Gamerack Console</div>
                    <div class="footer-brand-subtitle">SECURE DOMAIN DEPLOYMENT MESH // NODE_PH_01</div>
                </div>
                
                <div class="footer-social-wrapper">
                    <a href="https://www.facebook.com/share/1Khp1696z6/" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="Connect on Facebook">
                        <svg style="width:1.1em; height:1.1em; fill:currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
                    </a>
                    <a href="https://www.instagram.com/dasnotrxvn?igsh=c3h0aGhrYzZyc28=" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="Connect on Instagram">
                        <svg style="width:1.1em; height:1.1em; fill:currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    <a href="https://www.tiktok.com/@rxvenonlyacc?_r=1&_t=ZS-97fqnTxIiZh" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="Connect on TikTok" style="display: inline-flex; align-items: center; justify-content: center;">
                        <img src="https://i.ibb.co/FqNGHr4C/3046120.png" alt="TikTok" style="width: 1.1em; height: 1.1em; object-fit: contain; filter: brightness(0) invert(0.45); transition: filter 0.2s ease;">
                    </a>
                </div>

                <div class="footer-dev-credit">
                    Developed by <strong>Raven Callenero</strong>
                </div>
            </div>
            
            <hr class="footer-divider">
            
            <div class="footer-bottom-row">
                <div class="footer-copyright">
                    &copy; ${currentYear} Gamerack. All credentials initialized securely.
                </div>
                <div class="footer-telemetry">
                    <div class="telemetry-item">
                        <span class="telemetry-pulse"></span> SYSTEM: ONLINE
                    </div>
                    <div class="telemetry-item">
                        LATENCY: <span id="footerPingTime">14ms</span>
                    </div>
                    <div class="telemetry-item" style="color: #a855f7;">
                        BUILD: v4.2.0-STABLE
                    </div>
                </div>
            </div>
        `;
        
        viewportWrapper.appendChild(footerContainer);
        
        // Dynamic simulated network latency heartbeat ticker loop
        setInterval(() => {
            const pingNode = document.getElementById('footerPingTime');
            if (pingNode) {
                const simulatedPing = Math.floor(Math.random() * (22 - 11 + 1)) + 11;
                pingNode.textContent = `${simulatedPing}ms`;
            }
        }, 3500);
        
        // CSS Overdrive hook to handle clean image hover lighting color filters inside style layers
        const tiktokLink = footerContainer.querySelector('a[title="Connect on TikTok"] img');
        if (tiktokLink) {
            const parentAnchor = tiktokLink.parentElement;
            parentAnchor.addEventListener('mouseenter', () => {
                tiktokLink.style.filter = 'none'; // Reverts image back to clean bright color profile match on hover
            });
            parentAnchor.addEventListener('mouseleave', () => {
                tiktokLink.style.filter = 'brightness(0) invert(0.45)'; // Fades back down into gray slate format safely
            });
        }
    }
});