const createSmartTextProxy = (lang = 'en') => {
  if (!window.getText) {
    console.warn('getText function not available, using fallback');
    return new Proxy({}, {
      get: function(target, property) {
        return property;
      }
    });
  }
  
  return new Proxy({}, {
    get: function(target, property) {
      if (typeof property === 'string') {
        return window.getText(property, lang);
      }
      return target[property];
    }
  });
};

class ADSSearch {
    constructor() {
        this.apiUrl = 'https://api.adsabs.harvard.edu/v1/search/query';
        this.proxyUrl = '/ads-proxy';
        this.searchHistory = [];
        this.currentResults = [];
        this.lastSearchParams = null;
        this.sortOrder = localStorage.getItem('ads_sort_order') || 'citation_count desc';
        this.loadSearchHistory();
    }

    async searchArticles(params = {}) {
        try {
            const {
                query = '',
                author = '',
                year = '',
                object = '',
                rows = 20,
                start = 0
            } = params;

            this.lastSearchParams = { query, author, year, object, rows, start };

            const adsQuery = this.buildADSQuery({
                query,
                author,
                year,
                object
            });

            const queryParams = new URLSearchParams({
                q: adsQuery,
                fl: 'bibcode,title,author,year,abstract,doi,citation_count,read_count,pubdate,pub',
                rows: rows.toString(),
                start: start.toString(),
                sort: this.sortOrder
            });


            const response = await this.makeAPIRequest(queryParams);

            if (response.ok) {
                const data = await response.json();


                if (data.error) {
                    throw new Error(`ADS API Error: ${data.message || data.error}`);
                }

                this.currentResults = data.response?.docs || [];
                let numFound = data.response?.numFound || 0;



                if (numFound === 27148879 || !numFound || numFound > 1000000) {
                    numFound = this.currentResults.length;
                }


                this.addToHistory({
                    query: adsQuery,
                    timestamp: new Date().toISOString(),
                    resultsCount: numFound
                });

                return {
                    success: true,
                    articles: this.currentResults,
                    totalCount: numFound,
                    start: start,
                    rows: rows
                };
            } else {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('ADS Search Error:', error);
            return {
                success: false,
                error: error.message,
                articles: [],
                totalCount: 0
            };
        }
    }


    async searchByCoordinatesAndType(ra, dec, radius = 0.1, objectType = '', rows = 20) {
        try {

            let coordQuery = `pos(${ra},${dec},${radius})`;

            if (objectType) {
                coordQuery += ` AND object:"${objectType}"`;
            }

            return await this.searchArticles({
                query: coordQuery,
                rows: rows
            });
        } catch (error) {
            console.error('Coordinate search error:', error);
            return {
                success: false,
                error: error.message,
                articles: []
            };
        }
    }


    buildADSQuery({ query, author, year, object }) {
        const parts = [];

        if (query) {
            parts.push(`"${query}"`);
        }

        if (author) {
            parts.push(`author:"${author}"`);
        }

        if (year) {
            if (year.includes('-')) {
                const [startYear, endYear] = year.split('-');
                parts.push(`year:[${startYear} TO ${endYear}]`);
            } else {
                parts.push(`year:${year}`);
            }
        }

        if (object) {
            parts.push(`object:"${object}"`);
        }


        if (parts.length === 0) {
            parts.push('*:*');
        }

        const finalQuery = parts.join(' AND ');
        return finalQuery;
    }


    async makeAPIRequest(queryParams) {
        const url = `${this.apiUrl}?${queryParams.toString()}`;
        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: url,
                    method: 'GET'
                })
            });

            if (!response.ok) {
                throw new Error(`Proxy responded with ${response.status}: ${response.statusText}`);
            }

            return response;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }


    formatResults(articles) {
        const t = createSmartTextProxy();
        
        return articles.map(article => ({
            bibcode: article.bibcode,
            title: article.title ? article.title[0] : t.adsNoTitle,
            authors: article.author ? article.author.slice(0, 3) : [t.adsUnknown],
            year: article.year,
            abstract: article.abstract ? (Array.isArray(article.abstract) ? article.abstract[0] : article.abstract) : null,
            doi: article.doi ? article.doi[0] : null,
            citations: article.citation_count || 0,
            reads: article.read_count || 0,
            journal: article.pub,
            adsUrl: `https://ui.adsabs.harvard.edu/abs/${article.bibcode}/abstract`
        }));
    }


    async getArticleDetails(bibcode) {
        try {
            const queryParams = new URLSearchParams({
                q: `bibcode:${bibcode}`,
                fl: 'bibcode,title,author,year,abstract,doi,citation_count,read_count,pubdate,pub,keyword,aff'
            });

            const response = await this.makeAPIRequest(queryParams);

            if (response.ok) {
                const data = await response.json();
                const article = data.response.docs[0];

                return {
                    success: true,
                    article: this.formatResults([article])[0]
                };
            } else {
                throw new Error(`Failed to fetch article details: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching article details:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }


    addToHistory(searchItem) {

        searchItem.sortOrder = this.sortOrder;

        this.searchHistory.unshift(searchItem);


        if (this.searchHistory.length > 50) {
            this.searchHistory = this.searchHistory.slice(0, 50);
        }

        this.saveSearchHistory();
    }


    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('ads_search_history');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading search history:', error);
            this.searchHistory = [];
        }
    }


    saveSearchHistory() {
        try {
            localStorage.setItem('ads_search_history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    }


    clearHistory() {
        this.searchHistory = [];
        localStorage.removeItem('ads_search_history');
    }


    exportResults(format = 'json') {
        const results = this.formatResults(this.currentResults);

        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(results, null, 2);

            case 'csv':
                if (results.length === 0) return '';

                const headers = Object.keys(results[0]);
                const csvContent = [
                    headers.join(','),
                    ...results.map(row =>
                        headers.map(header => {
                            const value = row[header];
                            if (Array.isArray(value)) {
                                return `"${value.join('; ')}"`;
                            }
                            return `"${value || ''}"`;
                        }).join(',')
                    )
                ].join('\n');

                return csvContent;

            case 'bibtex':
                return results.map(article =>
                    this.generateBibTeX(article)
                ).join('\n\n');

            default:
                return JSON.stringify(results, null, 2);
        }
    }


    generateBibTeX(article) {
        const t = createSmartTextProxy();
        const authorList = article.authors.join(' and ');
        const cleanTitle = article.title.replace(/[{}]/g, '');

        return `@article{${article.bibcode},
  title={${cleanTitle}},
  author={${authorList}},
  year={${article.year}},
  journal={${article.journal || t.adsUnknown}},
  doi={${article.doi || ''}},
  adsurl={${article.adsUrl}}
}`;
    }


    getSearchStats() {
        if (this.currentResults.length === 0) {
            return null;
        }

        const years = this.currentResults
            .map(article => article.year)
            .filter(year => year);

        const journals = this.currentResults
            .map(article => article.pub)
            .filter(pub => pub);

        const totalCitations = this.currentResults
            .reduce((sum, article) => sum + (article.citation_count || 0), 0);

        return {
            totalArticles: this.currentResults.length,
            yearRange: {
                min: Math.min(...years),
                max: Math.max(...years)
            },
            topJournals: this.getTopItems(journals, 5),
            totalCitations: totalCitations,
            avgCitations: Math.round(totalCitations / this.currentResults.length)
        };
    }


    getTopItems(items, count = 5) {
        const frequency = {};
        items.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
        });

        return Object.entries(frequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, count)
            .map(([item, freq]) => ({ name: item, count: freq }));
    }


    init() {
        this.loadSearchHistory();
    }


    attachToUI(selectors = {}, options = {}) {
        const {
            input = '#ads-query',
            button = '#ads-search-button',
            results = '#ads-results',
            loading = '#ads-loading',
            coordinateButton = '#ads-coordinate-search',
            exampleButton = '#ads-example-search'
        } = selectors;


        const queryInput = document.querySelector('#ads-query');
        const authorInput = document.querySelector('#ads-author');
        const yearInput = document.querySelector('#ads-year');
        const objectInput = document.querySelector('#ads-object');
        const rowsSelect = document.querySelector('#ads-rows');
        const raInput = document.querySelector('#ads-ra');
        const decInput = document.querySelector('#ads-dec');
        const radiusInput = document.querySelector('#ads-radius');

        const searchButton = document.querySelector(button);
        const coordinateSearchButton = document.querySelector(coordinateButton);
        const exampleSearchButton = document.querySelector(exampleButton);
        const resultsContainer = document.querySelector(results);
        const loadingDiv = document.querySelector(loading);


        const universalInput = document.querySelector('#universal-search');
        const universalButton = document.querySelector('#search-button');
        const universalResults = document.querySelector('#search-results');
        const universalRadius = document.querySelector('#search-radius');


        this.addRefreshButton(searchButton, resultsContainer, universalResults);

        if (!searchButton && !universalButton) {
            return;
        }


        const performSearch = async (searchParams = {}) => {
            try {

                const activeLoadingDiv = loadingDiv || document.querySelector('#ads-loading');
                const activeResultsContainer = resultsContainer || universalResults;

                if (activeLoadingDiv) {
                    activeLoadingDiv.classList.remove('hidden');
                }
                if (activeResultsContainer) {
                    activeResultsContainer.innerHTML = '';
                }


                const result = await this.searchArticles(searchParams);


                if (activeLoadingDiv) {
                    activeLoadingDiv.classList.add('hidden');
                }


                this.displayResults(result, activeResultsContainer);

            } catch (error) {
                console.error('Search error:', error);

                const activeLoadingDiv = loadingDiv || document.querySelector('#ads-loading');
                const activeResultsContainer = resultsContainer || universalResults;

                if (activeLoadingDiv) {
                    activeLoadingDiv.classList.add('hidden');
                }

                if (activeResultsContainer) {
                    activeResultsContainer.innerHTML = `
            <div class="text-center text-red-500 py-8">
              <p>Error performing search: ${error.message}</p>
            </div>
          `;
                }
            }
        };


        if (searchButton) {
            searchButton.addEventListener('click', async () => {
                const searchCount = document.querySelector('#search-count');
                const rows = searchCount ? parseInt(searchCount.value) : 20;


                const minYearInput = document.getElementById('ads-year-min');
                const maxYearInput = document.getElementById('ads-year-max');


                let yearParam = '';
                if (minYearInput && maxYearInput && (minYearInput.value || maxYearInput.value)) {
                    const minY = parseInt(minYearInput.value) || 1905;
                    const maxY = parseInt(maxYearInput.value) || new Date().getFullYear();
                    yearParam = `${minY}-${maxY}`;
                } else if (yearInput && yearInput.value) {
                    yearParam = yearInput.value;
                }

                const params = {
                    query: queryInput?.value || '',
                    author: authorInput?.value || '',
                    year: yearParam,
                    object: objectInput?.value || '',
                    rows: rows
                };

                await performSearch(params);
            });
        }


        if (coordinateSearchButton) {
            coordinateSearchButton.addEventListener('click', async () => {
                const ra = raInput?.value;
                const dec = decInput?.value;
                const radius = parseFloat(radiusInput?.value || '0.1');
                const searchCount = document.querySelector('#search-count');
                const rows = searchCount ? parseInt(searchCount.value) : 20;

                if (!ra || !dec) {
                    alert('Please enter both RA and Dec coordinates');
                    return;
                }

                try {
                    const result = await this.searchByCoordinatesAndType(
                        parseFloat(ra),
                        parseFloat(dec),
                        radius,
                        objectInput?.value || '',
                        rows
                    );

                    const activeResultsContainer = resultsContainer || universalResults;
                    this.displayResults(result, activeResultsContainer);
                } catch (error) {
                    console.error('Coordinate search error:', error);
                }
            });
        }


        if (exampleSearchButton) {
            exampleSearchButton.addEventListener('click', async () => {

                if (queryInput) queryInput.value = 'Coma cluster';
                if (raInput) raInput.value = '194.95';
                if (decInput) decInput.value = '27.98';
                if (radiusInput) radiusInput.value = '0.5';

                const params = {
                    query: 'Coma cluster',
                    rows: 20
                };
                await performSearch(params);
            });
        }


        if (universalButton && universalInput) {
            universalButton.addEventListener('click', async () => {
                const query = universalInput.value.trim();
                const radius = parseFloat(universalRadius?.value || '5.0');
                const searchCount = document.querySelector('#search-count');
                const rows = searchCount ? parseInt(searchCount.value) : 20;

                if (!query) {
                    if (universalResults) {
                        const t = createSmartTextProxy();
                        universalResults.innerHTML = `<p class="text-gray-500 text-center py-8">${t.adsEnterQuery}</p>`;
                    }
                    return;
                }


                const isCoordinates = /^[\d\.\s\-\+:]+$/.test(query);

                let params;
                if (isCoordinates) {

                    const coords = query.trim().split(/\s+/);
                    if (coords.length >= 2) {
                        const ra = parseFloat(coords[0]);
                        const dec = parseFloat(coords[1]);

                        try {
                            const result = await this.searchByCoordinatesAndType(ra, dec, radius, '', rows);
                            this.displayResults(result, universalResults);
                            return;
                        } catch (error) {
                            console.error('Coordinate parsing error:', error);
                        }
                    }
                }


                params = {
                    query: query,
                    rows: rows
                };
                await performSearch(params);
            });


            universalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    universalButton.click();
                }
            });
        }



        const debounce = (func, wait) => {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };


        if (yearInput) {
            const onSingleYearChange = async () => {
                const yearValue = yearInput.value.trim();


                if (this.lastSearchParams) {
                    const activeResultsContainer = resultsContainer || universalResults;
                    if (activeResultsContainer) {
                        activeResultsContainer.innerHTML = `<div class="flex justify-center items-center py-10"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>`;
                    }

                    const params = {
                        ...this.lastSearchParams,
                        year: yearValue
                    };

                    const result = await this.searchArticles(params);
                    this.displayResults(result, activeResultsContainer);
                } else {

                    const activeResultsContainer = resultsContainer || universalResults;
                    const params = { year: yearValue, rows: 20 };
                    const result = await this.searchArticles(params);
                    this.displayResults(result, activeResultsContainer);
                }
            };
            const debouncedSingleYearChange = debounce(onSingleYearChange, 500);
            yearInput.addEventListener('input', debouncedSingleYearChange);
            yearInput.addEventListener('change', onSingleYearChange);
        }

        const minYearInput = document.getElementById('ads-year-min');
        const maxYearInput = document.getElementById('ads-year-max');
        if (minYearInput && maxYearInput) {
            const onYearRangeChange = async () => {
                let minY = parseInt(minYearInput.value) || 1905;
                let maxY = parseInt(maxYearInput.value) || new Date().getFullYear();

                if (minY > maxY) {
                    if (document.activeElement === minYearInput) {
                        maxY = minY;
                        maxYearInput.value = maxY;
                    } else {
                        minY = maxY;
                        minYearInput.value = minY;
                    }
                }

                localStorage.setItem('ads_year_min', minY);
                localStorage.setItem('ads_year_max', maxY);

                if (this.lastSearchParams) {
                    const activeResultsContainer = resultsContainer || universalResults;
                    if (activeResultsContainer) {
                        activeResultsContainer.innerHTML = `<div class="flex justify-center items-center py-10"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>`;
                    }

                    const params = {
                        ...this.lastSearchParams,
                        year: `${minY}-${maxY}`
                    };

                    const result = await this.searchArticles(params);
                    this.displayResults(result, activeResultsContainer);
                } else {
                    const activeResultsContainer = resultsContainer || universalResults;
                    const params = { year: `${minY}-${maxY}`, rows: 20 };
                    const result = await this.searchArticles(params);
                    this.displayResults(result, activeResultsContainer);
                }
            };


            const debouncedYearRangeChange = debounce(onYearRangeChange, 500);

            minYearInput.addEventListener('input', debouncedYearRangeChange);
            maxYearInput.addEventListener('input', debouncedYearRangeChange);

            minYearInput.addEventListener('change', onYearRangeChange);
            maxYearInput.addEventListener('change', onYearRangeChange);
        }
    }


    displayResults(result, container) {
        const t = createSmartTextProxy();
        if (!container) return;

        const minYear = parseInt(localStorage.getItem('ads_year_min')) || 1905;
        const maxYear = parseInt(localStorage.getItem('ads_year_max')) || new Date().getFullYear();

        if (!result.success || result.articles.length === 0) {
            container.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <p>${t.adsNoResults}</p>
        </div>
      `;
            return;
        }

        const articles = this.formatResults(result.articles);

        let actualTotal = articles.length;

        if (result.totalCount && result.totalCount !== 27148879 && result.totalCount < 100000) {
            actualTotal = result.totalCount;
        }

        const totalText = `${t.adsFound} ${actualTotal} ${actualTotal !== 1 ? t.adsArticles : t.adsArticle} (${t.adsShowing} ${articles.length})`;


        let html = `
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4 text-blue-800">${t.adsSearchResults}</h3>
        <div class="mb-4 p-3 bg-blue-50 rounded-lg">
          <div class="flex flex-wrap justify-between items-center">
            <p class="text-blue-700 font-medium">${totalText}</p>
            ${articles.length > 0 ? `
              <div class="flex flex-wrap items-center gap-4 mt-2 sm:mt-0">
                <div class="flex items-center">
                  <label for="ads-sort-select" class="text-sm text-gray-600 mr-2">${t.adsSortBy}</label>
                  <select id="ads-sort-select" class="text-sm rounded border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                    <option value="citation_count desc" ${this.sortOrder === 'citation_count desc' ? 'selected' : ''}>${t.adsByCitations}</option>
                    <option value="date desc" ${this.sortOrder === 'date desc' ? 'selected' : ''}>${t.adsByDate}</option>
                  </select>
                </div>
                ${this.sortOrder === 'date desc' ? `
                <div class="flex items-center">
                  <label class="text-sm text-gray-600 mr-1">${t.years}</label>
                  <input type="number" id="ads-year-min" min="1900" max="${new Date().getFullYear()}" value="${minYear}" class="w-20 text-sm rounded border-gray-300 bg-gray-50 px-2 py-1 mr-1" />
                  <span class="mx-1">–</span>
                  <input type="number" id="ads-year-max" min="1900" max="${new Date().getFullYear()}" value="${maxYear}" class="w-20 text-sm rounded border-gray-300 bg-gray-50 px-2 py-1" />
                </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
          ${articles.length > 0 ? `<p class="text-sm text-blue-600 mt-1">
            ${this.sortOrder === 'citation_count desc'
                    ? t.citationSort
                    : t.dateSort
                }
          </p>` : ''}
        </div>
        <div class="space-y-4 overflow-y-auto max-h-[600px] pr-2">
    `;

        articles.forEach((article, index) => {
            html += `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-2">
            <span class="text-sm text-gray-500 font-medium">№${index + 1}</span>
            <span class="text-sm text-gray-500">${article.year}</span>
          </div>
          <h4 class="text-lg font-medium text-blue-600 mb-2 leading-tight">
            <a href="${article.adsUrl}" target="_blank" class="hover:underline hover:text-blue-800">
              ${article.title}
            </a>
          </h4>
          <p class="text-gray-600 mb-2 text-sm">
            <strong>${t.authors}:</strong> 
            <span class="text-gray-800">${article.authors.join(', ')}${article.authors.length >= 3 ? ' et al.' : ''}</span>
          </p>
          <div class="flex flex-wrap gap-4 text-xs text-gray-600 mb-2">
            <span class="text-blue-700 font-semibold"><strong>${t.citations}:</strong> ${article.citations}</span>
            <span><strong>${t.reads}:</strong> ${article.reads}</span>
            ${article.journal ? `<span><strong>${t.journal}:</strong> ${article.journal}</span>` : ''}
          </div>
          ${article.abstract ? `
            <details class="mt-2" open>
              <summary class="cursor-pointer text-sm text-blue-600 hover:text-blue-800">${t.abstract}</summary>
              <p class="text-gray-700 text-sm mt-2 p-3 bg-gray-50 rounded leading-relaxed mathjax-container">
                ${article.abstract}
              </p>
            </details>
          ` : ''}
          <div class="flex flex-wrap gap-2 mt-3">
            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono">${article.bibcode}</span>
            ${article.doi ? `<a href="https://doi.org/${article.doi}" target="_blank" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors">DOI</a>` : ''}
            <a href="${article.adsUrl}" target="_blank" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">ADS</a>
          </div>
        </div>
      `;
        });

        html += `
        </div>
        <style>
          
          #results-scroll-container::-webkit-scrollbar {
            width: 8px;
          }
          #results-scroll-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          #results-scroll-container::-webkit-scrollbar-thumb {
            background: #c5d5e6;
            border-radius: 4px;
          }
          #results-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #a8c1e0;
          }
          
          #results-scroll-container {
            scroll-behavior: smooth;
          }
          
          .mathjax-container .MathJax {
            overflow-x: auto;
            overflow-y: hidden;
            max-width: 100%;
            padding: 2px 0;
          }
          
          .mathjax-container {
            line-height: 1.6;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: normal;
          }
        </style>
      </div>
    `;

        container.innerHTML = html;


        const sortSelect = document.getElementById('ads-sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', async (e) => {
                const newSortOrder = e.target.value;
                this.sortOrder = newSortOrder;


                localStorage.setItem('ads_sort_order', newSortOrder);


                if (this.lastSearchParams && this.lastSearchParams.query) {
                    try {

                        container.innerHTML = `
              <div class="flex justify-center items-center py-10">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            `;


                        const params = { ...this.lastSearchParams };
                        if (newSortOrder === 'date desc') {
                            const minYear = parseInt(localStorage.getItem('ads_year_min')) || 1905;
                            const maxYear = parseInt(localStorage.getItem('ads_year_max')) || new Date().getFullYear();
                            params.year = `${minYear}-${maxYear}`;
                        }


                        const result = await this.searchArticles(params);
                        this.displayResults(result, container);
                    } catch (error) {
                        console.error('Error re-sorting results:', error);
                    }
                }
            });
        }


        if (window.MathJax) {
            setTimeout(() => {
                window.MathJax.typesetPromise?.([container]).catch(err => {
                    console.error('MathJax error:', err);
                });
            }, 100);
        }
    }


    changeSortOrder(newSortOrder) {
        if (['citation_count desc', 'date desc'].includes(newSortOrder)) {
            this.sortOrder = newSortOrder;
            localStorage.setItem('ads_sort_order', newSortOrder);
            return true;
        }
        return false;
    }


    addRefreshButton() {
        const t = createSmartTextProxy();
        
        const refreshButton = document.createElement('button');
        refreshButton.className = 'ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors';
        refreshButton.textContent = t.adsRefresh;
        refreshButton.onclick = () => this.search();
    }
}

window.adsSearch = new ADSSearch();
window.ADSSearch = window.adsSearch;


if (typeof module !== 'undefined' && module.exports) {
    module.exports = ADSSearch;
}
