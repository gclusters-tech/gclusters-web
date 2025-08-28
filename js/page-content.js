window.generatePageContent = function (page, lang = 'en') {
    if (!window.getText) {
        console.warn('getText function not available, fallback to null');
        return null;
    }

    const createSmartTextProxy = (lang) => {
        return new Proxy({}, {
            get: function (target, property) {
                if (typeof property === 'string') {
                    return window.getText(property, lang);
                }
                return target[property];
            }
        });
    };

    const t = createSmartTextProxy(lang);

    switch (page) {
        case 'home':
            return {
                title: t.homePageTitle,
                content: `
          <section class="max-w-2xl text-center">
            <h2 class="text-3xl font-semibold mb-4">${t.homeMainQuestion}</h2>
            <p class="mb-8 text-gray-700">
              ${t.homeMainDescription}
            </p>
            <nav class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a href="/method" class="block rounded-xl shadow-lg bg-white hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-300 p-6 border border-gray-100 text-left transform hover:-translate-y-1 hover:shadow-xl hover:border-blue-200">
                <div class="text-xl font-semibold mb-2">${t.method}</div>
                <div class="text-gray-500 text-sm">${t.methodDescription}</div>
              </a>
              <a href="/aladin-bot" class="block rounded-xl shadow-lg bg-white hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-300 p-6 border border-gray-100 text-left transform hover:-translate-y-1 hover:shadow-xl hover:border-blue-200">
                <div class="text-xl font-semibold mb-2">${t.aladinBot}</div>
                <div class="text-gray-500 text-sm">${t.aladinDescription}</div>
              </a>
              <a href="/articles" class="block rounded-xl shadow-lg bg-white hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-300 p-6 border border-gray-100 text-left transform hover:-translate-y-1 hover:shadow-xl hover:border-blue-200">
                <div class="text-xl font-semibold mb-2">${t.articlesFullTitle}</div>
                <div class="text-gray-500 text-sm">${t.articlesDescription}</div>
              </a>
              <a href="/projects" class="block rounded-xl shadow-lg bg-white hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-300 p-6 border border-gray-100 text-left transform hover:-translate-y-1 hover:shadow-xl hover:border-blue-200">
                <div class="text-xl font-semibold mb-2">${t.projectsFullTitle}</div>
                <div class="text-gray-500 text-sm">${t.projectsDescription}</div>
              </a>
              <a href="/contact" class="block rounded-xl shadow-lg bg-white hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-300 p-6 border border-gray-100 text-left sm:col-span-2 transform hover:-translate-y-1 hover:shadow-xl hover:border-blue-200">
                <div class="text-xl font-semibold mb-2">${t.contactUs}</div>
                <div class="text-gray-500 text-sm">${t.contactDescription}</div>
              </a>
            </nav>
          </section>
        `
            };

        case 'method':
            return {
                title: t.methodPageTitle,
                h1: t.methodHeading,
                content: `
          <section class="max-w-4xl w-full mx-auto px-4">
            <h2 class="text-3xl font-semibold mb-6">${t.methodMainTitle}</h2>
            
            <!-- Chat Bot Description -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-lg mb-8">
              <h3 class="text-2xl font-semibold mb-4 text-blue-800">${t.chatBotTitle}</h3>
              <p class="text-gray-700 mb-4">
                ${t.chatBotDescription}
              </p>
              
              <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white rounded-lg p-4 shadow">
                  <h4 class="font-semibold text-blue-700 mb-2">${t.inputFormats}</h4>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>${t.inputObjectNames}</li>
                    <li>${t.inputCoordinatesDeg}</li>
                    <li>${t.inputCoordinatesHMS}</li>
                  </ul>
                </div>
                <div class="bg-white rounded-lg p-4 shadow">
                  <h4 class="font-semibold text-blue-700 mb-2">${t.outputData}</h4>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>${t.outputObjectParams}</li>
                    <li>${t.outputArticles}</li>
                    <li>${t.outputCatalogs}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Data Sources -->
            <div class="bg-white rounded-lg p-6 shadow-lg mb-8">
              <h3 class="text-2xl font-semibold mb-4 text-green-800">${t.dataSources}</h3>
              <p class="text-gray-700 mb-4">
                ${t.dataSourcesDescription}
              </p>
              
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="border border-green-200 rounded-lg p-4">
                  <h4 class="font-semibold text-green-700 mb-2">${t.simbad}</h4>
                  <p class="text-xs text-gray-600">
                    ${t.simbadDescription}
                  </p>
                </div>
                <div class="border border-green-200 rounded-lg p-4">
                  <h4 class="font-semibold text-green-700 mb-2">${t.vizier}</h4>
                  <p class="text-xs text-gray-600">
                    ${t.vizierDescription}
                  </p>
                </div>
                <div class="border border-green-200 rounded-lg p-4">
                  <h4 class="font-semibold text-green-700 mb-2">${t.nasaAds}</h4>
                  <p class="text-xs text-gray-600">
                    ${t.nasaAdsDescription}
                  </p>
                </div>
                <div class="border border-green-200 rounded-lg p-4">
                  <h4 class="font-semibold text-green-700 mb-2">${t.arxiv}</h4>
                  <p class="text-xs text-gray-600">
                    ${t.arxivDescription}
                  </p>
                </div>
                <div class="border border-green-200 rounded-lg p-4">
                  <h4 class="font-semibold text-green-700 mb-2">${t.ads}</h4>
                  <p class="text-xs text-gray-600">
                    ${t.adsDescription}
                  </p>
                </div>
              </div>
            </div>

            <!-- Technical Implementation -->
            <div class="bg-white rounded-lg p-6 shadow-lg mb-8">
              <h3 class="text-2xl font-semibold mb-4 text-purple-800">${t.technicalImplementation}</h3>
              
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-lg font-semibold mb-3 text-purple-700">${t.coreTechnologies}</h4>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <span class="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                      <code class="text-sm bg-gray-100 px-2 py-1 rounded">astropy</code>
                      <span class="text-xs text-gray-600 ml-2">${t.astropyDescription}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                      <code class="text-sm bg-gray-100 px-2 py-1 rounded">astroquery</code>
                      <span class="text-xs text-gray-600 ml-2">${t.astroqueryDescription}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                      <code class="text-sm bg-gray-100 px-2 py-1 rounded">pandas</code>
                      <span class="text-xs text-gray-600 ml-2">${t.pandasDescription}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                      <code class="text-sm bg-gray-100 px-2 py-1 rounded">requests</code>
                      <span class="text-xs text-gray-600 ml-2">${t.requestsDescription}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-lg font-semibold mb-3 text-purple-700">${t.searchAlgorithms}</h4>
                  <ul class="space-y-2 text-sm text-gray-700">
                    <li>${t.coneSearch}</li>
                    <li>${t.objectResolution}</li>
                    <li>${t.coordinateDetection}</li>
                    <li>${t.objectFiltering}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Research Workflow -->
            <div class="bg-white rounded-lg p-6 shadow-lg mb-8">
              <h3 class="text-2xl font-semibold mb-4 text-indigo-800">${t.researchWorkflow}</h3>
              
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 class="font-semibold text-indigo-700">${t.inputProcessing}</h4>
                    <p class="text-sm text-gray-600">
                      ${t.inputProcessingDescription}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 class="font-semibold text-indigo-700">${t.databaseQuery}</h4>
                    <p class="text-sm text-gray-600">
                      ${t.databaseQueryDescription}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 class="font-semibold text-indigo-700">${t.dataAggregation}</h4>
                    <p class="text-sm text-gray-600">
                      ${t.dataAggregationDescription}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">4</div>
                  <div>
                    <h4 class="font-semibold text-indigo-700">${t.outputFormatting}</h4>
                    <p class="text-sm text-gray-600">
                      ${t.outputFormattingDescription}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">5</div>
                  <div>
                    <h4 class="font-semibold text-indigo-700">${t.literatureSearch}</h4>
                    <p class="text-sm text-gray-600">
                      ${t.literatureSearchDescription}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">6</div>
                  <div>
                    <h4 class="font-semibold text-indigo-700">${t.resultCompilation}</h4>
                    <p class="text-sm text-gray-600">
                      ${t.resultCompilationDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Applications -->
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <h3 class="text-2xl font-semibold mb-4 text-orange-800">${t.applicationsUseCases}</h3>
              
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-lg font-semibold mb-3 text-orange-700">${t.researchApplications}</h4>
                  <ul class="space-y-2 text-sm text-gray-700">
                    <li>${t.clusterIdentification}</li>
                    <li>${t.automatedReviews}</li>
                    <li>${t.crossCatalogValidation}</li>
                    <li>${t.observationalPreparation}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 class="text-lg font-semibold mb-3 text-orange-700">${t.technicalFeatures}</h4>
                  <ul class="space-y-2 text-sm text-gray-700">
                    <li>${t.queryCaching}</li>
                    <li>${t.coordinateSupport}</li>
                    <li>${t.errorHandling}</li>
                    <li>${t.modularArchitecture}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        `
            };

        case 'contact':
            return {
                title: t.contactPageTitle,
                h1: t.contactUs,
                content: `
          <section class="max-w-4xl w-full">
            <h2 class="text-3xl font-semibold mb-8 text-center">${t.getInTouch}</h2>

            <!-- Contact Form Section -->
            <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
              <h3 class="text-2xl font-semibold mb-6 text-center">${t.sendMessage}</h3>
              
              <!-- Contact Info -->
              <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 text-center">
                <p class="text-gray-700 mb-3">${t.questionsAboutResearch}</p>
                <div class="flex items-center justify-center text-blue-600 hover:text-blue-800">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <a href="mailto:${t.supportEmail}" class="font-semibold">${t.supportEmail}</a>
                </div>
              </div>
              
              <!-- Contact Form -->
              <form id="contact-form" class="max-w-lg mx-auto space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">${t.name}</label>
                    <input type="text" 
                           id="contact-name"
                           name="name"
                           required
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">${t.email}</label>
                    <input type="email" 
                           id="contact-email"
                           name="email"
                           required
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">${t.subject}</label>
                  <input type="text" 
                         id="contact-subject"
                         name="subject"
                         required
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">${t.message}</label>
                  <textarea rows="5" 
                            id="contact-message"
                            name="message"
                            required
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                            placeholder="${t.messagePlaceholder}"></textarea>
                </div>
                <button type="submit" 
                        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 transform hover:scale-105">
                  ${t.sendMessageButton}
                </button>
              </form>
            </div>
          </section>
          
          <script>
            // Contact form handling
            document.addEventListener('DOMContentLoaded', function() {
              const contactForm = document.getElementById('contact-form');
              if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                  e.preventDefault();
                  
                  // Get form data
                  const formData = new FormData(contactForm);
                  const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message')
                  };
                  
                  // Here you would normally send to your backend
                  console.log('Contact form data:', data);
                  
                  // Show success message
                  alert(t.contactFormSuccess);
                  
                  // Reset form
                  contactForm.reset();
                });
              }
            });
          </script>
        `
            };

        case 'articles':
            return {
                title: t.articlesPageTitle,
                h1: t.articlesFullTitle,
                content: `
          <section class="max-w-4xl w-full mx-auto px-4">
            <h2 class="text-3xl font-semibold mb-6">${t.researchArticles}</h2>
            
            <div class="bg-white rounded-lg p-6 shadow-lg mb-8">
              <h3 class="text-xl font-semibold mb-4">${t.searchArticles}</h3>
              
              <div class="flex flex-col sm:flex-row gap-3 mb-4">
                <input id="universal-search" 
                       type="text" 
                       placeholder="${t.objectNameCoordinates}" 
                       class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                
                <select id="search-count" class="px-3 py-2 border border-gray-300 rounded">
                  <option value="5">5 ${t.articlesCount}</option>
                  <option value="10">10 ${t.articlesCount}</option>
                  <option value="15">15 ${t.articlesCount}</option>
                  <option value="20" selected>20 ${t.articlesCount}</option>
                  <option value="30">30 ${t.articlesCount}</option>
                  <option value="50">50 ${t.articlesCount}</option>
                  <option value="100">100 ${t.articlesCount}</option>
                  <option value="2000">${t.allArticles}</option>
                </select>
                
                <button id="search-button" 
                        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
                  ${t.searchButton}
                </button>
              </div>
            </div>

            <div id="search-results" class="mb-8">
              <div class="text-center py-8 text-gray-500">
                ${t.enterSearchTerms}
              </div>
            </div>
          </section>
          
          <script src="js/article-search.js"></script>
        `
            };

        case 'projects':
            return {
                title: t.projectsPageTitle,
                h1: t.projectsFullTitle,
                content: `
          <section class="w-full max-w-7xl mx-auto px-4">
            <h2 class="text-4xl font-semibold mb-8 text-center">${t.teamProjects}</h2>
            
            <div class="mb-12">
              <h3 class="text-2xl font-semibold mb-6 text-center">${t.projectTeam}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                  <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-white text-xl font-bold">SV</span>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Svetlana Voskresenskaya</h4>
                  <p class="text-sm text-gray-600 mb-4">${t.astrophysicistTeamLead}</p>
                  <div class="space-y-2">
                    <a href="mailto:${t.svetlanaEmail}" class="flex items-center justify-center text-blue-600 hover:text-blue-800 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      ${t.svetlanaEmail}
                    </a>
                    <a href="${t.svetlanaGithub}" target="_blank" class="flex items-center justify-center text-gray-700 hover:text-gray-900 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                    <a href="${t.mnrasLink}" target="_blank" class="flex items-center justify-center text-red-600 hover:text-red-800 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      ${t.mnrasPublication}
                    </a>
                    <a href="${t.arxivLink}" target="_blank" class="flex items-center justify-center text-orange-600 hover:text-orange-800 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                      ${t.arxivPreprint}
                    </a>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                  <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-white text-xl font-bold">FN</span>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Fomicheva Nadezhda</h4>
                  <p class="text-sm text-gray-600 mb-4">${t.dataAnalystResearcher}</p>
                  <div class="space-y-2">
                    <a href="mailto:${t.nadezhdaEmail}" class="flex items-center justify-center text-blue-600 hover:text-blue-800 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      ${t.nadezhdaEmail}
                    </a>
                    <a href="${t.nadezhdaGithub}" target="_blank" class="flex items-center justify-center text-gray-700 hover:text-gray-900 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                    <a href="${t.galaxyHackersLink}" target="_blank" class="flex items-center justify-center text-indigo-600 hover:text-indigo-800 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                      </svg>
                      ${t.galaxyHackersProject}
                    </a>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                  <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-white text-xl font-bold">PA</span>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Pavlov Arkady</h4>
                  <p class="text-sm text-gray-600 mb-4">${t.mlEngineerWebDeveloper}</p>
                  <div class="space-y-2">
                    <a href="mailto:${t.arkadyEmail}" class="flex items-center justify-center text-blue-600 hover:text-blue-800 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      ${t.arkadyEmail}
                    </a>
                    <a href="${t.arkadyGithub}" target="_blank" class="flex items-center justify-center text-gray-700 hover:text-gray-900 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                    <a href="${t.galaxyHackersLink}" target="_blank" class="flex items-center justify-center text-indigo-600 hover:text-indigo-800 text-sm">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                      </svg>
                      ${t.galaxyHackersProject}
                    </a>
                  </div>
                </div>

              </div>
            </div>
            
            <div class="space-y-8">
              <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                <h3 class="text-2xl font-semibold mb-6 text-center">${t.activeProjects}</h3>
                <div class="grid md:grid-cols-2 gap-6">
                  <a href="${t.galaxyHackersLink}" target="_blank" class="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 hover:from-indigo-100 hover:to-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 block">
                    <h4 class="font-semibold text-indigo-800 text-lg mb-3">GalaxyHackers</h4>
                    <p class="text-indigo-700 mb-2">${t.galaxyHackersDescription}</p>
                    <div class="flex items-center text-xs text-indigo-600 mt-3">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12C24 5.37 18.63 0 12 0z"/>
                      </svg>
                      ${t.githubRepository}
                    </div>
                  </a>
                  <a href="${t.compactCatalogLink}" target="_blank" class="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 block">
                    <h4 class="font-semibold text-red-800 text-lg mb-3">ComPACT Catalog</h4>
                    <p class="text-red-700 mb-2">${t.compactCatalogDescription}</p>
                    <div class="flex items-center text-xs text-red-600 mt-3">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      ${t.vizierCatalog}
                    </div>
                  </a>
                </div>
              </div>
              
              <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                <h3 class="text-2xl font-semibold mb-6 text-center">${t.availableCatalogs}</h3>
                
                <div class="mb-8">
                  <h4 class="text-xl font-semibold mb-4 text-blue-800">${t.astronomicalCatalogs}</h4>
                  <div class="grid md:grid-cols-3 gap-4">
                    <a href="${t.sdssClusterLink}" target="_blank" class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:scale-105">
                      <span class="font-medium">SDSS Galaxy Cluster Catalog</span>
                      <span class="text-sm text-blue-700 bg-blue-200 px-2 py-1 rounded-full">${t.sdssDescription}</span>
                    </a>
                    <a href="${t.planckLink}" target="_blank" class="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:scale-105">
                      <span class="font-medium">Planck SZ Cluster Catalog</span>
                      <span class="text-sm text-green-700 bg-green-200 px-2 py-1 rounded-full">${t.planckDescription}</span>
                    </a>
                    <a href="${t.rosatLink}" target="_blank" class="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:scale-105">
                      <span class="font-medium">ROSAT Faint Source Catalog</span>
                      <span class="text-sm text-purple-700 bg-purple-200 px-2 py-1 rounded-full">${t.rosatDescription}</span>
                    </a>
                  </div>
                </div>

                <!-- External Resources -->
                <div class="mb-8">
                  <h4 class="text-xl font-semibold mb-4 text-green-800">${t.externalResources}</h4>
                  <div class="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <a href="${t.simbadLink}" target="_blank" class="block p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-green-700">${t.simbad}</div>
                      <div class="text-xs text-gray-600 mt-1">${t.simbadFullDescription}</div>
                    </a>
                    <a href="${t.vizierLink}" target="_blank" class="block p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-green-700">${t.vizier}</div>
                      <div class="text-xs text-gray-600 mt-1">${t.vizierFullDescription}</div>
                    </a>
                    <a href="${t.adsLink}" target="_blank" class="block p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-blue-700">${t.ads}</div>
                      <div class="text-xs text-gray-600 mt-1">${t.adsFullDescription}</div>
                    </a>
                    <a href="${t.adsLink}" target="_blank" class="block p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-blue-700">${t.nasaAds}</div>
                      <div class="text-xs text-gray-600 mt-1">${t.nasaAdsFullDescription}</div>
                    </a>
                    <a href="${t.arxivAstroLink}" target="_blank" class="block p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-purple-700">${t.arxiv} Astro-ph</div>
                      <div class="text-xs text-gray-600 mt-1">${t.arxivFullDescription}</div>
                    </a>
                    <a href="${t.heasarcLink}" target="_blank" class="block p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-purple-700">HEASARC</div>
                      <div class="text-xs text-gray-600 mt-1">${t.heasarcDescription}</div>
                    </a>
                  </div>
                </div>

                <!-- Sky Surveys & Tools -->
                <div>
                  <h4 class="text-xl font-semibold mb-4 text-orange-800">${t.skySurveys}</h4>
                  <div class="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <a href="${t.aladinLink}" target="_blank" class="block p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:from-orange-100 hover:to-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-orange-700">Aladin Sky Atlas</div>
                      <div class="text-xs text-gray-600 mt-1">${t.aladinDescription}</div>
                    </a>
                    <a href="${t.sdssLink}" target="_blank" class="block p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:from-orange-100 hover:to-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-orange-700">SDSS</div>
                      <div class="text-xs text-gray-600 mt-1">${t.sdssFullDescription}</div>
                    </a>
                    <a href="${t.esoToolsLink}" target="_blank" class="block p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-red-700">ESO Tools</div>
                      <div class="text-xs text-gray-600 mt-1">${t.esoToolsDescription}</div>
                    </a>
                    <a href="${t.sdssServerLink}" target="_blank" class="block p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-red-700">SDSS SkyServer</div>
                      <div class="text-xs text-gray-600 mt-1">${t.sdssServerDescription}</div>
                    </a>
                    <a href="${t.gaiaLink}" target="_blank" class="block p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 hover:from-indigo-100 hover:to-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-indigo-700">ESA Gaia</div>
                      <div class="text-xs text-gray-600 mt-1">${t.gaiaDescription}</div>
                    </a>
                    <a href="${t.irsaLink}" target="_blank" class="block p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 hover:from-indigo-100 hover:to-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <div class="font-semibold text-indigo-700">IRSA</div>
                      <div class="text-xs text-gray-600 mt-1">${t.irsaDescription}</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        `
            };

        case 'aladin-bot':
            return {
                title: t.aladinPageTitle,
                content: `
          <!-- Chat Bot Status Warning -->
          <div class="max-w-7xl w-full mb-4">
            <div class="warning-banner">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <p class="text-sm font-medium">
                  ${t.chatBotWarning}
                </p>
              </div>
            </div>
          </div>
          
          <section class="max-w-7xl w-full">          
            <div class="grid lg:grid-cols-3 gap-6 mb-6">
              <!-- Aladin Section (Expanded to take more space) -->
              <div class="lg:col-span-2 bg-white rounded-lg p-6 shadow-lg">
                <h3 class="text-xl font-semibold mb-3">${t.skyAtlas}</h3>
                <p class="text-gray-700 mb-4">
                  ${t.skyAtlasDescription}
                </p>
                <div id="aladin-lite-div" class="w-full h-[600px] rounded-lg border border-gray-200 bg-black"></div>
              </div>
              
              <!-- Chatbot Panel Section (Right) -->
              <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <!-- Chatbot Header -->
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center gap-3">
                  <span class="text-2xl"></span>
                  <div>
                    <h3 class="text-lg font-semibold">${t.astronomicalSearchBot}</h3>
                    <p class="text-sm text-blue-100">${t.astronomicalSearchBotSubtitle}</p>
                  </div>
                </div>
                
                <!-- Chat Messages Area -->
                <div id="chat-messages" class="p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-3" style="height: 520px;">
                  <div class="message bot bg-white border border-gray-200 rounded-lg p-3 max-w-[90%] shadow-sm">
                    <p class="text-sm text-gray-700">${t.welcomeMessage}</p>
                  </div>
                </div>
                
                <!-- Chat Input Area -->
                <div class="p-4 border-t border-gray-200 bg-white">
                  <div class="flex gap-2">
                    <input id="chat-input" 
                           type="text" 
                           placeholder="${t.searchPlaceholder}" 
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <button id="chat-send" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-sm">
                      ${t.send}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Unified Search Interface (Moved to bottom, width matches the two blocks above) -->
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <div class="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto">
                <input id="universal-search" 
                       type="text" 
                       placeholder="${t.unifiedSearchPlaceholder}" 
                       class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base">
                
                <button id="search-button" 
                        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium">
                  ${t.search}
                </button>
              </div>
            </div>
          </section>
          
          <script src="js/aladin.js" charset="utf-8"></script>
          <script src="js/unified-search.js" charset="utf-8"></script>
          <script src="js/chat-bot.js" charset="utf-8"></script>
          <script>
            // Wait for both DOM and Aladin to be ready
            document.addEventListener('DOMContentLoaded', function() {
              // Check if we're on the aladin-bot page
              if (window.location.pathname.includes('aladin-bot') || document.getElementById('aladin-lite-div')) {
                // Legacy initializeAladin removed; rely on smartInitializeAladin pattern below
                setTimeout(() => {
                  if (window.initializeUnifiedSearch) {
                    window.initializeUnifiedSearch();
                  } else {
                    console.log('initializeUnifiedSearch not found in DOMContentLoaded');
                  }
                }, 200);
                setTimeout(() => {
                  console.log('DOMContentLoaded: Initializing chatbot');
                  if (window.initializeChatBot) {
                    window.initializeChatBot();
                  } else {
                    console.log('initializeChatBot not found in DOMContentLoaded');
                  }
                }, 300);
              }
            });
            
            // Force initialization of chatbot after content loads
            setTimeout(() => {
              console.log('Force init unified search and chatbot...');
              if (window.initializeUnifiedSearch) {
                console.log('Found initializeUnifiedSearch function, calling it...');
                window.initializeUnifiedSearch();
              }
              if (window.initializeChatBot) {
                console.log('Found initializeChatBot function, calling it...');
                window.initializeChatBot();
              } else {
                console.log('initializeChatBot function not found');
              }
            }, 500);
            
            // Also initialize when page content is dynamically loaded (SPA)
            if (typeof window.smartInitializeAladin === 'undefined') {
              window.smartInitializeAladin = function(forceReinit = false, savedParams = null) {
                // Wait for Aladin library to be available
                const checkAladin = () => {
                  if (typeof A !== 'undefined' && A.init) {
                    A.init.then(() => {
                      const aladinDiv = document.getElementById('aladin-lite-div');
                      if (aladinDiv) {
                        // Clear old instance if needed
                        if (forceReinit && window.aladinInstance) {
                          try {
                            if (window.aladinInstance.view && typeof window.aladinInstance.view.destroy === 'function') {
                              window.aladinInstance.view.destroy();
                            }
                          } catch (error) {
                            console.log('Error destroying old Aladin instance:', error);
                          }
                          window.aladinInstance = null;
                        }
                        
                        // Create new instance only if it doesn't exist or forced reinitialization
                        if (!window.aladinInstance || forceReinit) {
                          // Use saved parameters or default values
                          const ra = savedParams?.ra || 10.6847;
                          const dec = savedParams?.dec || 41.269;
                          const fov = savedParams?.fov || 0.5;
                          
                          console.log('Creating Aladin instance with:', { ra, dec, fov });
                          
                          try {
                            window.aladinInstance = A.aladin('#aladin-lite-div', {
                              survey: 'P/DSS2/color',
                              fov: fov,
                              target: ra + ' ' + dec,
                              showCooGrid: true,
                              showFrame: true,
                              showCatalogs: true,
                              reticleColor: '#ff0000',
                              reticleSize: 30,
                              realFullscreen: true,
                              showFullscreenControl: true
                            });
                            
                            console.log('Aladin instance created successfully');
                            
                            // Add context menu and other interactions
                            window.aladinInstance.on('objectClicked', function(object) {
                              console.log('Object clicked:', object);
                            });

                            // Fullscreen reliability helpers
                            window.ensureAladinFullscreen = () => {
                              const inst = window.aladinInstance;
                              if (!inst) return;
                              inst.options.realFullscreen = true; // enforce real fullscreen every time
                              const el = inst.aladinDiv;
                              if (document.fullscreenElement === el) return; // already correct
                              if (inst.isInFullscreen && document.fullscreenElement !== el) {
                                inst.isInFullscreen = false; // resync internal state
                              }
                              try { inst.toggleFullscreen(true); } catch(e) {}
                              setTimeout(() => {
                                if (document.fullscreenElement !== el) {
                                  try { el.requestFullscreen && el.requestFullscreen(); } catch(e) {}
                                }
                              }, 120);
                            };

                            // Double-click to enter fullscreen consistently
                            [window.aladinInstance.aladinDiv, window.aladinInstance.view?.canvas].forEach(t => {
                              if (t && !t.__aladinDblFsBound) {
                                t.addEventListener('dblclick', () => window.ensureAladinFullscreen());
                                t.__aladinDblFsBound = true;
                              }
                            });

                            // Patch internal fullscreen button to force real fullscreen
                            setTimeout(() => {
                              const btn = window.aladinInstance.aladinDiv.querySelector('.aladin-fullScreen-control');
                              if (btn && !btn.__patchedRealFs) {
                                // Capture original DOM state once (class + inline style)
                                if (!window.aladinOriginalDomState) {
                                  const el = window.aladinInstance.aladinDiv;
                                  const cs = getComputedStyle(el);
                                  window.aladinOriginalDomState = {
                                    className: el.className,
                                    inlineStyle: el.getAttribute('style') || '',
                                    width: cs.width,
                                    height: cs.height
                                  };
                                }
                                const restoreBox = () => {
                                  const inst = window.aladinInstance;
                                  const el = inst?.aladinDiv;
                                  const state = window.aladinOriginalDomState;
                                  if (!inst || !el || !state) return;
                                  if (document.fullscreenElement) return; // still in fullscreen
                                  // Restore class list exactly as it was (includes w-full / h-[600px])
                                  el.className = state.className;
                                  // Reset inline style to original (remove fullscreen-added width/height etc.)
                                  if (state.inlineStyle) {
                                    el.setAttribute('style', state.inlineStyle);
                                  } else {
                                    el.removeAttribute('style');
                                  }
                                  // Double RAF before layout recalculation to ensure browser applied style removal
                                  requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                      try {
                                        inst.view.fixLayoutDimensions();
                                        inst.view.requestRedraw?.();
                                      } catch(e) {}
                                    });
                                  });
                                };
                                // Listen for fullscreen exit
                                if (!window.__aladinFsRestoreBound) {
                                  document.addEventListener('fullscreenchange', restoreBox);
                                  window.__aladinFsRestoreBound = true;
                                }
                                btn.addEventListener('click', () => {
                                  window.aladinInstance.options.realFullscreen = true;
                                  setTimeout(() => {
                                    if (document.fullscreenElement !== window.aladinInstance.aladinDiv) {
                                      window.ensureAladinFullscreen();
                                    }
                                  }, 10);
                                }, { capture: true });
                                btn.__patchedRealFs = true;
                              }
                            }, 300);
                            
                          } catch (error) {
                            console.error('Error creating Aladin instance:', error);
                          }
                        }
                      }
                    }).catch(error => {
                      console.error('Error in A.init:', error);
                    });
                  } else {
                    console.log('Aladin not ready, retrying...');
                    setTimeout(checkAladin, 100);
                  }
                };
                
                checkAladin();
              };
            }
            
            // Initialize when content loads
            setTimeout(() => {
              if (window.smartInitializeAladin) window.smartInitializeAladin();
            }, 1000);
          </script>
        `
            };

        default:
            // 404 Page
            return {
                title: t.notFoundPageTitle,
                content: `
          <section class="max-w-2xl text-center">
            <div class="mb-8">
              <div class="text-9xl font-bold text-blue-600 mb-4">404</div>
              <h2 class="text-3xl font-semibold mb-4">${t.notFoundHeading}</h2>
              <p class="text-gray-700 mb-4">
                ${t.notFoundMessage}
              </p>
              <p class="text-gray-600 mb-8">
                ${t.notFoundDescription}
              </p>
            </div>
            
            <div class="space-y-6">
              <a href="/" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                ${t.backToHome}
              </a>
              
              <div>
                <h3 class="text-lg font-semibold mb-4">${t.explorePages}</h3>
                <nav class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="/method" class="block rounded-lg shadow bg-white hover:bg-blue-50 transition-all duration-300 p-4 border border-gray-100 text-left">
                    <div class="font-semibold">${t.method}</div>
                    <div class="text-gray-500 text-sm">${t.methodDescription}</div>
                  </a>
                  <a href="/aladin-bot" class="block rounded-lg shadow bg-white hover:bg-blue-50 transition-all duration-300 p-4 border border-gray-100 text-left">
                    <div class="font-semibold">${t.aladinBot}</div>
                    <div class="text-gray-500 text-sm">${t.aladinDescription}</div>
                  </a>
                  <a href="/articles" class="block rounded-lg shadow bg-white hover:bg-blue-50 transition-all duration-300 p-4 border border-gray-100 text-left">
                    <div class="font-semibold">${t.articlesFullTitle}</div>
                    <div class="text-gray-500 text-sm">${t.articlesDescription}</div>
                  </a>
                  <a href="/projects" class="block rounded-lg shadow bg-white hover:bg-blue-50 transition-all duration-300 p-4 border border-gray-100 text-left">
                    <div class="font-semibold">${t.projectsFullTitle}</div>
                    <div class="text-gray-500 text-sm">${t.projectsDescription}</div>
                  </a>
                  <a href="/contact" class="block rounded-lg shadow bg-white hover:bg-blue-50 transition-all duration-300 p-4 border border-gray-100 text-left sm:col-span-2">
                    <div class="font-semibold">${t.contactUs}</div>
                    <div class="text-gray-500 text-sm">${t.contactDescription}</div>
                  </a>
                </nav>
              </div>
            </div>
          </section>
        `
            };
    }
};