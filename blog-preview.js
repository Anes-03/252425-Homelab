(function () {
    const BLOG_ORIGIN = 'https://blog.252425.xyz/';
    const container = document.getElementById('blog-preview-grid');
    if (!container) {
        return;
    }

    let statusElement = container.querySelector('[data-blog-status]');
    const setStatus = (message) => {
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.hidden = false;
            if (!statusElement.isConnected) {
                container.prepend(statusElement);
            }
        } else {
            const status = document.createElement('p');
            status.className = 'blog-preview-status';
            status.textContent = message;
            status.setAttribute('data-blog-status', '');
            container.prepend(status);
            statusElement = status;
        }
    };

    const clearStatus = () => {
        if (statusElement) {
            statusElement.hidden = true;
            statusElement.textContent = '';
        }
    };

    if (typeof window.fetch !== 'function') {
        setStatus('Blogbeiträge können in diesem Browser nicht geladen werden.');
        return;
    }

    const SOURCES = [
        { url: 'https://blog.252425.xyz/index.json', type: 'json' },
        { url: 'https://blog.252425.xyz/feed.json', type: 'json' },
        { url: 'https://blog.252425.xyz/feed', type: 'rss' },
        { url: 'https://blog.252425.xyz/index.xml', type: 'rss' },
        { url: 'https://blog.252425.xyz/rss.xml', type: 'rss' }
    ];

    const stripHtml = (input) => {
        if (!input) return '';
        const temp = document.createElement('div');
        temp.innerHTML = input;
        const text = temp.textContent || temp.innerText || '';
        return text.replace(/\s+/g, ' ').trim();
    };

    const extractImageFromHtml = (html) => {
        if (!html) return '';
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const img = temp.querySelector('img[src]');
        return img?.getAttribute('src')?.trim() || '';
    };

    const extractImageFromJsonItem = (item) => {
        if (!item || typeof item !== 'object') return '';
        const candidateKeys = [
            'image',
            'banner_image',
            'feature_image',
            'featured_image',
            'cover_image',
            'thumbnail',
            'thumb',
            'hero_image',
            'meta_image',
            'social_image'
        ];
        for (const key of candidateKeys) {
            const value = item[key];
            if (typeof value === 'string' && value.trim()) {
                return value.trim();
            }
        }

        if (Array.isArray(item.attachments)) {
            const attachment = item.attachments.find((att) => {
                if (!att || typeof att !== 'object') return false;
                const type = att.mime_type || att.type || '';
                return typeof type === 'string' && type.startsWith('image/');
            });
            if (attachment) {
                const url = attachment.url || attachment.href;
                if (typeof url === 'string' && url.trim()) {
                    return url.trim();
                }
            }
        }

        const html = item.content_html || item.content || item.summary || '';
        return extractImageFromHtml(html);
    };

    const extractImageFromRssNode = (node) => {
        if (!node) return '';
        const enclosure = node.querySelector('enclosure[url]');
        if (enclosure) {
            const type = enclosure.getAttribute('type');
            if (!type || type.startsWith('image/')) {
                const url = enclosure.getAttribute('url');
                if (url && url.trim()) {
                    return url.trim();
                }
            }
        }

        const mediaNode = node.querySelector('media\\:content[url], media\\:thumbnail[url], media\\:group media\\:content[url]');
        if (mediaNode) {
            const url = mediaNode.getAttribute('url');
            if (url && url.trim()) {
                return url.trim();
            }
        }

        const imageNode = node.querySelector('image url');
        if (imageNode) {
            const url = imageNode.textContent;
            if (url && url.trim()) {
                return url.trim();
            }
        }

        const html = node.querySelector('content\\:encoded, encoded, content, description')?.textContent || '';
        return extractImageFromHtml(html);
    };

    const pickFirstString = (item, keys) => {
        if (!item || typeof item !== 'object') return '';
        for (const key of keys) {
            const value = item[key];
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed) {
                    return trimmed;
                }
            }
        }
        return '';
    };

    const normalisePosts = (rawPosts) => {
        if (!Array.isArray(rawPosts)) return [];
        return rawPosts
            .map((item) => {
                const title = item.title ? String(item.title).trim() : '';
                const url = item.url || item.link || '';
                const description =
                    pickFirstString(item, [
                        'summary',
                        'excerpt',
                        'description',
                        'content_text',
                        'content_html',
                        'content',
                        'body',
                        'text',
                        'abstract'
                    ]) || '';
                const published = item.date_published || item.published || item.pubDate || item.updated || '';
                const image = item.image || '';
                return { title, url, description, published, image };
            })
            .filter((item) => item.title && item.url);
    };

    const deriveBaseFromUrl = (value) => {
        if (!value || typeof value !== 'string') {
            return BLOG_ORIGIN;
        }
        try {
            const url = new URL(value, BLOG_ORIGIN);
            return new URL('.', url.href).href;
        } catch (error) {
            return BLOG_ORIGIN;
        }
    };

    const parseJsonFeed = (data, fallbackBase) => {
        if (!data || typeof data !== 'object') {
            return { posts: [], baseUrl: fallbackBase };
        }
        const items = Array.isArray(data.items)
            ? data.items.map((item) => ({
                  ...item,
                  image: extractImageFromJsonItem(item)
              }))
            : [];
        const posts = normalisePosts(items);
        const baseCandidate = data.home_page_url || data.site_url || data.feed_url || '';
        const baseUrl = deriveBaseFromUrl(baseCandidate || fallbackBase);
        return { posts, baseUrl };
    };

    const parseRssFeed = (text, fallbackBase) => {
        if (!text) {
            return { posts: [], baseUrl: fallbackBase };
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'application/xml');
        if (doc.querySelector('parsererror')) {
            return { posts: [], baseUrl: fallbackBase };
        }
        // Helper: namespace-agnostic child lookup by localName
        const firstChildByLocalName = (parent, names) => {
            const set = new Set(names);
            const els = parent.children || [];
            for (let i = 0; i < els.length; i++) {
                const el = els[i];
                if (set.has(el.localName)) return el;
            }
            return null;
        };

        const items = Array.from(doc.querySelectorAll('item, entry')).map((node) => {
            // Title (fallback via localName)
            let title = node.querySelector('title')?.textContent || '';
            if (!title) title = firstChildByLocalName(node, ['title'])?.textContent || '';

            // Link (prefer rel=alternate in Atom)
            let link = '';
            const linkAlternate = node.querySelector('link[rel="alternate"][href]');
            const anyLink = node.querySelector('link');
            link = linkAlternate?.getAttribute('href') || anyLink?.getAttribute('href') || anyLink?.textContent || '';
            if (!link) {
                const linkFallback = firstChildByLocalName(node, ['link']);
                link = linkFallback?.getAttribute?.('href') || linkFallback?.textContent || '';
            }

            // Description/summary (namespace-agnostic)
            let description = node.querySelector('description, summary, content')?.textContent || '';
            if (!description) description = firstChildByLocalName(node, ['description', 'summary', 'content'])?.textContent || '';

            // Published/updated
            let published = node.querySelector('pubDate, updated, published')?.textContent || '';
            if (!published) published = firstChildByLocalName(node, ['pubDate', 'updated', 'published'])?.textContent || '';

            const image = extractImageFromRssNode(node);
            return { title, url: link, description, published, image };
        });
        const posts = normalisePosts(items);
        const baseCandidate =
            doc.querySelector('channel > link')?.textContent ||
            doc.querySelector('feed > link[rel="alternate"]')?.getAttribute('href') ||
            doc.querySelector('link')?.textContent ||
            '';
        const baseUrl = deriveBaseFromUrl(baseCandidate || fallbackBase);
        return { posts, baseUrl };
    };

    const resolveUrl = (value, base) => {
        if (!value || typeof value !== 'string') return '';
        const trimmed = value.trim();
        if (!trimmed) return '';
        try {
            return new URL(trimmed).href;
        } catch (error) {
            // continue
        }
        let absoluteBase = '';
        if (base && typeof base === 'string') {
            try {
                absoluteBase = new URL(base, BLOG_ORIGIN).href;
            } catch (error) {
                absoluteBase = '';
            }
        }
        try {
            return new URL(trimmed, absoluteBase || BLOG_ORIGIN).href;
        } catch (error) {
            if (trimmed.startsWith('//')) {
                return `${window.location.protocol}${trimmed}`;
            }
            if (trimmed.startsWith('/')) {
                try {
                    return new URL(trimmed, BLOG_ORIGIN).href;
                } catch (nestedError) {
                    return trimmed;
                }
            }
            return trimmed;
        }
    };

    const parseDate = (value) => {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const formatDate = (value) => {
        const date = parseDate(value);
        if (!date) return '';
        try {
            return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(date);
        } catch (error) {
            return date.toLocaleDateString('de-DE');
        }
    };

    const truncate = (text, maxLength) => {
        if (!text) return '';
        const trimmed = text.trim();
        if (trimmed.length <= maxLength) return trimmed;
        return `${trimmed.slice(0, maxLength - 1).trim()}…`;
    };

    const buildCard = (post) => {
        const article = document.createElement('article');
        article.className = 'blog-preview-card';

        const link = document.createElement('a');
        link.href = post.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `${post.title} – vollständigen Artikel lesen`);

        const title = document.createElement('h3');
        title.textContent = post.title;

        const meta = document.createElement('p');
        meta.className = 'blog-preview-date';
        const formattedDate = formatDate(post.published);
        if (formattedDate) {
            meta.textContent = formattedDate;
        } else {
            meta.textContent = 'Aktualisiert';
        }

        if (post.image) {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'blog-preview-image';

            const image = document.createElement('img');
            image.src = post.image;
            image.alt = post.title;
            image.loading = 'lazy';
            image.decoding = 'async';

            imageWrapper.append(image);
            link.append(imageWrapper);
        }

        link.append(title, meta);
        article.append(link);
        return article;
    };

    const loadPosts = async () => {
        for (const source of SOURCES) {
            try {
                const response = await fetch(source.url, {
                    mode: 'cors',
                    headers: source.type === 'json' ? { Accept: 'application/feed+json, application/json' } : { Accept: 'application/rss+xml, application/xml, text/xml' }
                });

                if (!response.ok) {
                    continue;
                }

                const fallbackBase = deriveBaseFromUrl(response.url || source.url);
                let result = { posts: [], baseUrl: fallbackBase };
                if (source.type === 'json') {
                    const data = await response.json();
                    result = parseJsonFeed(data, fallbackBase);
                } else {
                    const text = await response.text();
                    result = parseRssFeed(text, fallbackBase);
                }

                if (result.posts.length) {
                    return result;
                }
            } catch (error) {
                console.warn('Blogvorschau konnte nicht geladen werden von', source.url, error);
            }
        }
        return { posts: [], baseUrl: BLOG_ORIGIN };
    };

    const getOgImageFromHtml = (html) => {
        if (!html) return '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const byProps = [
            'meta[property="og:image"]',
            'meta[name="og:image"]',
            'meta[name="twitter:image"]',
            'meta[property="twitter:image"]',
            'link[rel="image_src"]'
        ];
        for (const sel of byProps) {
            const node = doc.querySelector(sel);
            const content = node?.getAttribute('content') || node?.getAttribute('href') || '';
            if (content && content.trim()) return content.trim();
        }
        const img = doc.querySelector('article img[src], main img[src], img[src]');
        return img?.getAttribute('src')?.trim() || '';
    };

    const fetchOgImage = async (pageUrl) => {
        try {
            const res = await fetch(pageUrl, { mode: 'cors', headers: { Accept: 'text/html' } });
            if (!res.ok) return '';
            const html = await res.text();
            return getOgImageFromHtml(html) || '';
        } catch {
            return '';
        }
    };

    const renderPosts = async (posts, baseUrl) => {
        clearStatus();
        container.querySelectorAll('.blog-preview-card').forEach((card) => card.remove());
        if (!posts.length) {
            setStatus('Aktuell konnten keine Blogbeiträge geladen werden.');
            return;
        }

        const effectiveBase = baseUrl || BLOG_ORIGIN;
        let sorted = posts
            .map((post) => {
                const resolvedUrl = resolveUrl(post.url, effectiveBase);
                const resolvedImage = resolveUrl(post.image, resolvedUrl || effectiveBase);
                return {
                    ...post,
                    url: resolvedUrl,
                    image: resolvedImage,
                    published: parseDate(post.published)?.toISOString() || post.published
                };
            })
            .sort((a, b) => {
                const dateA = parseDate(a.published);
                const dateB = parseDate(b.published);
                if (dateA && dateB) {
                    return dateB.getTime() - dateA.getTime();
                }
                if (dateA) return -1;
                if (dateB) return 1;
                return 0;
            })
            .slice(0, 3);

        if (!sorted.length) {
            setStatus('Aktuell konnten keine Blogbeiträge geladen werden.');
            return;
        }

        // Try to enrich missing images using OG/Twitter tags from the post page
        const enriched = await Promise.all(
            sorted.map(async (post) => {
                if (post.image) return post;
                const og = await fetchOgImage(post.url);
                if (!og) return post;
                return { ...post, image: resolveUrl(og, post.url) };
            })
        );

        enriched.forEach((post) => {
            container.append(buildCard(post));
        });
    };

    loadPosts()
        .then(({ posts, baseUrl }) => renderPosts(posts, baseUrl))
        .catch(() => {
            setStatus('Aktuell konnten keine Blogbeiträge geladen werden.');
        });
})();
