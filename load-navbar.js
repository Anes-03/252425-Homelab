// Load Navbar
document.addEventListener('DOMContentLoaded', function() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    
    if (navbarPlaceholder) {
        fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                
                // Initialize navbar functionality after loading
                const navbarToggle = document.getElementById('navbar-toggle');
                const navbarMenu = document.getElementById('navbar-menu');
                
                if (navbarToggle && navbarMenu) {
                    const toggleMenu = (forceState, options = {}) => {
                        const isOpen = typeof forceState === 'boolean'
                            ? forceState
                            : !navbarMenu.classList.contains('active');

                        navbarMenu.classList.toggle('active', isOpen);
                        navbarToggle.classList.toggle('active', isOpen);
                        navbarToggle.setAttribute('aria-expanded', String(isOpen));

                        if (!isOpen && options.restoreFocus) {
                            navbarToggle.focus();
                        }
                    };

                    navbarToggle.addEventListener('click', function() {
                        toggleMenu();
                    });

                    navbarToggle.addEventListener('keydown', function(event) {
                        if (event.key === 'Escape') {
                            toggleMenu(false, { restoreFocus: true });
                        }
                    });

                    // Close menu when clicking on a link
                    const navLinks = document.querySelectorAll('.nav-link');
                    navLinks.forEach(link => {
                        link.addEventListener('click', function() {
                            toggleMenu(false);
                        });
                    });

                    // Close menu when clicking outside
                    document.addEventListener('click', function(event) {
                        const isClickInsideNavbar = navbarToggle.contains(event.target) || navbarMenu.contains(event.target);

                        if (!isClickInsideNavbar && navbarMenu.classList.contains('active')) {
                            toggleMenu(false);
                        }
                    });

                    document.addEventListener('keydown', function(event) {
                        if (event.key === 'Escape' && navbarMenu.classList.contains('active')) {
                            toggleMenu(false, { restoreFocus: true });
                        }
                    });
                }
                
                // Highlight current page in navigation
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const navLinks = document.querySelectorAll('.nav-link');
                
                navLinks.forEach(link => {
                    const linkHref = link.getAttribute('href');
                    if (linkHref === currentPage) {
                        link.classList.add('active');
                    }
                });

                if (typeof window.initializeSiteSearch === 'function') {
                    window.initializeSiteSearch();
                }
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                navbarPlaceholder.innerHTML = '<!-- Navbar konnte nicht geladen werden -->';
            });
    }
}); 