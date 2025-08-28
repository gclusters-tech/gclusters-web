class AstroChatBot {
    constructor() {
        this.messagesContainer = null;
        this.inputElement = null;
        this.sendButton = null;
        this.isInitialized = false;

        this.apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:8000'
            : `${window.location.protocol}//${window.location.host}/api`;

        this.searchTimes = {
            simbad: 0,
            vizier: 0,
            ads: 0,
            arxiv: 0
        };

        this.t = this.createSmartTextProxy();

        this.synonymsDictionary = {
            'andromeda': 'M31',
            'andromeda galaxy': 'M31',
            'messier 31': 'M31',
            'ngc 224': 'M31',
            'whirlpool': 'M51',
            'whirlpool galaxy': 'M51',
            'messier 51': 'M51',
            'ngc 5194': 'M51',
            'triangulum': 'M33',
            'triangulum galaxy': 'M33',
            'messier 33': 'M33',
            'ngc 598': 'M33',
            'sombrero': 'M104',
            'sombrero galaxy': 'M104',
            'messier 104': 'M104',
            'ngc 4594': 'M104',

            'orion nebula': 'M42',
            'messier 42': 'M42',
            'ngc 1976': 'M42',
            'crab nebula': 'M1',
            'messier 1': 'M1',
            'ngc 1952': 'M1',
            'horsehead': 'Barnard 33',
            'horsehead nebula': 'Barnard 33',
            'eagle nebula': 'M16',
            'messier 16': 'M16',
            'ngc 6611': 'M16',

            'coma cluster': 'Abell 1656',
            'coma': 'Abell 1656',
            'virgo cluster': 'Abell 1367',
            'virgo': 'Abell 1367',
            'perseus cluster': 'Abell 426',
            'perseus': 'Abell 426',
            'centaurus cluster': 'Abell 3526',
            'centaurus': 'Abell 3526',

            'sirius': 'Alpha Canis Majoris',
            'vega': 'Alpha Lyrae',
            'altair': 'Alpha Aquilae',
            'rigel': 'Beta Orionis',
            'betelgeuse': 'Alpha Orionis',
            'aldebaran': 'Alpha Tauri',
            'spica': 'Alpha Virginis',
            'arcturus': 'Alpha Bootis',
            'capella': 'Alpha Aurigae',
            'procyon': 'Alpha Canis Minoris',
            'polaris': 'Alpha Ursae Minoris',
            'north star': 'Alpha Ursae Minoris'
        };
    }

    normalizeQuery(query) {
        if (!query || typeof query !== 'string') return query;

        const lowerQuery = query.toLowerCase().trim();

        if (this.synonymsDictionary[lowerQuery]) {
            console.log(`ChatBot synonym found: "${query}" -> "${this.synonymsDictionary[lowerQuery]}"`);
            return this.synonymsDictionary[lowerQuery];
        }

        for (const [synonym, canonical] of Object.entries(this.synonymsDictionary)) {
            if (lowerQuery.includes(synonym) && synonym.length > 3) {
                console.log(`ChatBot partial synonym found: "${query}" contains "${synonym}" -> "${canonical}"`);
                return canonical;
            }
        }

        return query;
    }

    createSmartTextProxy() {
        if (!window.getText) {
            console.warn('getText function not available, using fallback');
            return new Proxy({}, {
                get: (target, property) => property
            });
        }

        return new Proxy({}, {
            get: (target, property) => {
                return window.getText(property);
            }
        });
    }

    init() {
        console.log('AstroChatBot init() called');
        this.messagesContainer = document.getElementById('chat-messages');
        this.inputElement = document.getElementById('chat-input');
        this.sendButton = document.getElementById('chat-send');

        console.log('Chat elements found:', {
            messages: !!this.messagesContainer,
            input: !!this.inputElement,
            send: !!this.sendButton
        });

        if (!this.messagesContainer || !this.inputElement || !this.sendButton) {
            console.log('Chat elements not ready, retrying...');
            setTimeout(() => this.init(), 100);
            return;
        }

        if (this.isInitialized) {
            console.log('ChatBot already initialized');
            return;
        }

        this.setupEventListeners();
        this.isInitialized = true;
        console.log('AstroChatBot initialized successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        this.sendButton.addEventListener('click', () => {
            console.log('Send button clicked');
            this.handleSearch();
        });

        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed');
                this.handleSearch();
            }
        });
        console.log('Event listeners set up successfully');
    }

    performSearch(query) {
        if (!query || !query.trim()) {
            console.log('Empty query provided to performSearch');
            return;
        }

        const normalizedQuery = this.normalizeQuery(query.trim());


        if (this.inputElement) {
            this.inputElement.value = normalizedQuery;
            this.handleSearch();
        } else {
            console.log('Chat input element not available for performSearch');
        }
    }

    async handleSearch() {
        console.log('handleSearch() called');
        const originalQuery = this.inputElement.value.trim();
        console.log('Original query:', originalQuery);
        if (!originalQuery) {
            console.log('Empty query, returning');
            return;
        }

        const normalizedQuery = this.normalizeQuery(originalQuery);
        if (normalizedQuery !== originalQuery) {
            this.inputElement.value = normalizedQuery;
            console.log(`ChatBot query normalized: "${originalQuery}" -> "${normalizedQuery}"`);
        }

        const query = normalizedQuery;

        const universalSearchInput = document.getElementById('universal-search');
        if (universalSearchInput && universalSearchInput.value !== query) {
            universalSearchInput.value = query;
        }


        this.addMessage(query, 'user');
        this.inputElement.value = '';

        console.log('Starting search for:', query);


        let allResults = {
            simbad: null,
            vizier: [],
            ads: null,
            articles: []
        };

        this.searchTimes = { simbad: 0, vizier: 0, ads: 0, arxiv: 0 };

        try {

            this.addLoadingMessage(this.t.chatSearchingSimbad);
            const startTime1 = Date.now();

            try {
                const simbadResp = await fetch(`${this.apiBaseUrl}/search/simbad?object_name=${encodeURIComponent(query)}`);
                if (simbadResp.ok) {
                    const simbadData = await simbadResp.json();
                    allResults.simbad = simbadData.simbad;
                    this.searchTimes.simbad = ((Date.now() - startTime1) / 1000).toFixed(2);
                    this.updateLastLoadingMessage(`${this.t.chatSimbadCompleted}(${this.searchTimes.simbad}s)`);
                }
            } catch (e) {
                this.updateLastLoadingMessage(this.t.chatSimbadFailed);
            }


            this.addLoadingMessage(this.t.chatQueryingVizier);
            const startTime2 = Date.now();

            try {
                const vizierResp = await fetch(`${this.apiBaseUrl} /search/vizier ? object_name = ${encodeURIComponent(query)} `);
                if (vizierResp.ok) {
                    const vizierData = await vizierResp.json();
                    allResults.vizier = vizierData.vizier;
                    this.searchTimes.vizier = ((Date.now() - startTime2) / 1000).toFixed(2);
                    this.updateLastLoadingMessage(`${this.t.chatVizierCompleted}(${this.searchTimes.vizier}s)`);
                }
            } catch (e) {
                this.updateLastLoadingMessage(this.t.chatVizierFailed);
            }


            this.addLoadingMessage(this.t.chatSearchingAds);
            const startTime3 = Date.now();

            try {
                const adsResp = await fetch(`${this.apiBaseUrl} /search/ads ? object_name = ${encodeURIComponent(query)} `);
                if (adsResp.ok) {
                    const adsData = await adsResp.json();
                    allResults.ads = adsData.ads;
                    this.searchTimes.ads = ((Date.now() - startTime3) / 1000).toFixed(2);
                    this.updateLastLoadingMessage(`${this.t.chatAdsCompleted}(${this.searchTimes.ads}s)`);
                }
            } catch (e) {
                this.updateLastLoadingMessage(this.t.chatAdsFailed);
            }


            this.addLoadingMessage(this.t.chatSearchingArxiv);
            const startTime4 = Date.now();

            try {
                const arxivResp = await fetch(`${this.apiBaseUrl} /search/arxiv ? object_name = ${encodeURIComponent(query)} `);
                if (arxivResp.ok) {
                    const arxivData = await arxivResp.json();
                    allResults.articles = arxivData.articles;
                    this.searchTimes.arxiv = ((Date.now() - startTime4) / 1000).toFixed(2);
                    this.updateLastLoadingMessage(`${this.t.chatArxivCompleted}(${this.searchTimes.arxiv}s)`);
                }
            } catch (e) {
                this.updateLastLoadingMessage(this.t.chatArxivFailed);
            }


            setTimeout(() => {
                this.displayResults(allResults, query);
            }, 500);

        } catch (error) {
            this.addMessage(`${this.t.chatSearchError} ${error.message}`, 'bot');
        }
    }

    addMessage(text, sender, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender} `;

        if (sender === 'user') {
            messageDiv.className += ' bg-blue-600 text-white rounded-lg p-3 max-w-[90%] ml-auto shadow-sm';
        } else {
            messageDiv.className += ' bg-white border border-gray-200 rounded-lg p-3 max-w-[90%] shadow-sm';
        }

        if (isHtml) {
            messageDiv.innerHTML = text;
        } else {
            messageDiv.textContent = text;
        }

        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;


        if (isHtml && window.MathJax) {
            setTimeout(() => {
                MathJax.typesetPromise([messageDiv]).catch((err) => console.log(err.message));
            }, 100);
        }
    }

    addLoadingMessage(text) {
        const loadingHtml = `
            <div class="flex items-center gap-2 text-sm text-gray-600">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
        <span>${text}</span>
      </div>
            `;
        this.addMessage(loadingHtml, 'bot', true);
    }

    updateLastLoadingMessage(newText) {
        const messages = this.messagesContainer.querySelectorAll('.message.bot');
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.innerHTML.includes('animate-spin')) {
                lastMessage.innerHTML = `<span class="text-sm text-gray-600">${newText}</span>`;
            }
        }
    }

    displayResults(data, query) {
        let html = '';


        const totalTime = (
            parseFloat(this.searchTimes.simbad) +
            parseFloat(this.searchTimes.vizier) +
            parseFloat(this.searchTimes.ads) +
            parseFloat(this.searchTimes.arxiv)
        ).toFixed(2);

        html += `
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 mb-4">
        <h4 class="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
          ${this.t.chatSearchPerformance}
        </h4>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div><strong>SIMBAD:</strong> ${this.searchTimes.simbad}s</div>
          <div><strong>VizieR:</strong> ${this.searchTimes.vizier}s</div>
          <div><strong>ADS:</strong> ${this.searchTimes.ads}s</div>
          <div><strong>arXiv:</strong> ${this.searchTimes.arxiv}s</div>
        </div>
        <div class="mt-2 font-semibold text-emerald-700">${this.t.chatTotal} ${totalTime}s</div>
      </div>
            `;

        if (data.simbad && data.simbad.length) {
            html += `
            <div class="mb-4">
          <h4 class="font-semibold text-purple-700 mb-2 flex items-center gap-2">
            ${this.t.chatSimbadData}
            <span class="text-xs text-gray-500">(${this.searchTimes.simbad}s)</span>
          </h4>
          <div class="overflow-x-auto">
            <table class="w-full bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
              <thead class="bg-yellow-100">
                <tr>
                  <th class="px-3 py-2 border-b text-left font-semibold">${this.t.chatObject}</th>
                  <th class="px-3 py-2 border-b text-left font-semibold">${this.t.chatRADeg}</th>
                  <th class="px-3 py-2 border-b text-left font-semibold">${this.t.chatDecDeg}</th>
                  <th class="px-3 py-2 border-b text-left font-semibold">${this.t.chatType}</th>
                  <th class="px-3 py-2 border-b text-left font-semibold">${this.t.chatPrecision}</th>
                  <th class="px-3 py-2 border-b text-left font-semibold">${this.t.chatDistance}</th>
                  <th class="px-3 py-2 border-b text-left font-semibold">${this.t.chatMagnitude}</th>
                </tr>
              </thead>
              <tbody>
      `;
            data.simbad.forEach(obj => {
                html += `
          <tr class="hover:bg-yellow-50">
            <td class="px-3 py-2 border-b font-mono font-semibold">${obj.name || this.t.chatNA}</td>
            <td class="px-3 py-2 border-b font-mono">${obj.ra ? obj.ra.toFixed(6) : this.t.chatNA}</td>
            <td class="px-3 py-2 border-b font-mono">${obj.dec ? obj.dec.toFixed(6) : this.t.chatNA}</td>
            <td class="px-3 py-2 border-b">
              <span class="bg-gray-200 px-2 py-1 rounded text-xs">${obj.otype || this.t.chatNA}</span>
            </td>
            <td class="px-3 py-2 border-b">${obj.ra_prec || this.t.chatNA}</td>
            <td class="px-3 py-2 border-b font-mono">${obj.distance ? (typeof obj.distance === 'number' ? obj.distance.toFixed(2) : obj.distance) : this.t.chatNA}</td>
            <td class="px-3 py-2 border-b font-mono">${obj.magnitude ? (typeof obj.magnitude === 'number' ? obj.magnitude.toFixed(2) : obj.magnitude) : this.t.chatNA}</td>
          </tr>
        `;
            });
            html += '</tbody></table></div></div>';
        }

        if (data.vizier && data.vizier.length) {
            html += `
        <div class="mb-4">
          <h4 class="font-semibold text-green-700 mb-2 flex items-center gap-2">
            ${this.t.chatVizierCatalogs}
            <span class="text-xs text-gray-500">(${this.searchTimes.vizier}s)</span>
          </h4>
      `;
            data.vizier.forEach((catalog, idx) => {
                html += `
          <details class="border border-gray-200 rounded-lg mb-2">
            <summary class="cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 font-medium">
              ${catalog.name || `${this.t.chatCatalog} ${idx + 1}`} 
              (${catalog.rows ? catalog.rows.length : 0} ${this.t.chatEntries})
            </summary>
            <div class="p-3 max-h-64 overflow-auto">
        `;
                if (catalog.rows && catalog.rows.length) {
                    const columns = Object.keys(catalog.rows[0]);
                    html += `
            <table class="w-full text-xs border border-gray-200 rounded">
              <thead class="bg-green-100">
                <tr>
          `;
                    columns.forEach(col => {
                        html += `<th class="px-2 py-1 border-b text-left font-semibold">${col}</th>`;
                    });
                    html += '</tr></thead><tbody>';
                    catalog.rows.forEach(row => {
                        html += '<tr class="hover:bg-gray-50">';
                        columns.forEach(col => {
                            let val = row[col];
                            if (typeof val === 'number' && !isNaN(val)) {
                                val = val.toFixed(4);
                            }
                            html += `<td class="px-2 py-1 border-b font-mono" title="${val}">${val || ''}</td>`;
                        });
                        html += '</tr>';
                    });
                    html += '</tbody></table>';
                } else {
                    html += `<div class="text-gray-500 text-center py-4">${this.t.chatNoDataAvailable}</div>`;
                }
                html += '</div></details>';
            });
            html += '</div>';
        }


        if (data.ads && data.ads.length) {
            html += `
        <div class="mb-4">
          <h4 class="font-semibold text-red-700 mb-2 flex items-center gap-2">
            ${this.t.chatAdsPublications}
            <span class="text-xs text-gray-500">(${this.searchTimes.ads}s)</span>
          </h4>
      `;

            data.ads.forEach((publication, idx) => {
                html += `
          <div class="border-l-4 border-red-500 bg-red-50 p-3 mb-3 rounded-r-lg">
            <div class="font-semibold text-sm mb-1">
              ${idx + 1}. <a href="${publication.url || publication.link || '#'}" target="_blank" class="text-red-700 hover:text-red-900 underline">
                ${publication.title || this.t.chatUnknownTitle}
              </a>
            </div>
            <div class="text-xs text-gray-600 mb-2">
              <strong>${this.t.chatDate}</strong> ${publication.pubdate || publication.date || this.t.chatNA} | 
              <strong>${this.t.chatAuthors}</strong> ${publication.author || publication.authors || this.t.chatNA}
            </div>
            ${publication.abstract ? `
              <div class="text-xs text-gray-700 bg-white p-2 border border-gray-200 rounded">
                <strong>${this.t.chatAbstract}</strong> ${publication.abstract.substring(0, 500)}${publication.abstract.length > 500 ? '...' : ''}
              </div>
            ` : ''}
            ${publication.citation_count ? `
              <div class="text-xs text-gray-500 mt-1">
                <strong>${this.t.chatCitations}</strong> ${publication.citation_count}
              </div>
            ` : ''}
          </div>
        `;
            });

            html += '</div>';
        }


        if (data.articles && data.articles.length) {
            html += `
        <div class="mb-4">
          <h4 class="font-semibold text-orange-700 mb-2 flex items-center gap-2">
            ${this.t.chatScientificArticles}
            <span class="text-xs text-gray-500">(${this.searchTimes.arxiv}s)</span>
          </h4>
      `;
            data.articles.forEach((article, idx) => {
                html += `
          <div class="border-l-4 border-orange-500 bg-orange-50 p-3 mb-3 rounded-r-lg">
            <div class="font-semibold text-sm mb-1">
              ${idx + 1}. <a href="${article.link}" target="_blank" class="text-orange-700 hover:text-orange-900 underline">
                ${article.title}
              </a>
            </div>
            <div class="text-xs text-gray-600 mb-2">
              <strong>${this.t.chatDate}</strong> ${article.published.slice(0, 10)} | 
              <strong>${this.t.chatAuthors}</strong> ${article.authors}
            </div>
        `;
                if (article.llm_summary) {
                    html += `
            <div class="bg-blue-50 border-l-4 border-blue-400 p-2 mb-2 text-xs">
              <strong>${this.t.chatAiSummary}</strong> ${article.llm_summary}
            </div>
          `;
                }
                const abstractText = article.summary.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                html += `
            <div class="text-xs text-gray-700 bg-white p-2 border border-gray-200 rounded">
              <strong>${this.t.chatAbstract}</strong> ${abstractText.substring(0, 600)}${abstractText.length > 600 ? '...' : ''}
            </div>
          </div>
        `;
            });
            html += '</div>';
        }

        if (!data.simbad?.length && !data.vizier?.length && !data.ads?.length && !data.articles?.length) {
            html += `
        <div class="text-center py-8 text-gray-500">
          <div class="mb-3">
            <svg class="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <p class="font-medium">${this.t.chatNoDataFound} "${query}"</p>
          <p class="text-sm">${this.t.chatTryAnother}</p>
        </div>
      `;
        }
        this.addMessage(html, 'bot', true);
    }
}

let astroChatBot = null;

function initializeChatBot() {
    console.log('initializeChatBot() called');
    if (!astroChatBot) {
        console.log('Creating new AstroChatBot instance');
        astroChatBot = new AstroChatBot();
        window.astroChatBot = astroChatBot;
    }
    astroChatBot.init();
}


window.initializeChatBot = initializeChatBot;
window.astroChatBot = astroChatBot;
