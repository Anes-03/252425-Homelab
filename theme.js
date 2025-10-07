document.addEventListener('DOMContentLoaded', function() {
  const themeSwitch = document.getElementById('themeSwitch');
  const themeIcon = document.getElementById('themeIcon');

  // SVG paths to keep markup valid (inject into existing <svg>)
  const sunPath = '<path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7z M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9z M20,13h-2c-0.55,0-1-0.45-1-1s0.45-1,1-1h2c0.55,0,1,0.45,1,1S20.55,13,20,13z M4,13H2c-0.55,0-1-0.45-1-1s0.45-1,1-1h2c0.55,0,1,0.45,1,1S4.55,13,4,13z M12,5c0.55,0,1-0.45,1-1V2c0-0.55-0.45-1-1-1s-1,0.45-1,1v2C11,4.55,11.45,5,12,5z M12,21c-0.55,0-1,0.45-1,1v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2C13,21.45,12.55,21,12,21z M18.36,6.64c0.39,0.39,1.02,0.39,1.41,0s0.39-1.02,0-1.41L18.36,3.81c-0.39-0.39-1.02-0.39-1.41,0c-0.39,0.39-0.39,1.02,0,1.41L18.36,6.64z M7.05,18.36c-0.39-0.39-1.02-0.39-1.41,0s-0.39,1.02,0,1.41l1.41,1.41c0.39,0.39,1.02,0.39,1.41,0c0.39-0.39,0.39-1.02,0-1.41L7.05,18.36z M18.36,16.95c0.39-0.39,0.39-1.02,0-1.41l-1.41-1.41c-0.39-0.39-1.02-0.39-1.41,0c-0.39,0.39-0.39,1.02,0,1.41l1.41,1.41C17.34,17.34,17.97,17.34,18.36,16.95z M5.64,5.22c0.39-0.39,1.02-0.39,1.41,0l1.41,1.41c0.39,0.39,0.39,1.02,0,1.41c-0.39,0.39-1.02-0.39-1.41,0l-1.41-1.41C5.25,6.24,5.25,5.61,5.64,5.22z"/>';
  const moonPath = '<path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/>';
  // Simple monitor icon for "System"
  const systemPath = '<path d="M4 5h16a2 2 0 012 2v8a2 2 0 01-2 2h-5v2h3a1 1 0 110 2H6a1 1 0 110-2h3v-2H4a2 2 0 01-2-2V7a2 2 0 012-2zm0 2v8h16V7H4z"/>';
  // Stylised sparkle for "Pitch Black"
  const pitchPath = '<path d="M12 2l1.7 4.79L18 8.5l-4.3 1.71L12 15l-1.7-4.79L6 8.5l4.3-1.71L12 2zm0 6.2l-.9 2.52L8.6 11.4l2.5 1 .9 2.6.9-2.6 2.5-1-2.5-.68-.9-2.52z"/>';

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getPreference() {
    // Migrate legacy key if present
    const legacy = localStorage.getItem('theme');
    const pref = localStorage.getItem('themePreference');
    if (!pref && legacy) {
      localStorage.setItem('themePreference', legacy);
      localStorage.removeItem('theme');
      return legacy;
    }
    return pref || 'system';
  }

  function setPreference(pref) {
    if (pref === 'system') {
      localStorage.setItem('themePreference', 'system');
    } else if (pref === 'light' || pref === 'dark' || pref === 'pitch') {
      localStorage.setItem('themePreference', pref);
    }
    applyPreference(pref);
    updateMenuActive(pref);
  }

  function effectiveThemeFor(pref) {
    if (pref === 'system') {
      return mediaQuery.matches ? 'dark' : 'light';
    }
    if (pref === 'pitch') {
      return 'pitch';
    }
    return pref === 'dark' ? 'dark' : 'light';
  }

  function updateIcon(pref) {
    const effective = effectiveThemeFor(pref);
    if (!themeIcon) return;
    // Show current effective theme
    if (effective === 'pitch') {
      themeIcon.innerHTML = pitchPath;
      return;
    }
    themeIcon.innerHTML = effective === 'dark' ? moonPath : sunPath;
  }

  function applyPreference(pref) {
    const effective = effectiveThemeFor(pref);
    document.documentElement.setAttribute('data-theme', effective);
    updateIcon(pref);
  }

  function initializeTheme() {
    const pref = getPreference();
    applyPreference(pref);
  }

  // --- Dropdown Menu ---
  let themeMenu = null;
  function createMenu() {
    if (themeMenu || !themeSwitch) return;
    themeMenu = document.createElement('div');
    themeMenu.className = 'theme-menu';
    themeMenu.setAttribute('role', 'menu');
    themeMenu.innerHTML = `
      <button type="button" data-pref="system" role="menuitemradio" aria-checked="false">
        <svg viewBox="0 0 24 24" aria-hidden="true">${systemPath}</svg>
        <span>System</span>
        <i class="fa-solid fa-check"></i>
      </button>
      <button type="button" data-pref="light" role="menuitemradio" aria-checked="false">
        <svg viewBox="0 0 24 24" aria-hidden="true">${sunPath}</svg>
        <span>Hell</span>
        <i class="fa-solid fa-check"></i>
      </button>
      <button type="button" data-pref="dark" role="menuitemradio" aria-checked="false">
        <svg viewBox="0 0 24 24" aria-hidden="true">${moonPath}</svg>
        <span>Dunkel</span>
        <i class="fa-solid fa-check"></i>
      </button>
      <button type="button" data-pref="pitch" role="menuitemradio" aria-checked="false">
        <svg viewBox="0 0 24 24" aria-hidden="true">${pitchPath}</svg>
        <span>Pitch Black</span>
        <i class="fa-solid fa-check"></i>
      </button>
    `;
    document.body.appendChild(themeMenu);

    themeMenu.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-pref]');
      if (!btn) return;
      const pref = btn.getAttribute('data-pref');
      themeSwitch.classList.add('rotating');
      setPreference(pref);
      closeMenu();
      setTimeout(() => themeSwitch.classList.remove('rotating'), 400);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!themeMenu) return;
      if (e.target === themeSwitch || themeSwitch.contains(e.target)) return;
      if (e.target === themeMenu || themeMenu.contains(e.target)) return;
      closeMenu();
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  function openMenu() {
    if (!themeMenu) return;
    themeMenu.classList.add('open');
    const pref = getPreference();
    updateMenuActive(pref);
  }

  function closeMenu() {
    if (!themeMenu) return;
    themeMenu.classList.remove('open');
  }

  function updateMenuActive(pref) {
    if (!themeMenu) return;
    themeMenu.querySelectorAll('button[data-pref]').forEach(btn => {
      const isActive = btn.getAttribute('data-pref') === pref;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
    });
  }

  if (themeSwitch) {
    createMenu();
    themeSwitch.addEventListener('click', (e) => {
      e.preventDefault();
      if (!themeMenu) return;
      if (themeMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // React to system changes only if preference is 'system'
  mediaQuery.addEventListener('change', () => {
    if (getPreference() === 'system') {
      applyPreference('system');
    }
  });

  initializeTheme();
});

