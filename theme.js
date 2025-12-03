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
  const snowPath = '<path d="M11 2.05a1 1 0 012 0l.38 2.18 1.9-1.09a1 1 0 011 1.73l-1.9 1.1 1.9 1.1a1 1 0 01-1 1.72l-1.9-1.09L13 9.77l1.9.73a1 1 0 11-.72 1.87L13 12.64V14a1 1 0 11-2 0v-1.36l-1.18.46a1 1 0 01-.72-1.87l1.9-.73-1.18-2-1.9 1.1a1 1 0 01-1-1.73l1.9-1.09-1.9-1.1a1 1 0 011-1.72l1.9 1.09L11 2.05zm0 7.84l1-1.77 1 1.77-1 .38-1-.38zM5.2 15.2a1 1 0 011.4.2L8 17l1.4-1.6a1 1 0 111.5 1.32L10.1 18l1.8 1.28a1 1 0 11-1.16 1.64L9 19.3l-1.74 1.62a1 1 0 11-1.36-1.46L7.1 18l-1.5-1.48a1 1 0 01-.4-.82c0-.22.07-.44.2-.5zm7.9.2a1 1 0 011.4-.2l1.5 1.48 1.2-1.16a1 1 0 011.36 1.46L16 19.3l-1.74 1.62a1 1 0 01-1.36-1.46L14.9 18l-1.5-1.48a1 1 0 01-.2-1.32z"/>';

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const snowPreferenceKey = 'snowEffect';
  const snowflakeCount = 200;
  let snowContainer = null;

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

  function getSnowPreference() {
    return localStorage.getItem(snowPreferenceKey) === 'on';
  }

  function setSnowPreference(enabled) {
    localStorage.setItem(snowPreferenceKey, enabled ? 'on' : 'off');
    toggleSnow(enabled);
    updateSnowToggleState(enabled);
  }

  function ensureSnowContainer() {
    if (snowContainer) return snowContainer;
    snowContainer = document.createElement('div');
    snowContainer.className = 'snow-overlay';
    snowContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(snowContainer);
    return snowContainer;
  }

  function buildSnowflakes() {
    const container = ensureSnowContainer();
    if (container.childElementCount) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < snowflakeCount; i++) {
      const flake = document.createElement('span');
      flake.className = 'snowflake';
      const size = (Math.random() * 3 + 2).toFixed(2); // 2-5px for better visibility
      const duration = (Math.random() * 8 + 6).toFixed(2); // faster fall for intensity
      const delay = (Math.random() * 6).toFixed(2);
      const drift = (Math.random() * 60 - 30).toFixed(2);
      const xStart = (Math.random() * 100).toFixed(2);
      flake.style.setProperty('--flake-size', `${size}px`);
      flake.style.setProperty('--flake-duration', `${duration}s`);
      flake.style.setProperty('--flake-delay', `${delay}s`);
      flake.style.setProperty('--flake-drift', `${drift}px`);
      flake.style.setProperty('--flake-x-start', `${xStart}vw`);
      fragment.appendChild(flake);
    }
    container.appendChild(fragment);
  }

  function toggleSnow(enabled) {
    if (enabled) {
      buildSnowflakes();
      ensureSnowContainer().classList.add('active');
      return;
    }
    if (snowContainer) {
      snowContainer.classList.remove('active');
    }
  }

  function initializeSnow() {
    toggleSnow(getSnowPreference());
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
    themeMenu.setAttribute('id', 'themeMenu');
    themeMenu.setAttribute('aria-hidden', 'true');
    themeMenu.setAttribute('aria-labelledby', 'themeSwitch');
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
      <button type="button" data-snow="toggle" role="menuitemcheckbox" aria-checked="false">
        <svg viewBox="0 0 24 24" aria-hidden="true">${snowPath}</svg>
        <span>Schnee-Effekt</span>
        <i class="fa-solid fa-check"></i>
      </button>
    `;
    document.body.appendChild(themeMenu);

    themeSwitch.setAttribute('aria-controls', 'themeMenu');
    themeSwitch.setAttribute('aria-expanded', 'false');
    updateSnowToggleState(getSnowPreference());

    themeMenu.addEventListener('click', (e) => {
      const prefBtn = e.target.closest('button[data-pref]');
      const snowBtn = e.target.closest('button[data-snow]');

      if (prefBtn) {
        const pref = prefBtn.getAttribute('data-pref');
        themeSwitch.classList.add('rotating');
        setPreference(pref);
        closeMenu({ returnFocus: true });
        setTimeout(() => themeSwitch.classList.remove('rotating'), 400);
        return;
      }

      if (snowBtn) {
        const nextValue = !getSnowPreference();
        setSnowPreference(nextValue);
      }
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
      if (e.key === 'Escape') closeMenu({ returnFocus: true });
    });

    themeMenu.addEventListener('keydown', (e) => {
      const items = Array.from(themeMenu.querySelectorAll('button[data-pref], button[data-snow]'));
      if (!items.length) return;

      const currentIndex = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % items.length : 0;
        items[nextIndex].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex >= 0 ? (currentIndex - 1 + items.length) % items.length : items.length - 1;
        items[prevIndex].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu({ returnFocus: true });
      }
    });
  }

  function openMenu() {
    if (!themeMenu) return;
    themeMenu.classList.add('open');
    themeMenu.setAttribute('aria-hidden', 'false');
    themeSwitch.setAttribute('aria-expanded', 'true');
    const pref = getPreference();
    updateMenuActive(pref);
    updateSnowToggleState(getSnowPreference());
    const activeItem = themeMenu.querySelector('button.active') || themeMenu.querySelector('button[data-pref]');
    if (activeItem) {
      activeItem.focus();
    }
  }

  function closeMenu(options = {}) {
    if (!themeMenu) return;
    themeMenu.classList.remove('open');
    themeMenu.setAttribute('aria-hidden', 'true');
    themeSwitch.setAttribute('aria-expanded', 'false');
    if (options.returnFocus) {
      themeSwitch.focus();
    }
  }

  function updateMenuActive(pref) {
    if (!themeMenu) return;
    themeMenu.querySelectorAll('button[data-pref]').forEach(btn => {
      const isActive = btn.getAttribute('data-pref') === pref;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
    });
  }

  function updateSnowToggleState(enabled) {
    if (!themeMenu) return;
    const snowBtn = themeMenu.querySelector('button[data-snow]');
    if (!snowBtn) return;
    snowBtn.classList.toggle('active', enabled);
    snowBtn.setAttribute('aria-checked', String(enabled));
  }

  if (themeSwitch) {
    createMenu();
    themeSwitch.addEventListener('click', (e) => {
      e.preventDefault();
      if (!themeMenu) return;
      if (themeMenu.classList.contains('open')) {
        closeMenu({ returnFocus: true });
      } else {
        openMenu();
      }
    });

    themeSwitch.addEventListener('keydown', (e) => {
      if (!themeMenu) return;
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !themeMenu.classList.contains('open')) {
        e.preventDefault();
        openMenu();
      }
      if (e.key === 'Escape' && themeMenu.classList.contains('open')) {
        e.preventDefault();
        closeMenu({ returnFocus: true });
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
  initializeSnow();
});
