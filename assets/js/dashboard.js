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

//central system node sign out logic
// --- 🚪 Enhanced Sign Out Session Purge ---
document.addEventListener("DOMContentLoaded", () => {
    const signoutBtn = document.getElementById('systemSignoutBtn');
    
    if (signoutBtn) {
        signoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const spClient = window.globalSupabase;

            const executePurge = async () => {
                if (spClient) {
                    await spClient.auth.signOut();
                }
                // 🎯 Clear ALL lingering authentication cache keys completely
                localStorage.removeItem("gamerack_authenticated");
                localStorage.clear(); 
                sessionStorage.clear();
                
                window.location.replace("auth.html");
            };

            if (typeof triggerCentralSync === "function") {
                triggerCentralSync("Terminating Node Handshake & Revoking Access Tokens", async () => {
                    await executePurge();
                });
            } else {
                await executePurge();
            }
        });
    }
});