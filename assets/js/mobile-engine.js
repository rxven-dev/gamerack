// 📱 GAMERACK FLUID MOBILE INTERACTION ENGINE
document.addEventListener('DOMContentLoaded', () => {
    // Select both the old sidebar and original layout selector classes from your index.html
    const sidebar = document.querySelector('.sidebar') || document.querySelector('.ios-sidebar');
    const menuBtn = document.getElementById('mobileMenuBtn');
    const profilePill = document.querySelector('.profile-pill') || document.querySelector('.user-badge');

    if (!sidebar) return;

    // Helper functions to open and close smoothly
    const openMobileMenu = () => {
        sidebar.classList.add('mobile-open');
        if (menuBtn) menuBtn.classList.add('active');
    };

    const closeMobileMenu = () => {
        sidebar.classList.remove('mobile-open');
        if (menuBtn) menuBtn.classList.remove('active');
    };

    // 1. Open drawer via the 3-lines Hamburger button
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar.classList.contains('mobile-open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // 2. Open drawer via clicking the profile indicator pill
    if (profilePill) {
        profilePill.addEventListener('click', (e) => {
            e.stopPropagation();
            openMobileMenu();
        });
    }

    // 3. Dismiss menu when selecting any navigation link item
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // 4. Dismiss menu when clicking outside on the background layout mask
    document.body.addEventListener('click', (e) => {
        if (sidebar.classList.contains('mobile-open') && 
            !sidebar.contains(e.target) && 
            (!menuBtn || !menuBtn.contains(e.target)) &&
            (!profilePill || !profilePill.contains(e.target))) {
            closeMobileMenu();
        }
    });
});