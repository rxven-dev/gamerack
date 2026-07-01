document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    const viewPanes = document.querySelectorAll(".view-pane");
    const titleHeader = document.getElementById("currentViewTitle");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            viewPanes.forEach(pane => pane.classList.remove("active"));

            item.classList.add("active");
            const target = item.getAttribute("data-target");
            const activePane = document.getElementById(`view-${target}`);
            if (activePane) activePane.classList.add("active");
            
            titleHeader.innerText = item.textContent.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '').trim();
        });
    });
});

// ==========================================================================
// CENTRAL SYSTEM NODE DEAUTHORIZATION (SIGN OUT INTERCEPTOR)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const signoutBtn = document.getElementById('systemSignoutBtn');
    
    if (signoutBtn) {
        signoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Verify your custom dynamic screen handler from assets/js/loading-screen.js exists
            if (typeof triggerCentralSync === "function") {
                
                // 2. Spin your beautiful custom sync loading block over the view dashboard frame
                triggerCentralSync("Terminating Node Handshake & Revoking Access Tokens", () => {
                    
                    // 3. This clean block triggers smoothly right behind the frosted blur screen wall!
                    localStorage.removeItem("gamerack_authenticated");
                    window.location.replace("auth.html");
                });
                
            } else {
                // Instantly cycle parameters if script references are missing in memory
                localStorage.removeItem("gamerack_authenticated");
                window.location.replace("auth.html");
            }
        });
    }
});