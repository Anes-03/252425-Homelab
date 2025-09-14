document.addEventListener('DOMContentLoaded', (event) => {
    // Gather all spotlight modals
    const modals = Array.from(document.querySelectorAll('.modal.auto-spotlight'));
    if (modals.length === 0) return;

    // Read configuration from the first modal (assumed consistent across)
    const configEl = modals[0];
    const frequency = (configEl.dataset.frequency || 'always').toLowerCase();
    const cooldownHours = parseInt(configEl.dataset.cooldownHours || '24', 10);

    // Group storage keys for rotation and cooldowns
    const storageKeyBase = 'autoSpotlight';
    const lastShownKey = `${storageKeyBase}:lastShown`;
    const shownSessionKey = `${storageKeyBase}:shownSession`;
    const dismissedKey = `${storageKeyBase}:dismissed`;
    const quietUntilKey = `${storageKeyBase}:quietUntil`;
    const indexKey = `${storageKeyBase}:index`; // legacy rotation
    const lastIdKey = `${storageKeyBase}:lastId`;

    let activeModal = null;

    const now = () => Date.now();
    const hoursToMs = (h) => h * 60 * 60 * 1000;

    const shouldShow = () => {
        const quietUntil = parseInt(localStorage.getItem(quietUntilKey) || '0', 10);
        if (quietUntil && now() < quietUntil) return false;
        if (quietUntil && now() >= quietUntil) localStorage.removeItem(quietUntilKey);

        switch (frequency) {
            case 'never':
                return false;
            case 'once':
                return !localStorage.getItem(dismissedKey);
            case 'session':
                return !sessionStorage.getItem(shownSessionKey);
            case 'daily': {
                const last = parseInt(localStorage.getItem(lastShownKey) || '0', 10);
                return now() - last >= hoursToMs(24);
            }
            case 'weekly': {
                const last = parseInt(localStorage.getItem(lastShownKey) || '0', 10);
                return now() - last >= hoursToMs(24 * 7);
            }
            case 'interval': {
                const last = parseInt(localStorage.getItem(lastShownKey) || '0', 10);
                return now() - last >= hoursToMs(isNaN(cooldownHours) ? 24 : cooldownHours);
            }
            case 'always':
            default:
                return true;
        }
    };

    const markShown = () => {
        if (frequency === 'session') {
            sessionStorage.setItem(shownSessionKey, '1');
        } else if (['daily', 'weekly', 'interval'].includes(frequency)) {
            localStorage.setItem(lastShownKey, String(now()));
        }
    };

    const openModal = (m) => {
        activeModal = m;
        m.style.display = 'flex';
        m.classList.add('show');
    };

    const closeActiveModal = () => {
        const m = activeModal;
        if (!m) return;
        m.classList.add('closing');
        setTimeout(() => {
            m.style.display = 'none';
            m.classList.remove('show', 'closing');
        }, 200);

        if (frequency === 'once') {
            localStorage.setItem(dismissedKey, '1');
        }

        activeModal = null;
    };

    // Show one modal if allowed, rotating through candidates
    const params = new URLSearchParams(window.location.search);
    const previewId = params.get('spotlightPreview');
    const previewMode = !!previewId;

    if (previewMode) {
        // Preview mode: bypass cooldown/quiet checks, do not persist anything
        const target = modals.find(m => m.id === previewId) || modals[0];
        openModal(target);
    } else if (shouldShow()) {
        // New rotation: pick the modal after the one last shown
        const lastId = localStorage.getItem(lastIdKey);
        const lastIdx = lastId ? Math.max( modals.findIndex(m => m.id === lastId), -1) : -1;
        const nextIdx = (lastIdx + 1 + modals.length) % modals.length;
        const target = modals[nextIdx];
        openModal(target);
        markShown();
        // Persist new rotation state
        localStorage.setItem(lastIdKey, target.id);
        // Maintain legacy counter for backwards compatibility
        const legacyIdx = parseInt(localStorage.getItem(indexKey) || '0', 10) || 0;
        localStorage.setItem(indexKey, String(legacyIdx + 1));
    }

    // Bind close buttons (X) in all modals
    document.querySelectorAll('.modal.auto-spotlight .close:not(.quiet-close)').forEach((btn) => {
        btn.addEventListener('click', () => closeActiveModal());
    });

    // Quiet-today
    const setQuietUntilEndOfToday = () => {
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        localStorage.setItem(quietUntilKey, String(endOfToday.getTime()));
    };

    document.querySelectorAll('.modal.auto-spotlight .quiet-close').forEach((quietEl) => {
        quietEl.addEventListener('click', (e) => {
            e.preventDefault();
            setQuietUntilEndOfToday();
            closeActiveModal();
        });
    });

    // Close when clicking outside content
    modals.forEach((m) => {
        m.addEventListener('click', (event) => {
            if (event.target === m) closeActiveModal();
        });
    });
});
