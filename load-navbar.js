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
                    navbarToggle.addEventListener('click', function() {
                        navbarMenu.classList.toggle('active');
                        navbarToggle.classList.toggle('active');
                    });
                    
                    // Close menu when clicking on a link
                    const navLinks = document.querySelectorAll('.nav-link');
                    navLinks.forEach(link => {
                        link.addEventListener('click', function() {
                            navbarMenu.classList.remove('active');
                            navbarToggle.classList.remove('active');
                        });
                    });
                    
                    // Close menu when clicking outside
                    document.addEventListener('click', function(event) {
                        const isClickInsideNavbar = navbarToggle.contains(event.target) || navbarMenu.contains(event.target);
                        
                        if (!isClickInsideNavbar && navbarMenu.classList.contains('active')) {
                            navbarMenu.classList.remove('active');
                            navbarToggle.classList.remove('active');
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
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                navbarPlaceholder.innerHTML = '<!-- Navbar konnte nicht geladen werden -->';
            });
    }
}); 