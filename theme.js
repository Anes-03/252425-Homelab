document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('themeSwitch');
    const themeIcon = document.getElementById('themeIcon');
    
    const sunIcon = `<svg id="themeIcon" viewBox="0 0 24 24"><path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7z M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9z M20,13h-2c-0.55,0-1-0.45-1-1s0.45-1,1-1h2c0.55,0,1,0.45,1,1S20.55,13,20,13z M4,13H2c-0.55,0-1-0.45-1-1s0.45-1,1-1h2c0.55,0,1,0.45,1,1S4.55,13,4,13z M12,5c0.55,0,1-0.45,1-1V2c0-0.55-0.45-1-1-1s-1,0.45-1,1v2C11,4.55,11.45,5,12,5z M12,21c-0.55,0-1,0.45-1,1v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2C13,21.45,12.55,21,12,21z M18.36,6.64c0.39,0.39,1.02,0.39,1.41,0l0,0c0.39-0.39,0.39-1.02,0-1.41L18.36,3.81C17.97,3.42,17.34,3.42,16.95,3.81c-0.39,0.39-0.39,1.02,0,1.41L18.36,6.64z M7.05,18.36c-0.39-0.39-1.02-0.39-1.41,0l0,0c-0.39,0.39-0.39,1.02,0,1.41l1.41,1.41c0.39,0.39,1.02,0.39,1.41,0c0.39-0.39,0.39-1.02,0-1.41L7.05,18.36z M18.36,16.95c0.39-0.39,0.39-1.02,0-1.41l-1.41-1.41c-0.39-0.39-1.02-0.39-1.41,0c-0.39,0.39-0.39,1.02,0,1.41l1.41,1.41C17.34,17.34,17.97,17.34,18.36,16.95z M5.64,5.22c0.39-0.39,1.02-0.39,1.41,0l1.41,1.41c0.39,0.39,0.39,1.02,0,1.41c-0.39,0.39-1.02-0.39-1.41,0l-1.41-1.41C5.25,6.24,5.25,5.61,5.64,5.22z"/></svg>`;
    const moonIcon = `<svg id="themeIcon" viewBox="0 0 24 24"><path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/></svg>`;

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.innerHTML = moonIcon;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.innerHTML = sunIcon;
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save user's choice
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { // Only change if user hasn't made a manual choice
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    initializeTheme();
});
