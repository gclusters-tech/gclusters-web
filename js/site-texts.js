window.SITE_TEXTS = {
    en: {
        back: "Back",
        loading: "Loading...",
        error: "Error",
        search: "Search",

        chatBotWarning: "Warning: Chat bot is temporarily unavailable. Use the search at the bottom of the page to search by coordinates and objects.",

        siteTitle: "Galaxy Clusters",
        siteTitleShort: "GC",
        siteTagline: "Research",

        home: "Home",
        method: "Method",
        aladinBot: "Investigate Object",
        articles: "Articles",
        projects: "Projects",
        contact: "Contact",
        contactUs: "Contact us",

        homePageTitle: "Galaxy Clusters | Intro",
        methodPageTitle: "Galaxy Clusters | Methodology",
        aladinPageTitle: "Galaxy Clusters | Aladin Search",
        articlesPageTitle: "Galaxy Clusters | Articles",
        projectsPageTitle: "Galaxy Clusters | Projects",
        contactPageTitle: "Galaxy Clusters | Contact",
        notFoundPageTitle: "Galaxy Clusters | Page Not Found",

        notFoundHeading: "404 – Page Not Found",
        notFoundMessage: "The page you're looking for doesn't exist in our galaxy cluster.",
        notFoundDescription: "It might have been moved, deleted, or you entered the wrong URL.",
        backToHome: "Back to Home",
        explorePages: "Explore our pages:",

        homeMainQuestion: "What are galaxy clusters?",
        homeMainDescription: "Galaxy clusters are the largest gravitationally bound structures in the universe, containing hundreds to thousands of galaxies, hot gas, and dark matter.",

        methodDescription: "Learn about the methodology for cluster research",
        articlesDescription: "Find articles by coordinates and object type in NASA ADS",
        articlesFullTitle: "Articles search",
        projectsDescription: "Explore team projects and catalog info",
        projectsFullTitle: "Team projects & catalog descriptions",
        contactDescription: "Get in touch with the team.",

        methodHeading: "Methodology",
        methodMainTitle: "Research Methodology & Chat Bot Overview",

        chatBotTitle: "Astronomical Object Search Bot",
        chatBotDescription: "Our chat bot is a CLI-based tool designed for astronomers to quickly retrieve information about astronomical objects. It accepts either object names or coordinates and returns comprehensive data from multiple astronomical databases.",

        inputFormats: "Input Formats",
        inputObjectNames: "• Object names (e.g., M31)",
        inputCoordinatesDeg: "• Coordinates in degrees (10.6847 41.269)",
        inputCoordinatesHMS: "• HMS format (00:42:44.3 +41:16:09)",

        outputData: "Output Data",
        outputObjectParams: "• Object parameters & coordinates",
        outputArticles: "• Scientific articles with abstracts",
        outputCatalogs: "• Catalog cross-references",

        dataSources: "External Data Sources",
        dataSourcesDescription: "Our system integrates with the astronomical databases to provide comprehensive and up-to-date information:",

        // Data Sources Column Headers
        astronomicalCatalogsHeader: "Astronomical Catalogs",
        publicationDatabasesHeader: "Publication Databases",

        simbadDescription: "Astronomical object database with identifiers, basic measurements, and bibliography",
        vizierDescription: "Access to astronomical catalogs including Abell, Planck, ROSAT, and other cluster catalogs",
        arxivDescription: "Open-access repository of electronic preprints for astronomy and astrophysics papers",
        adsDescription: "NASA Astrophysics Data System (ADS) for astronomical literature and data",


        // technicalImplementation: "Technical Implementation",
        // coreTechnologies: "Core Technologies",
        // searchAlgorithms: "Search Algorithms",

        // astropyDescription: "- coordinates, units",
        // astroqueryDescription: "- database access",
        // pandasDescription: "- data processing",
        // requestsDescription: "- API integration",

        // coneSearch: "• Cone search with configurable radius (5 arcmin default)",
        // objectResolution: "• Object name resolution and cross-identification",
        // coordinateDetection: "• Coordinate format auto-detection",
        // objectFiltering: "• Object type filtering (ClG, QSO, etc.)",

        researchWorkflow: "Research Workflow",

        inputProcessing: "Input Processing",
        inputProcessingDescription: "Regular expressions detect input type (coordinates vs. object name) and format conversion via astropy.coordinates.SkyCoord",

        databaseQuery: "Database Query",
        databaseQueryDescription: "Parallel queries to SIMBAD, VizieR, and ADS with error handling and timeout management",

        dataAggregation: "Data Aggregation",
        dataAggregationDescription: "Results are merged, deduplicated, and formatted with proper uncertainty handling",

        outputFormatting: "Output Formatting",
        outputFormattingDescription: "Structured output with coordinates, object properties, bibliographic data, and direct links to source databases",

        pageLoadingError: "Page loading error",

        skyAtlas: "Sky Atlas",
        skyAtlasDescription: "Interactive view of the sky showing multi-wavelength observations and detailed astronomical information.",
        astronomicalSearchBot: "Astronomical Search Bot",
        searchBotWelcome: "Welcome! Enter an astronomical object name to get data from SIMBAD, VizieR, ADS and arXiv databases.",

        searchPlaceholder: "Search for astronomical objects...",
        universalSearchPlaceholder: "Object name or coordinates (e.g., M31, 10.684708 41.268750)",
        chatInputPlaceholder: "Enter object name (e.g., M31)...",
        searchButton: "Search",
        sendButton: "Send",
        clearButton: "Clear",

        databaseQuery: "Database Query",
        databaseQueryDescription: "Parallel queries to SIMBAD, VizieR, and ADS with error handling and timeout management",

        dataAggregation: "Data Aggregation",
        dataAggregationDescription: "Results are merged, deduplicated, and formatted with proper uncertainty handling",

        outputFormatting: "Output Formatting",
        outputFormattingDescription: "Structured output with coordinates, object properties, bibliographic data, and direct links to source databases",

        literatureSearch: "Literature Search",
        literatureSearchDescription: "Automated search in arXiv and NASA ADS for relevant publications with abstract summarization",

        resultCompilation: "Result Compilation",
        resultCompilationDescription: "Data aggregation, caching, and export to CSV format with comprehensive object parameters",

        // applicationsUseCases: "Applications & Use Cases",
        // researchApplications: "Research Applications",
        // technicalFeatures: "Technical Features",

        // clusterIdentification: "• Galaxy cluster identification and cataloging",
        // automatedReviews: "• Automated literature reviews",
        // crossCatalogValidation: "• Cross-catalog validation studies",
        // observationalPreparation: "• Observational target preparation",

        // queryCaching: "• Query result caching for efficiency",
        // coordinateSupport: "• Flexible coordinate system support",
        // errorHandling: "• Error handling and coordinate uncertainty",
        // modularArchitecture: "• Modular architecture for easy extension",

        aladinPageHeading: "Investigate Object",
        skyAtlas: "Sky Atlas",
        skyAtlasDescription: "Interactive view of the sky showing multi-wavelength observations and detailed astronomical information.",
        astronomicalSearchBot: "Astronomical Search Bot",
        astronomicalSearchBotSubtitle: "SIMBAD • VizieR • ADS • arXiv",
        welcomeMessage: "Welcome! Enter an astronomical object name to get data from SIMBAD, VizieR, ADS and arXiv databases.",
        searchPlaceholder: "Enter object name (e.g., M31)...",
        send: "Send",
        unifiedSearchPlaceholder: "Object name or coordinates (e.g., M31, 10.684708 41.268750)",

        contactFormSuccess: "Thank you for your message! We will get back to you soon.",

        simbad: "SIMBAD",
        vizier: "VizieR",
        nasaAds: "NASA ADS",
        arxiv: "arXiv",
        ads: "ADS",

        astrophysicistTeamLeadName: "Svetlana Voskresenskaia",
        dataScientistResearcherName: "Nadezhda Fomicheva",
        mlEngineerWebDeveloperName: "Arkady Pavlov",

        astrophysicistTeamLeadEmail: 'savoskresenskaya@edu.hse.ru',
        astrophysicistTeamLeadOrcid: '0009-0000-9338-4047',
        astrophysicistTeamLeadOrcidLink: 'https://orcid.org/0009-0000-9338-4047',
        dataScientistResearcherEmail: 'nvfomicheva@edu.hse.ru',
        mlEngineerWebDeveloperEmail: 'aspavlov@edu.hse.ru',
        astrophysicistTeamLeadNameGithub: 'https://github.com/svetlana-voskr/',
        dataScientistResearcherGithub: 'https://github.com/pelancha',
        mlEngineerWebDeveloperGithub: 'https://github.com/hetrixq',
        galaxyHackersLink: 'https://github.com/pelancha/galaxyHackers',
        compactCatalogLink: 'https://cdsarc.cds.unistra.fr/viz-bin/cat/J/MNRAS/531/1998',

        // sdssClusterLink: 'https://www.sdss.org/dr17/data_access/value-added-catalogs/?vac_id=galaxy-cluster-catalog',
        // planckLink: 'https://planck.esa.int/science/planck-published-data/planck-catalogues/',
        // rosatLink: 'https://heasarc.gsfc.nasa.gov/W3Browse/rosat/rassfsc.html',
        simbadLink: 'https://simbad.cds.unistra.fr/simbad/',
        vizierLink: 'https://vizier.cds.unistra.fr/viz-bin/VizieR',
        adsLink: 'https://ui.adsabs.harvard.edu/',
        arxivAstroLink: 'https://arxiv.org/list/astro-ph/recent',
        heasarcLink: 'https://heasarc.gsfc.nasa.gov/',
        aladinLink: 'https://aladin.cds.unistra.fr/aladin.gml',
        sdssLink: 'https://www.sdss.org/',
        esoToolsLink: 'https://www.eso.org/sci/observing/tools/',
        sdssServerLink: 'https://skyserver.sdss.org/dr17/',
        gaiaLink: 'https://www.cosmos.esa.int/gaia',
        irsaLink: 'https://irsa.ipac.caltech.edu/',

        // simbadFullDescription: 'Astronomical database',
        // vizierFullDescription: 'Catalog service',
        // adsFullDescription: 'Literature database',
        // nasaAdsFullDescription: 'NASA Astrophysics',
        // arxivFullDescription: 'Preprint repository',
        // heasarcDescription: 'High Energy Archive',
        aladinDescription: 'Interactive sky atlas',
        sdssFullDescription: 'Digital sky survey',
        esoToolsDescription: 'ESO observing tools',
        sdssServerDescription: 'SDSS data access',
        gaiaDescription: 'ESA astrometry mission',
        irsaDescription: 'Infrared archive',

        researchArticles: "Research Articles",
        searchArticles: "Search Articles",
        enterSearchTerms: "Enter search terms to find articles",
        objectNameCoordinates: "Object name or coordinates",
        articlesCount: "articles",
        allArticles: "All",

        teamProjects: "Team Projects",
        projectTeam: "Project Team",
        activeProjects: "Active Projects",
        availableCatalogs: "Available Catalogs & Resources",
        // astronomicalCatalogs: "Astronomical Catalogs & Sky Maps",
        externalResources: "External Astronomical Resources",
        skySurveys: "Sky Surveys & Observation Tools",

        astrophysicistTeamLead: "Astrophysicist & Team Lead",
        dataScientistResearcher: "Data Scientist & Researcher",
        mlEngineerWebDeveloper: "ML Engineer & Web Developer",

        galaxyHackersDescription: "DL-powered tool to classify galaxy clusters throughout space",
        compactCatalogDescription: "Comprehensive Photometric Analysis of Cluster Templates - galaxy cluster catalog",

        githubRepository: "GitHub Repository",
        vizierCatalog: "VizieR Catalog",
        galaxyHackersProject: "Galaxy Hackers Project",

        getInTouch: "Get in Touch",
        sendMessage: "Send us a Message",
        questionsAboutResearch: "Have questions about galaxy clusters or our research?",
        supportEmail: "support@gclusters.tech",

        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        messagePlaceholder: "Tell us about your research interests or questions...",
        sendMessageButton: "Send Message",

        sdssDescription: "~40,000 clusters",
        planckDescription: "1,653 objects",
        rosatDescription: "105,924 sources",

        // simbadFullDescription: "Astronomical object database with identifiers and measurements",
        // vizierFullDescription: "Access to astronomical catalogs (Abell, Planck, ROSAT)",
        // adsFullDescription: "Astrophysics Data System for literature and research",
        // nasaAdsFullDescription: "Astrophysics literature search and citation database",
        // arxivFullDescription: "Preprint server for astronomy and astrophysics",
        // heasarcDescription: "High Energy Astrophysics Science Archive Research Center",
        aladinDescription: "Interactive sky atlas and image viewer",
        sdssFullDescription: "Sloan Digital Sky Survey data and tools",
        esoToolsDescription: "European Southern Observatory observing tools",
        sdssServerDescription: "Interactive interface for SDSS data exploration",
        gaiaDescription: "Gaia mission data and astrometric catalog",
        irsaDescription: "Infrared Science Archive (Spitzer, WISE, etc.)",

        close: "Close",
        open: "Open",
        save: "Save",
        cancel: "Cancel",
        ok: "OK",
        yes: "Yes",
        no: "No",

        searching: "Searching...",
        noResults: "No results found",
        resultsFound: "Results found",

        arcmin: "arcmin",
        arcsec: "arcsec",
        degrees: "degrees",
        hours: "hours",
        minutes: "minutes",
        seconds: "seconds",

        // ADS Search specific texts
        adsSearchResults: "Search Results",
        adsNoResults: "No articles found. Try different search terms.",
        adsEnterQuery: "Enter search query",
        adsSortBy: "Sort by:",
        adsByCitations: "By citations",
        adsByDate: "By date (newest first)",
        adsYears: "Years:",
        adsCitationSort: "Sorted by citation count (most cited first)",
        adsDateSort: "Sorted by publication date (newest first)",
        adsAuthors: "Authors",
        adsCitations: "Citations",
        adsReads: "Reads",
        adsJournal: "Journal",
        adsAbstract: "Abstract",
        adsRefresh: "Refresh",
        adsRefreshTooltip: "Repeat last search",
        adsErrorRefresh: "Error refreshing search",
        adsFound: "Found",
        adsArticle: "article",
        adsArticles: "articles",
        adsShowing: "showing",
        adsNoTitle: "No title",
        adsUnknown: "Unknown",

        // Chat Bot specific texts
        chatSearchingSimbad: "Searching SIMBAD database...",
        chatQueryingVizier: "Querying VizieR catalogs...",
        chatSearchingAds: "Searching NASA ADS publications...",
        chatSearchingArxiv: "Searching scientific articles in arXiv...",
        chatSearchError: "Search error:",
        chatSearchPerformance: "Search Performance",
        chatTotal: "Total:",
        chatSimbadData: "SIMBAD Data",
        chatVizierCatalogs: "VizieR Catalogs",
        chatAdsPublications: "ADS Publications",
        chatAdsPublications: "ADS Publications",
        chatScientificArticles: "Scientific Articles",
        chatObject: "Object",
        chatRADeg: "RA (deg)",
        chatDecDeg: "DEC (deg)",
        chatType: "Type",
        chatPrecision: "Precision",
        chatDistance: "Distance",
        chatMagnitude: "Magnitude",
        chatNA: "N/A",
        chatCatalog: "Catalog",
        chatEntries: "entries",
        chatNoDataAvailable: "No data available",
        chatUnknownTitle: "Unknown Title",
        chatDate: "Date:",
        chatAuthors: "Authors:",
        chatAbstract: "Abstract:",
        chatCitations: "Citations:",
        chatAiSummary: "AI Summary:",
        chatPublished: "Published",
        chatNoDataFound: "No data found for",
        chatTryAnother: "Try another object name or check the spelling",
        chatCompleted: "completed",
        chatSearchFailed: "search failed",
        chatSimbadCompleted: "SIMBAD completed",
        chatVizierCompleted: "VizieR completed",
        chatAdsCompleted: "ADS completed",
        chatArxivCompleted: "arXiv completed",
        chatSimbadFailed: "SIMBAD search failed",
        chatVizierFailed: "VizieR search failed",
        chatAdsFailed: "ADS search failed",
        chatArxivFailed: "arXiv search failed",

        // SPA Navigator specific texts
        spaPageLoading: "Page content is loading...",
        spaReturnHome: "Return to home",
        spaLoadingNavigation: "Loading navigation...",
        spaLoadingGeneric: "Loading...",
        spaErrorTitle: "Error",
        spaPageLoadingError: "Page loading error",
        spaReloadPage: "Reload page"
    },
    debugLang: {}
};

window.getText = function (key, lang = 'en') {
    const texts = window.SITE_TEXTS[lang] || window.SITE_TEXTS.en;
    return texts[key] || key;
};

window.getCurrentLanguage = function () {
    return localStorage.getItem('lang') || 'en';
};

window.setLanguage = function (lang) {
    localStorage.setItem('lang', lang);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
};
