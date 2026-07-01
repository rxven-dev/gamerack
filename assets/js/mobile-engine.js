// Functionality to open/close the fluid mobile sidebar
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.ios-sidebar');
    
    // 1. We need a trigger. Let's make the "Online Indicator" in top-bar the trigger on mobile.
    const menuTrigger = document.querySelector('.profile-pill');
    
    if (window.innerWidth <= 768) {
        // Toggle mobile sidebar open
        menuTrigger.addEventListener('click', () => {
            sidebar.classList.add('mobile-open');
        });

        // Close when clicking *outside* the sidebar or clicking a link
        document.body.addEventListener('click', (e) => {
            if (sidebar.classList.contains('mobile-open') && 
                !sidebar.contains(e.target) && 
                !menuTrigger.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });
        
        // Ensure nav-links close the menu on click
        const navLinks = document.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
            });
        });
    }
});