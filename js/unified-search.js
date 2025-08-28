class UnifiedSearch {
    constructor() {
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


            'sirius': 'HD 48915',
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
            'north star': 'Alpha Ursae Minoris',


            'jupiter': 'Jupiter',
            'saturn': 'Saturn',
            'mars': 'Mars',
            'venus': 'Venus',
            'mercury': 'Mercury',
            'uranus': 'Uranus',
            'neptune': 'Neptune',
            'pluto': 'Pluto',
            'moon': 'Luna',
            'europa': 'Jupiter II',
            'titan': 'Saturn VI',
            'io': 'Jupiter I',
            'ganymede': 'Jupiter III',
            'callisto': 'Jupiter IV'
        };

        this.initializeSearchHandlers();
    }

    normalizeQuery(query) {
        if (!query || typeof query !== 'string') return query;

        const lowerQuery = query.toLowerCase().trim();


        if (this.synonymsDictionary[lowerQuery]) {
            console.log(`Synonym found: "${query}" -> "${this.synonymsDictionary[lowerQuery]}"`);
            return this.synonymsDictionary[lowerQuery];
        }


        for (const [synonym, canonical] of Object.entries(this.synonymsDictionary)) {
            if (lowerQuery.includes(synonym) && synonym.length > 3) {
                console.log(`Partial synonym found: "${query}" contains "${synonym}" -> "${canonical}"`);
                return canonical;
            }
        }

        return query;
    } initializeSearchHandlers() {

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSearch());
        } else {
            this.setupSearch();
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('universal-search');
        const searchButton = document.getElementById('search-button');
        const searchResults = document.getElementById('search-results');
        const sampleData = document.getElementById('sample-data');

        if (!searchInput || !searchButton) {
            console.log('Unified search elements not found, skipping initialization');
            return;
        }


        searchButton.addEventListener('click', () => this.performSearch());


        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });


        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('input', (e) => {
                if (searchInput.value !== e.target.value) {
                    searchInput.value = e.target.value;
                }
            });

            searchInput.addEventListener('input', (e) => {
                if (chatInput.value !== e.target.value) {
                    chatInput.value = e.target.value;
                }
            });
        }

        console.log('Unified search initialized successfully');
    }

    async performSearch() {
        const searchInput = document.getElementById('universal-search');
        const searchResults = document.getElementById('search-results');
        const sampleData = document.getElementById('sample-data');

        const originalQuery = searchInput?.value?.trim();

        if (!originalQuery) {
            this.showMessage('Please enter a search query', 'warning');
            return;
        }


        const normalizedQuery = this.normalizeQuery(originalQuery);


        if (normalizedQuery !== originalQuery) {
            searchInput.value = normalizedQuery;
            console.log(`Query normalized: "${originalQuery}" -> "${normalizedQuery}"`);
        }


        const chatInput = document.getElementById('chat-input');
        if (chatInput && chatInput.value !== normalizedQuery) {
            chatInput.value = normalizedQuery;
        }


        this.showMessage('Searching...', 'loading');

        try {

            const parsedInput = this.parseInput(normalizedQuery);


            this.triggerChatBotSearch(normalizedQuery);


            await this.navigateAladin(parsedInput, normalizedQuery);
            await this.retrieveData(parsedInput, normalizedQuery);


            if (sampleData) {
                sampleData.classList.remove('hidden');
            }

            this.showSearchResults(normalizedQuery, parsedInput);

        } catch (error) {
            console.error('Search error:', error);
            this.showMessage('Search failed. Please try again.', 'error');
        }
    }

    parseInput(input) {
        const trimmed = input.trim();


        const decimalMatch = trimmed.match(/^([+-]?\d+\.?\d*)\s+([+-]?\d+\.?\d*)$/);
        if (decimalMatch) {
            return {
                type: 'coordinates',
                ra: parseFloat(decimalMatch[1]),
                dec: parseFloat(decimalMatch[2]),
                original: input
            };
        }


        const hmsMatch = trimmed.match(/^(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)\s*([+-])(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)$/);
        if (hmsMatch) {
            const raHours = parseInt(hmsMatch[1]);
            const raMinutes = parseInt(hmsMatch[2]);
            const raSeconds = parseFloat(hmsMatch[3]);
            const decSign = hmsMatch[4] === '+' ? 1 : -1;
            const decDegrees = parseInt(hmsMatch[5]);
            const decMinutes = parseInt(hmsMatch[6]);
            const decSeconds = parseFloat(hmsMatch[7]);

            const ra = (raHours + raMinutes / 60 + raSeconds / 3600) * 15;
            const dec = decSign * (decDegrees + decMinutes / 60 + decSeconds / 3600);

            return {
                type: 'coordinates',
                ra: ra,
                dec: dec,
                original: input
            };
        }


        return {
            type: 'object',
            name: trimmed,
            original: input
        };
    }

    async navigateAladin(parsedInput, query) {
        if (!window.aladinInstance) {
            console.log('Aladin instance not available for navigation');
            return;
        }

        try {
            if (parsedInput.type === 'coordinates') {
                window.aladinInstance.gotoRaDec(parsedInput.ra, parsedInput.dec);
                console.log(`Navigated to coordinates: ${parsedInput.ra}, ${parsedInput.dec}`);
            } else {
                window.aladinInstance.gotoObject(parsedInput.name);
                console.log(`Navigated to object: ${parsedInput.name}`);
            }
        } catch (error) {
            console.error('Aladin navigation error:', error);
            throw new Error('Failed to navigate in sky atlas');
        }
    }

    async retrieveData(parsedInput, query) {


        console.log('Data retrieval for:', parsedInput);


        if (parsedInput.type === 'object') {
            console.log('Starting LLM summary polling for object:', parsedInput.name);
            this.startLLMSummaryPolling(parsedInput.name);
        }






    }

    triggerChatBotSearch(query) {
        console.log('Attempting to trigger chatbot search for:', query);


        let triggered = false;


        if (window.astroChatBot && typeof window.astroChatBot.performSearch === 'function') {
            console.log('Found window.astroChatBot, triggering search');
            window.astroChatBot.performSearch(query);
            triggered = true;
        }


        if (!triggered && window.chatBot && typeof window.chatBot.performSearch === 'function') {
            console.log('Found window.chatBot, triggering search');
            window.chatBot.performSearch(query);
            triggered = true;
        }


        if (!triggered && typeof window.initializeChatBot === 'function') {
            console.log('Chatbot not found, trying to initialize');
            window.initializeChatBot();

            setTimeout(() => {
                if (window.astroChatBot && typeof window.astroChatBot.performSearch === 'function') {
                    console.log('Chatbot initialized, triggering search');
                    window.astroChatBot.performSearch(query);
                    triggered = true;
                }
            }, 100);
        }


        if (!triggered) {
            console.log('Direct DOM manipulation fallback');
            const chatInput = document.getElementById('chat-input');
            const chatSend = document.getElementById('chat-send');

            if (chatInput && chatSend) {
                chatInput.value = query;
                chatSend.click();
                triggered = true;
                console.log('Triggered chatbot via DOM manipulation');
            }
        }

        if (!triggered) {
            console.log('Failed to trigger chatbot search - no methods worked');
        }
    }

    showSearchResults(query, parsedInput) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        const resultsHtml = `
      <div class="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
        <h4 class="font-semibold text-blue-800 mb-2">Search Results for: "${query}"</h4>
        <div class="text-sm text-gray-700">
          <p><strong>Input Type:</strong> ${parsedInput.type === 'coordinates' ? 'Coordinates' : 'Object Name'}</p>
          ${parsedInput.type === 'coordinates' ?
                `<p><strong>RA:</strong> ${parsedInput.ra.toFixed(6)}°, <strong>Dec:</strong> ${parsedInput.dec.toFixed(6)}°</p>` :
                `<p><strong>Object:</strong> ${parsedInput.name}</p>`
            }
        </div>
      </div>
    `;

        searchResults.innerHTML = resultsHtml;
    }

    showMessage(message, type = 'info') {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        const iconClass = {
            'loading': 'animate-spin',
            'error': 'text-red-500',
            'warning': 'text-yellow-500',
            'info': 'text-blue-500'
        }[type] || 'text-blue-500';

        const messageHtml = `
      <div class="text-center py-8 text-gray-500">
        <div class="mb-3">
          <svg class="w-8 h-8 mx-auto ${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-lg">${message}</p>
      </div>
    `;

        searchResults.innerHTML = messageHtml;
    }


    async checkLLMSummaryStatus(objectName, maxResults = 20) {
        try {
            const response = await fetch(`/search/llm-summary-status?object_name=${encodeURIComponent(objectName)}&max_results=${maxResults}`);
            const data = await response.json();

            if (data.status === 'success' && data.summary_status === 'completed') {

                this.updateArticlesWithSummary(data.articles);
                return true;
            } else if (data.summary_status === 'failed') {
                console.log('LLM summary generation failed');
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error checking LLM summary status:', error);
            return true;
        }
    }


    updateArticlesWithSummary(articles) {
        const articlesSection = document.querySelector('[data-section="articles"]');
        if (!articlesSection || !articles || articles.length === 0) return;


        let summaryContainer = articlesSection.querySelector('.llm-summary-container');
        if (!summaryContainer) {
            summaryContainer = document.createElement('div');
            summaryContainer.className = 'llm-summary-container mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500';
            articlesSection.insertBefore(summaryContainer, articlesSection.firstChild);
        }

        const summary = articles[0]?.general_summary;
        if (summary) {
            summaryContainer.innerHTML = `
        <h4 class="text-lg font-semibold text-blue-800 mb-2">
          AI Analysis
        </h4>
        <div class="text-gray-700 leading-relaxed">
          ${summary}
        </div>
      `;
        }
    }


    startLLMSummaryPolling(objectName, maxResults = 20) {
        let checkCount = 0;
        const maxChecks = 30;

        const checkInterval = setInterval(async () => {
            checkCount++;

            const shouldStop = await this.checkLLMSummaryStatus(objectName, maxResults);

            if (shouldStop || checkCount >= maxChecks) {
                clearInterval(checkInterval);
                console.log('Stopped checking LLM summary status');
            }
        }, 10000);
    }
}


let unifiedSearch = null;

function initializeUnifiedSearch() {
    if (!unifiedSearch) {
        unifiedSearch = new UnifiedSearch();
        window.unifiedSearch = unifiedSearch;
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUnifiedSearch);
} else {
    initializeUnifiedSearch();
}


window.initializeUnifiedSearch = initializeUnifiedSearch;


if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedSearch;
}
