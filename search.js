(function() {
    const MIN_QUERY_LENGTH = 2;
    let searchIndex = [];
    let hasLoadedIndex = false;
    let isInitializing = false;
    let initialized = false;

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function normalize(text) {
        return (text || '').toLowerCase();
    }

    function buildSnippet(content, query) {
        if (!content) {
            return '';
        }

        const lowerContent = normalize(content);
        const lowerQuery = normalize(query);
        const index = lowerContent.indexOf(lowerQuery);

        if (index === -1) {
            const preview = content.trim().slice(0, 160);
            return preview.length < content.trim().length ? `${preview}…` : preview;
        }

        const contextRadius = 90;
        const start = Math.max(0, index - contextRadius);
        const end = Math.min(content.length, index + query.length + contextRadius);
        let snippet = content.slice(start, end).trim();

        if (start > 0) {
            snippet = `…${snippet}`;
        }
        if (end < content.length) {
            snippet = `${snippet}…`;
        }

        const highlightRegex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return snippet.replace(highlightRegex, '<mark>$1</mark>');
    }

    function renderResults(container, emptyState, results, query) {
        container.innerHTML = '';

        if (!query || query.length < MIN_QUERY_LENGTH) {
            emptyState.textContent = 'Gib einen Suchbegriff ein, um Ergebnisse zu sehen.';
            emptyState.style.display = 'block';
            return;
        }

        if (!results.length) {
            emptyState.textContent = 'Keine Treffer gefunden. Versuche es mit einem anderen Begriff.';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        const fragment = document.createDocumentFragment();
        results.forEach(result => {
            const link = document.createElement('a');
            link.className = 'search-result-item';
            link.href = result.url;
            link.setAttribute('role', 'option');
            link.innerHTML = `
                <h3>${result.title}</h3>
                <p>${buildSnippet(result.content, query)}</p>
            `;
            fragment.appendChild(link);
        });

        container.appendChild(fragment);
    }

    function filterResults(query) {
        const normalizedQuery = normalize(query);
        return searchIndex.filter(entry => {
            return (
                normalize(entry.title).includes(normalizedQuery) ||
                normalize(entry.content).includes(normalizedQuery)
            );
        });
    }

    function loadSearchIndex() {
        if (hasLoadedIndex) {
            return Promise.resolve(searchIndex);
        }
        if (isInitializing) {
            return new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    if (hasLoadedIndex) {
                        clearInterval(checkInterval);
                        resolve(searchIndex);
                    }
                }, 50);
            });
        }

        isInitializing = true;
        return fetch('search-index.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                searchIndex = Array.isArray(data) ? data : [];
                hasLoadedIndex = true;
                isInitializing = false;
                return searchIndex;
            })
            .catch(error => {
                console.error('Suche konnte nicht geladen werden:', error);
                hasLoadedIndex = true;
                isInitializing = false;
                searchIndex = [];
                return searchIndex;
            });
    }

    function disableBodyScroll() {
        document.body.dataset.scrollY = window.scrollY;
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    }

    function enableBodyScroll() {
        const scrollY = document.body.dataset.scrollY ? parseInt(document.body.dataset.scrollY, 10) : 0;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
        delete document.body.dataset.scrollY;
    }

    function openOverlay(overlay, toggleButton, input) {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        toggleButton.setAttribute('aria-expanded', 'true');
        disableBodyScroll();
        setTimeout(() => input.focus(), 50);
    }

    function closeOverlay(overlay, toggleButton, input, resultsContainer, emptyState) {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        toggleButton.setAttribute('aria-expanded', 'false');
        input.value = '';
        resultsContainer.innerHTML = '';
        emptyState.textContent = 'Gib einen Suchbegriff ein, um Ergebnisse zu sehen.';
        emptyState.style.display = 'block';
        enableBodyScroll();
    }

    window.initializeSiteSearch = function initializeSiteSearch() {
        if (initialized) {
            return;
        }

        const toggleButton = document.getElementById('search-toggle');
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('site-search-input');
        const closeButton = document.getElementById('search-close');
        const resultsContainer = document.getElementById('search-results');
        const emptyState = document.getElementById('search-empty');

        if (!toggleButton || !overlay || !input || !closeButton || !resultsContainer || !emptyState) {
            return;
        }

        initialized = true;

        function handleOpen(event) {
            event.preventDefault();
            loadSearchIndex().then(() => {
                openOverlay(overlay, toggleButton, input);
            });
        }

        function handleClose(event) {
            event.preventDefault();
            closeOverlay(overlay, toggleButton, input, resultsContainer, emptyState);
        }

        toggleButton.addEventListener('click', handleOpen);
        closeButton.addEventListener('click', handleClose);

        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                closeOverlay(overlay, toggleButton, input, resultsContainer, emptyState);
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && overlay.classList.contains('active')) {
                closeOverlay(overlay, toggleButton, input, resultsContainer, emptyState);
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                loadSearchIndex().then(() => {
                    if (!overlay.classList.contains('active')) {
                        openOverlay(overlay, toggleButton, input);
                    }
                });
            }
        });

        input.addEventListener('input', event => {
            const query = event.target.value.trim();
            if (!query) {
                resultsContainer.innerHTML = '';
                emptyState.textContent = 'Gib einen Suchbegriff ein, um Ergebnisse zu sehen.';
                emptyState.style.display = 'block';
                return;
            }

            if (query.length < MIN_QUERY_LENGTH) {
                resultsContainer.innerHTML = '';
                emptyState.textContent = 'Bitte mindestens zwei Zeichen eingeben.';
                emptyState.style.display = 'block';
                return;
            }

            const results = filterResults(query);
            renderResults(resultsContainer, emptyState, results, query);
        });

        resultsContainer.addEventListener('click', () => {
            closeOverlay(overlay, toggleButton, input, resultsContainer, emptyState);
        });

        overlay.setAttribute('aria-hidden', 'true');
    };
})();
