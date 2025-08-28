class SPANavigator {
    constructor() {
        this.currentPage = 'home';
        this.cache = new Map();
        this.isLoading = false;
        this.init();
    }

    createSmartTextProxy(lang) {
        if (!window.getText) {
            console.warn('getText function not available, fallback proxy');
            return new Proxy({}, {
                get: (target, property) => property
            });
        }

        return new Proxy({}, {
            get: function (target, property) {
                if (typeof property === 'string') {
                    return window.getText(property, lang);
                }
                return target[property];
            }
        });
    }

    init() {
        if (window.location.pathname.match(/^(\/[a-zA-Z0-9\-]+)\.html$/)) {
            const cleanPath = window.location.pathname.replace(/\.html$/, '');
            history.replaceState({}, '', cleanPath);
        }

        this.currentPage = this.getPageFromUrl();

        console.log('SPA Init: Current page:', this.currentPage);


        if (this.currentPage !== 'home') {
            this.replaceBadContentWithSPA();
        }


        this.loadPageContent(this.currentPage, false);
        this.watchLanguageChanges();
        this.setupNavigationHandlers();


        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPageContent(e.state.page, false);
            }
        });
    }

    getPageFromUrl() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html' || path === '') return 'home';
        let page = path.replace(/^\//, '').replace(/\.html$/, '');


        const validPages = ['method', 'aladin-bot', 'articles', 'projects', 'contact'];
        if (validPages.includes(page)) {
            return page;
        }

        return '404';
    }

    setupNavigationHandlers() {

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#')) return;


            e.preventDefault();

            const page = href.replace('/', '').replace('.html', '') || 'home';
            this.navigateToPage(page);
        });


        document.addEventListener('click', (e) => {
            if (e.target.closest('#back-btn')) {
                e.preventDefault();
                this.navigateToPage('home');
            }
        });
    }

    async navigateToPage(page = 'home') {
        if (this.isLoading || page === this.currentPage) return;

        this.isLoading = true;


        this.showLoadingState();

        try {
            await this.loadPageContent(page);
            this.currentPage = page;


            const url = page === 'home' ? '/' : `/${page}`;
            history.pushState({ page }, '', url);

        } catch (error) {
            console.error('Error loading page:', error);
            const currentLang = localStorage.getItem('lang') || 'en';
            const t = this.createSmartTextProxy(currentLang);
            this.showError(t.spaPageLoadingError);
        } finally {
            this.isLoading = false;
        }
    }

    async loadPageContent(page, updateHistory = true) {
        try {
            let content;


            const currentLang = localStorage.getItem('lang') || 'en';
            const cacheKey = `${page}_${currentLang}`;

            if (this.cache.has(cacheKey)) {
                content = this.cache.get(cacheKey);
            } else {

                if (page === 'home') {
                    content = await this.getHomeContent();
                } else {
                    content = await this.fetchPageContent(page);
                }
                this.cache.set(cacheKey, content);
            }


            await this.updatePageContent(content, page);

        } catch (error) {
            console.error('Error loading page content:', error);
            throw error;
        }
    }


    clearCache() {
        this.cache.clear();


    }

    async fetchPageContent(page) {
        const currentLang = localStorage.getItem('lang') || 'en';


        if (window.generatePageContent) {
            const dynamicContent = window.generatePageContent(page, currentLang);
            if (dynamicContent) {
                return {
                    main: dynamicContent.content,
                    title: dynamicContent.title,
                    page: page
                };
            }
        }


        if (window.PAGE_CONTENT && window.PAGE_CONTENT[page]) {
            const pageData = window.PAGE_CONTENT[page][currentLang];

            return {
                main: pageData.content,
                title: pageData.title,
                page: page
            };
        }


        // Fallback content when no specific content found
        console.warn(`No content found for page: ${page}, using fallback`);

        const t = this.createSmartTextProxy(currentLang);

        return {
            main: `
        <div class="text-center">
          <h2 class="text-2xl font-semibold mb-4">${page.charAt(0).toUpperCase() + page.slice(1)}</h2>
          <p class="text-gray-600">${t.spaPageLoading}</p>
          <a href="/" class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            ${t.spaReturnHome}
          </a>
        </div>
      `,
            title: `${t.siteTitle} | ${page.charAt(0).toUpperCase() + page.slice(1)}`,
            page: page
        };
    }

    getHomeContent() {
        const currentLang = localStorage.getItem('lang') || 'en';


        if (window.generatePageContent) {
            const dynamicContent = window.generatePageContent('home', currentLang);
            if (dynamicContent) {
                return {
                    main: dynamicContent.content,
                    title: dynamicContent.title,
                    page: 'home'
                };
            }
        }


        if (window.PAGE_CONTENT && window.PAGE_CONTENT.home && window.PAGE_CONTENT.home[currentLang]) {
            const pageData = window.PAGE_CONTENT.home[currentLang];

            return {
                main: pageData.content,
                title: pageData.title,
                page: 'home'
            };
        }


        // Fallback content for home page using smart proxy
        const t = this.createSmartTextProxy(currentLang);

        return {
            main: `
        <section class="max-w-2xl text-center">
          <h2 class="text-3xl font-semibold mb-4">${t.homeMainQuestion}</h2>
          <p class="mb-8 text-gray-700">
            ${t.homeMainDescription}
          </p>
          <div class="text-center">
            <p class="text-gray-500">${t.spaLoadingNavigation}</p>
          </div>
        </section>
      `,
            title: t.homePageTitle,
            page: 'home'
        };
    }

    async updatePageContent(content, page) {
        const main = document.querySelector('main');
        if (!main) return;


        if (typeof window.saveAladinState === 'function') {
            window.saveAladinState();
        }


        if (window.aladinInstance) {
            try {

                if (window.aladinInstance.view && typeof window.aladinInstance.view.destroy === 'function') {
                    window.aladinInstance.view.destroy();
                }
            } catch (error) {
                console.log('Error destroying Aladin instance:', error);
            }
            window.aladinInstance = null;
        }


        main.style.transition = 'opacity 0.2s ease-in-out';
        main.style.opacity = '0';

        await new Promise(resolve => setTimeout(resolve, 200));


        main.innerHTML = content.main;


        this.executeScripts(main);


        document.title = content.title;


        this.updateBackButton(page);


        if (window.updateContentByDataAttributes) {
            const currentLang = localStorage.getItem('lang') || 'en';
            window.updateContentByDataAttributes(currentLang);


            console.log('SPA: Page content updated for page:', page, 'lang:', currentLang);


            if (page !== 'home' && window.PAGE_CONTENT && window.PAGE_CONTENT[page] && window.PAGE_CONTENT[page][currentLang]) {
                document.title = window.PAGE_CONTENT[page][currentLang].title;
            }
        }


        if (page === 'aladin-bot') {
            setTimeout(() => {

                if (typeof window.initializeAladinWithState === 'function') {
                    window.initializeAladinWithState();
                }


                setTimeout(() => {
                    if (typeof window.initializeUnifiedSearch === 'function') {
                        window.initializeUnifiedSearch();
                        console.log('UnifiedSearch initialized via SPA navigator');
                    }
                }, 100);


                setTimeout(() => {
                    if (typeof window.initializeChatBot === 'function') {
                        window.initializeChatBot();
                        console.log('ChatBot initialized via SPA navigator');
                    } else if (window.astroChatBot) {
                        window.astroChatBot.init();
                        console.log('ChatBot re-initialized via SPA navigator');
                    }
                }, 200);
            }, 100);
        }


        if (page === 'articles') {
            setTimeout(() => {

                if (window.ADSSearch) {
                    console.log('Initializing ADSSearch from SPA navigator');

                    const currentLang = localStorage.getItem('lang') || 'en';


                    window.ADSSearch.init();


                    window.ADSSearch.attachToUI({
                        input: '#universal-search',
                        button: '#search-button',
                        results: '#search-results',
                        radius: '#search-radius'
                    }, {
                        lang: currentLang
                    });
                }
            }, 200);
        }


        await new Promise(resolve => setTimeout(resolve, 50));
        main.style.opacity = '1';
    }

    executeScripts(container) {

        const scripts = container.querySelectorAll('script');

        scripts.forEach(script => {
            const newScript = document.createElement('script');


            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });


            if (script.src) {
                newScript.src = script.src;

                newScript.onload = () => {
                    console.log('External script loaded:', script.src);

                    if (script.src.includes('aladin')) {
                        setTimeout(() => {

                        }, 100);
                    }
                };
            } else {

                newScript.textContent = script.textContent;
            }


            script.parentNode.replaceChild(newScript, script);
        });
    }

    updateBackButton(page) {
        const backBtn = document.getElementById('back-btn');
        const headerTitle = document.getElementById('header-title');
        const main = document.querySelector('main');

        if (backBtn) {
            if (page === 'home') {

                backBtn.style.opacity = '0';
                backBtn.style.visibility = 'hidden';
                setTimeout(() => {
                    backBtn.style.display = 'none';
                }, 300);


                if (headerTitle) {
                    headerTitle.style.cursor = 'default';
                    headerTitle.style.color = '#1f2937';
                    headerTitle.onclick = null;

                    headerTitle.onmouseover = null;
                    headerTitle.onmouseout = null;
                }

                if (main) {
                    main.className = 'flex-1 flex flex-col items-center justify-center px-4';
                }
            } else {

                backBtn.style.display = 'flex';
                setTimeout(() => {
                    backBtn.style.opacity = '1';
                    backBtn.style.visibility = 'visible';
                }, 50);


                if (headerTitle) {
                    headerTitle.style.cursor = 'pointer';
                    headerTitle.style.color = '#1f2937';
                    headerTitle.onclick = (e) => {
                        e.preventDefault();
                        this.navigateToPage('home');
                    };

                    headerTitle.onmouseover = () => {
                        headerTitle.style.color = '#2563eb';
                    };
                    headerTitle.onmouseout = () => {
                        headerTitle.style.color = '#1f2937';
                    };
                }

                if (main) {
                    main.className = 'flex-1 flex flex-col items-center px-4 pt-8';
                }
            }
        }
    }

    watchLanguageChanges() {

        this.currentLang = localStorage.getItem('lang') || 'en';


        setInterval(() => {
            const newLang = localStorage.getItem('lang') || 'en';
            if (newLang !== this.currentLang) {
                this.currentLang = newLang;
                this.clearCache();


                this.loadPageContent(this.currentPage, false);
            }
        }, 200);
    }

    showLoadingState() {
        const main = document.querySelector('main');
        if (main) {
            main.style.opacity = '0.7';
        }
    }

    showError(message) {
        const currentLang = localStorage.getItem('lang') || 'en';
        const t = this.createSmartTextProxy(currentLang);
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
        <div class="text-center">
          <h2 class="text-2xl font-semibold mb-4 text-red-600">${t.spaErrorTitle}</h2>
          <p class="text-gray-600">${message}</p>
          <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            ${t.spaReloadPage}
          </button>
        </div>
      `;
            main.style.opacity = '1';
        }
    }

    replaceBadContentWithSPA() {
        const currentLang = localStorage.getItem('lang') || 'en';
        const t = this.createSmartTextProxy(currentLang);

        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
        <div class="flex items-center justify-center h-64">
          <div class="text-gray-500">${t.spaLoadingGeneric}</div>
        </div>
      `;
        }


        const expectedUrl = this.currentPage === 'home' ? '/' : `/${this.currentPage}`;
        if (window.location.pathname !== expectedUrl) {
            history.replaceState({ page: this.currentPage }, '', expectedUrl);
        }
    }
}


window.saveAladinState = function () {
    if (window.aladinInstance) {
        try {
            const state = {
                ra: window.aladinInstance.getRaDec()[0],
                dec: window.aladinInstance.getRaDec()[1],
                fov: window.aladinInstance.getFov()[0],
                survey: window.aladinInstance.getBaseImageLayer().id || 'P/DSS2/color',
                projection: window.aladinInstance.getProjectionName(),
                cooFrame: window.aladinInstance.getFrame(),
                timestamp: Date.now()
            };


            localStorage.setItem('aladinState', JSON.stringify(state));
            console.log('Aladin state saved:', state);
        } catch (error) {
            console.log('Error saving Aladin state:', error);
        }
    }
};

window.restoreAladinState = function () {
    try {
        const savedState = localStorage.getItem('aladinState');
        if (savedState) {
            const state = JSON.parse(savedState);


            const maxAge = 60 * 60 * 1000;
            if (Date.now() - state.timestamp > maxAge) {
                localStorage.removeItem('aladinState');
                return null;
            }

            console.log('Restoring Aladin state:', state);
            return state;
        }
    } catch (error) {
        console.log('Error restoring Aladin state:', error);
        localStorage.removeItem('aladinState');
    }
    return null;
};

window.applyAladinState = function (state) {
    if (window.aladinInstance && state) {
        try {

            window.aladinInstance.gotoRaDec(state.ra, state.dec);
            window.aladinInstance.setFov(state.fov);


            if (state.survey && state.survey !== 'P/DSS2/color') {
                window.aladinInstance.setImageSurvey(state.survey);
            }


            if (state.projection) {
                window.aladinInstance.setProjection(state.projection);
            }


            if (state.cooFrame) {
                window.aladinInstance.setFrame(state.cooFrame);
            }

            console.log('Aladin state applied successfully');
        } catch (error) {
            console.log('Error applying Aladin state:', error);
        }
    }
};


window.initializeAladinWithState = function () {
    const savedState = window.restoreAladinState();

    if (savedState) {

        window.smartInitializeAladin(true, {
            target: `${savedState.ra} ${savedState.dec}`,
            fov: savedState.fov,
            survey: savedState.survey || 'P/DSS2/color',
            projection: savedState.projection || 'SIN',
            cooFrame: savedState.cooFrame || 'equatorial'
        });
    } else {

        window.smartInitializeAladin(true);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    window.spaNavigator = new SPANavigator();
});


window.addEventListener('beforeunload', () => {
    if (typeof window.saveAladinState === 'function') {
        window.saveAladinState();
    }
});
