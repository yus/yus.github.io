// Color data structure
const colorData = {
    ralDesignPlus: [],
    ralClassic: [],
    loaded: { designPlus: false, classic: false },
    copyHistory: [],
    pinnedHistory: JSON.parse(localStorage.getItem('pinnedHistory')) || [],
    classicMappings: {}
};

// DOM elements cache
const elements = {};

// Initialize the application
async function init() {
    initializeElements();
    loadTheme();
    setupNavigation();
    setupEventListeners();
    setupTabs();
    await loadAllColorData();
    updateColorPreview();

    if (colorData.loaded.designPlus || colorData.loaded.classic) {
        findMatchingColors();
        displayCatalog();
        displayClassicCatalog();
    }
}

// Initialize DOM elements
function initializeElements() {
    // Navigation
    elements.navTabs = document.querySelectorAll('.nav-tab');
    elements.pages = document.querySelectorAll('.page');
    elements.backToTop = document.getElementById('backToTop');
    elements.themeToggle = document.getElementById('themeToggle');

    // Copy notification
    elements.copyNotification = document.getElementById('copyNotification');

    // Error containers
    elements.errorContainer = document.getElementById('errorContainer');
    elements.catalogErrorContainer = document.getElementById('catalogErrorContainer');
    elements.classicErrorContainer = document.getElementById('classicErrorContainer');

    // History elements
    elements.historySection = document.getElementById('historySection');
    elements.historyBreadcrumb = document.getElementById('historyBreadcrumb');
    elements.clearHistory = document.getElementById('clearHistory');
    elements.catalogHistorySection = document.getElementById('catalogHistorySection');
    elements.catalogHistoryBreadcrumb = document.getElementById('catalogHistoryBreadcrumb');
    elements.catalogClearHistory = document.getElementById('catalogClearHistory');
    elements.classicHistorySection = document.getElementById('classicHistorySection');
    elements.classicHistoryBreadcrumb = document.getElementById('classicHistoryBreadcrumb');
    elements.classicClearHistory = document.getElementById('classicClearHistory');

    // Matcher page elements
    elements.redSlider = document.getElementById('redSlider');
    elements.redInput = document.getElementById('redInput');
    elements.greenSlider = document.getElementById('greenSlider');
    elements.greenInput = document.getElementById('greenInput');
    elements.blueSlider = document.getElementById('blueSlider');
    elements.blueInput = document.getElementById('blueInput');
    elements.hexInput = document.getElementById('hexInput');
    elements.cyanSlider = document.getElementById('cyanSlider');
    elements.cyanInput = document.getElementById('cyanInput');
    elements.magentaSlider = document.getElementById('magentaSlider');
    elements.magentaInput = document.getElementById('magentaInput');
    elements.yellowSlider = document.getElementById('yellowSlider');
    elements.yellowInput = document.getElementById('yellowInput');
    elements.blackSlider = document.getElementById('blackSlider');
    elements.blackInput = document.getElementById('blackInput');
    elements.cmykInput = document.getElementById('cmykInput');
    elements.resultsCount = document.getElementById('resultsCount');
    elements.resultsCountValue = document.getElementById('resultsCountValue');
    elements.maxDifference = document.getElementById('maxDifference');
    elements.maxDifferenceValue = document.getElementById('maxDifferenceValue');
    elements.colorSpace = document.getElementById('colorSpace');
    elements.colorPreview = document.getElementById('colorPreview');
    elements.findMatches = document.getElementById('findMatches');
    elements.resultsContainer = document.getElementById('resultsContainer');
    elements.loadingIndicator = document.getElementById('loadingIndicator');
    elements.viewCatalogLink = document.getElementById('viewCatalogLink');
    elements.rgbTab = document.getElementById('rgbTab');
    elements.cmykTab = document.getElementById('cmykTab');
    elements.searchRALDS = document.getElementById('searchRALDS');
    elements.searchRALClassic = document.getElementById('searchRALClassic');

    
    // Catalog page elements - FIX THESE:
    elements.catalogSearch = document.getElementById('catalogSearch') || document.getElementById('searchCatalog');
    elements.catalogLoading = document.getElementById('catalogLoading') || document.getElementById('loadingCatalog');
    elements.catalogContainer = document.getElementById('catalogContainer') || document.getElementById('containerCatalog');
    
    // Classic page elements - FIX THESE:
    elements.classicSearch = document.getElementById('classicSearch') || document.getElementById('searchClassic');
    elements.classicLoading = document.getElementById('classicLoading') || document.getElementById('loadingClassic');
    elements.classicContainer = document.getElementById('classicContainer') || document.getElementById('containerClassic');
}

// Theme management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (elements.themeToggle) {
        elements.themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

function setupNavigation() {
    elements.navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const pageId = tab.getAttribute('data-page') + 'Page';

            // Update active tab
            elements.navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding page
            elements.pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
        });
    });

    // Back to top button
    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        elements.backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
    });
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            button.classList.add('active');
            const tabId = button.getAttribute('data-tab') + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Color data loading
async function loadAllColorData() {
    try {
        elements.loadingIndicator.style.display = 'block';
        elements.catalogLoading.style.display = 'block';
        elements.classicLoading.style.display = 'block';

        // Load RAL Design System Plus
        await loadRALDesignPlus();

        // Load RAL Classic with LRV
        await loadRALClassicWithLRV();

        elements.loadingIndicator.style.display = 'none';
        elements.catalogLoading.style.display = 'none';
        elements.classicLoading.style.display = 'none';

    } catch (error) {
        console.error('Error loading color data:', error);
        elements.loadingIndicator.style.display = 'none';
        elements.catalogLoading.style.display = 'none';
        elements.classicLoading.style.display = 'none';
        loadSampleData();
    }
}

async function loadRALDesignPlus() {
    const [enResponse, ruResponse] = await Promise.all([
        fetch('https://yus.github.io/RAL/ral-design-system-plus-farbnamen-en.txt'),
        fetch('https://yus.github.io/RAL/ral-design-system-plus-farbnamen-ru.txt')
    ]);

    const enText = await enResponse.text();
    const ruText = await ruResponse.text();

    const enColors = parseRALTextFileImproved(enText, 'en');
    const ruColors = parseRALTextFileImproved(ruText, 'ru');

    colorData.ralDesignPlus = mergeColorData(enColors, ruColors);
    colorData.loaded.designPlus = true;
}

async function loadRALClassicWithLRV() {
    try {
        const [comprehensiveResponse, namesEnResponse, namesRuResponse] = await Promise.all([
            fetch('https://yus.github.io/RAL/comprehensiveRAL.json'),
            fetch('https://yus.github.io/RAL/ral-classic-colour-names-en.txt'),
            fetch('https://yus.github.io/RAL/ral-classic-colour-names-ru.txt')
        ]);

        const comprehensiveData = await comprehensiveResponse.json();
        const namesEnText = await namesEnResponse.text();
        const namesRuText = await namesRuResponse.text();

        colorData.ralClassic = parseClassicWithLRV(comprehensiveData, namesEnText, namesRuText);
        colorData.loaded.classic = true;

    } catch (error) {
        console.error('Failed to load enhanced RAL Classic, falling back to basic:', error);
        await loadBasicRALClassic();
    }
}

function parseClassicWithLRV(comprehensiveData, namesEnText, namesRuText) {
    const classicColors = [];
    const enLines = namesEnText.split('\n');
    const ruLines = namesRuText.split('\n');

    // Create Russian names mapping
    const ruNamesMap = {};
    ruLines.forEach(line => {
        const match = line.match(/^(RAL \d+)\s+(.+)$/);
        if (match) {
            ruNamesMap[match[1]] = match[2];
        }
    });

    enLines.forEach(line => {
        const match = line.match(/^(RAL \d+)\s+(.+)$/);
        if (match) {
            const code = match[1];
            const nameEn = match[2];
            const nameRu = ruNamesMap[code] || nameEn; // Fallback to English if Russian not available
            const comprehensive = comprehensiveData[code];

            if (comprehensive) {
                const rgb = {
                    r: comprehensive.rgb[0],
                    g: comprehensive.rgb[1],
                    b: comprehensive.rgb[2]
                };

                classicColors.push({
                    code: code,
                    name: nameEn, // Keep English as primary name for display
                    nameRu: nameRu, // Add Russian name
                    hex: comprehensive.hex,
                    rgb: rgb,
                    lrv: calculateLRVFromHex(comprehensive.hex),
                    hue: getHueCategory(rgb.r, rgb.g, rgb.b),
                    lab: rgbToLab(rgb.r, rgb.g, rgb.b),
                    catalog: 'classic'
                });
            }
        }
    });

    return classicColors;
}

async function loadBasicRALClassic() {
    // Fallback basic loading if enhanced fails
    const [enResponse, ruResponse] = await Promise.all([
        fetch('https://yus.github.io/RAL/ral-classic-colour-names-en.txt'),
        fetch('https://yus.github.io/RAL/ral-classic-colour-names-ru.txt')
    ]);

    const enText = await enResponse.text();
    const ruText = await ruResponse.text();

    colorData.ralClassic = parseBasicClassic(enText, ruText);
    colorData.loaded.classic = true;
}

function parseBasicClassic(enText, ruText) {
    const classicColors = [];
    const enLines = enText.split('\n');
    const ruLines = ruText.split('\n');

    // Create Russian names mapping
    const ruNamesMap = {};
    ruLines.forEach(line => {
        const match = line.match(/^(RAL \d+)\s+(.+)$/);
        if (match) {
            ruNamesMap[match[1]] = match[2];
        }
    });

    enLines.forEach(line => {
        const match = line.match(/^(RAL \d+)\s+(.+)$/);
        if (match) {
            const code = match[1];
            const nameEn = match[2];
            const nameRu = ruNamesMap[code] || nameEn;
            const rgb = generateRGBFromRALClassic(code);

            classicColors.push({
                code: code,
                name: nameEn,
                nameRu: nameRu,
                rgb: rgb,
                lrv: 50,
                hue: getHueCategory(rgb.r, rgb.g, rgb.b),
                lab: rgbToLab(rgb.r, rgb.g, rgb.b),
                catalog: 'classic'
            });
        }
    });

    return classicColors;
}

// LRV calculation
function calculateLRVFromHex(hex) {
    const rgb = hexToRgb(hex.replace('#', ''));
    if (!rgb) return 50;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    return Math.round(luminance * 100);
}

// Event listeners
function setupEventListeners() {
    // RGB inputs
    elements.redSlider.addEventListener('input', updateRed);
    elements.redInput.addEventListener('input', updateRed);
    elements.greenSlider.addEventListener('input', updateGreen);
    elements.greenInput.addEventListener('input', updateGreen);
    elements.blueSlider.addEventListener('input', updateBlue);
    elements.blueInput.addEventListener('input', updateBlue);
    elements.hexInput.addEventListener('input', updateFromHex);

    // CMYK inputs
    elements.cyanSlider.addEventListener('input', updateCyan);
    elements.cyanInput.addEventListener('input', updateCyan);
    elements.magentaSlider.addEventListener('input', updateMagenta);
    elements.magentaInput.addEventListener('input', updateMagenta);
    elements.yellowSlider.addEventListener('input', updateYellow);
    elements.yellowInput.addEventListener('input', updateYellow);
    elements.blackSlider.addEventListener('input', updateBlack);
    elements.blackInput.addEventListener('input', updateBlack);
    elements.cmykInput.addEventListener('input', updateFromCmyk);

    // Settings
    elements.resultsCount.addEventListener('input', updateResultsCount);
    elements.maxDifference.addEventListener('input', updateMaxDifference);
    elements.findMatches.addEventListener('click', findMatchingColors);
    elements.themeToggle.addEventListener('click', toggleTheme);

    // History
    elements.clearHistory.addEventListener('click', clearHistory);
    elements.catalogClearHistory.addEventListener('click', clearHistory);
    elements.classicClearHistory.addEventListener('click', clearHistory);

    // // Catalog search and filters
    // elements.catalogSearch.addEventListener('input', () => filterCatalog('designPlus'));
    // elements.classicSearch.addEventListener('input', () => filterCatalog('classic'));

    // elements.hueButtons.forEach(button => {
    //     button.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         const hue = button.getAttribute('data-hue');

    //         elements.hueButtons.forEach(btn => btn.classList.remove('active'));
    //         button.classList.add('active');

    //         if (hue === 'all') {
    //             window.scrollTo({ top: 0, behavior: 'smooth' });
    //             elements.catalogSearch.value = '';
    //             elements.classicSearch.value = '';
    //             filterCatalog('designPlus');
    //             filterCatalog('classic');
    //         } else {
    //             const section = document.getElementById(`section-${hue}`);
    //             if (section) {
    //                 section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //             }
    //         }
    //     });
    // });
    // Catalog search - ONLY if element exists
    if (elements.catalogSearch) {
        elements.catalogSearch.addEventListener('input', () => filterCatalog('designPlus'));
    }

    // Classic search - ONLY if element exists  
    if (elements.classicSearch) {
        elements.classicSearch.addEventListener('input', () => filterCatalog('classic'));
    }

    // Hue buttons - ONLY if they exist
    if (elements.hueButtons && elements.hueButtons.length > 0) {
        elements.hueButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // ... your existing hue button code ...
                e.preventDefault();
                const hue = button.getAttribute('data-hue');
    
                elements.hueButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
    
                if (hue === 'all') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    elements.catalogSearch.value = '';
                    elements.classicSearch.value = '';
                    filterCatalog('designPlus');
                    filterCatalog('classic');
                } else {
                    const section = document.getElementById(`section-${hue}`);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    elements.themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
}

// Color matching and display functions
function findMatchingColors() {
    if (!colorData.loaded.designPlus && !colorData.loaded.classic) {
        elements.resultsContainer.innerHTML = '<div class="loading">Still loading color data...</div>';
        return;
    }

    const inputRgb = {
        r: parseInt(elements.redInput.value),
        g: parseInt(elements.greenInput.value),
        b: parseInt(elements.blueInput.value)
    };

    const inputLab = rgbToLab(inputRgb.r, inputRgb.g, inputRgb.b);
    const resultsCount = parseInt(elements.resultsCount.value) || 12;
    const maxDifference = parseInt(elements.maxDifference.value) || 100;
    const colorSpace = elements.colorSpace.value;

    // Get selected catalogs
    const searchDesignPlus = elements.searchRALDS.checked;
    const searchClassic = elements.searchRALClassic.checked;

    let allColors = [];

    if (searchDesignPlus && colorData.loaded.designPlus) {
        allColors = allColors.concat(colorData.ralDesignPlus.map(color => ({
            ...color,
            catalog: 'designPlus'
        })));
    }

    if (searchClassic && colorData.loaded.classic) {
        allColors = allColors.concat(colorData.ralClassic.map(color => ({
            ...color,
            catalog: 'classic'
        })));
    }

    if (allColors.length === 0) {
        elements.resultsContainer.innerHTML = '<p>No catalogs selected or loaded.</p>';
        return;
    }

    const colorsWithDifferences = allColors.map(color => {
        let difference;
        if (colorSpace === 'cie76' && color.lab) {
            difference = colorDifferenceLab(inputLab, color.lab);
        } else {
            difference = colorDifferenceRgb(inputRgb, color.rgb);
        }

        return {
            ...color,
            difference: difference,
            cmyk: rgbToCmyk(color.rgb.r, color.rgb.g, color.rgb.b)
        };
    }).filter(color => color.difference <= maxDifference);

    colorsWithDifferences.sort((a, b) => a.difference - b.difference);
    const topMatches = colorsWithDifferences.slice(0, resultsCount);

    displayResults(topMatches);
}

function displayResults(matches) {
    elements.resultsContainer.innerHTML = '';

    if (matches.length === 0) {
        elements.resultsContainer.innerHTML = '<p>No matching colors found.</p>';
        return;
    }

    matches.forEach(match => {
        const colorCard = createColorCard(match, true);
        elements.resultsContainer.appendChild(colorCard);
    });
}

function displayCatalog() {
    if (!colorData.loaded.designPlus) return;
    displayCatalogSection(colorData.ralDesignPlus, elements.catalogContainer, 'designPlus');
}

function displayClassicCatalog() {
    if (!colorData.loaded.classic) return;
    displayCatalogSection(colorData.ralClassic, elements.classicContainer, 'classic');
}

function displayCatalogSection(colors, container, catalogType) {
    const hueCategories = {
        red: [], orange: [], yellow: [], green: [], blue: [], purple: [], neutral: [], gray: []
    };

    colors.forEach(color => {
        if (hueCategories[color.hue]) {
            hueCategories[color.hue].push(color);
        } else {
            hueCategories.neutral.push(color);
        }
    });

    Object.keys(hueCategories).forEach(hue => {
        hueCategories[hue].sort((a, b) => a.code.localeCompare(b.code));
    });

    container.innerHTML = '';

    const categoryOrder = catalogType === 'classic' ?
        ['yellow', 'orange', 'red', 'blue', 'green', 'gray', 'neutral'] :
        ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'neutral'];

    categoryOrder.forEach(hue => {
        if (hueCategories[hue].length === 0) return;

        const section = document.createElement('div');
        section.id = `section-${hue}`;
        section.className = 'catalog-section';

        const header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = `${hue.charAt(0).toUpperCase() + hue.slice(1)} Colors (${hueCategories[hue].length})`;
        section.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'catalog-grid';

        hueCategories[hue].forEach(color => {
            const card = createColorCard(color, false);
            grid.appendChild(card);
        });

        section.appendChild(grid);
        container.appendChild(section);
    });
}

function createColorCard(color, isMatcher) {
    const card = document.createElement('div');
    card.className = 'color-card';
    card.id = `color-${color.code.replace(/\s+/g, '-')}`;

    card.addEventListener('click', () => {
        copyToClipboard(color.code);

        card.classList.add('search-highlight');
        setTimeout(() => {
            card.classList.remove('search-highlight');
        }, 2000);
    });

    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'color-swatch';
    colorSwatch.style.backgroundColor = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;

    const brightness = (color.rgb.r * 299 + color.rgb.g * 587 + color.rgb.b * 114) / 1000;
    colorSwatch.style.color = brightness > 128 ? 'black' : 'white';
    colorSwatch.innerHTML = `
        <div>${color.code}</div>
        <div style="font-size: 0.8rem;">Click to copy</div>
    `;

    // Catalog badge
    if (!isMatcher) {
        const catalogBadge = document.createElement('div');
        catalogBadge.className = 'catalog-badge';
        catalogBadge.textContent = color.catalog === 'classic' ? 'CLASSIC' : 'DS+';
        colorSwatch.appendChild(catalogBadge);
    }

    // LRV badge for Classic
    if (color.catalog === 'classic' && color.lrv) {
        const lrvBadge = document.createElement('div');
        lrvBadge.className = 'lrv-value';
        lrvBadge.textContent = `LRV: ${color.lrv}`;
        colorSwatch.appendChild(lrvBadge);
    }

    const colorInfo = document.createElement('div');
    colorInfo.className = 'color-info';

    const colorCode = document.createElement('div');
    colorCode.className = 'color-code';
    colorCode.textContent = color.code;

    const colorName = document.createElement('div');
    colorName.className = 'color-name';
    colorName.textContent = color.name;

    // Add Russian name for Classic colors
    if (color.catalog === 'classic' && color.nameRu) {
        const colorNameRu = document.createElement('div');
        colorNameRu.className = 'color-name-ru';
        colorNameRu.textContent = color.nameRu;
        colorInfo.appendChild(colorNameRu);
    }

    const colorValues = document.createElement('div');
    colorValues.className = 'color-values';
    colorValues.innerHTML = `
        <div class="value-group">
            <div class="value-label">RGB</div>
            <div>${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}</div>
        </div>
        <div class="value-group">
            <div class="value-label">CMYK</div>
            <div>${Math.round(color.cmyk.c * 100)}%, ${Math.round(color.cmyk.m * 100)}%, ${Math.round(color.cmyk.y * 100)}%, ${Math.round(color.cmyk.k * 100)}%</div>
        </div>
    `;

    colorInfo.appendChild(colorCode);
    colorInfo.appendChild(colorName);
    colorInfo.appendChild(colorValues);

    if (isMatcher) {
        const difference = document.createElement('div');
        difference.className = 'difference';
        if (color.difference < 30) difference.classList.add('difference-low');
        else if (color.difference < 70) difference.classList.add('difference-medium');
        else difference.classList.add('difference-high');
        difference.textContent = `Color difference: ${color.difference.toFixed(2)}`;
        colorInfo.appendChild(difference);
    }

    card.appendChild(colorSwatch);
    card.appendChild(colorInfo);

    return card;
}

// Filtering
function filterCatalog(catalogType) {
    const searchTerm = (catalogType === 'classic' ? elements.classicSearch : elements.catalogSearch).value.toLowerCase().trim();
    const container = catalogType === 'classic' ? elements.classicContainer : elements.catalogContainer;
    const colors = catalogType === 'classic' ? colorData.ralClassic : colorData.ralDesignPlus;

    if (!container) return;

    if (!searchTerm) {
        container.querySelectorAll('.color-card').forEach(card => {
            card.style.display = 'block';
        });
        container.querySelectorAll('.catalog-section').forEach(section => {
            section.style.display = 'block';
        });
        return;
    }

    let foundAny = false;

    container.querySelectorAll('.color-card').forEach(card => {
        const codeElement = card.querySelector('.color-code');
        const nameElement = card.querySelector('.color-name');

        if (!codeElement) return;

        const code = codeElement.textContent.toLowerCase();
        const name = nameElement ? nameElement.textContent.toLowerCase() : '';

        const matches = code.includes(searchTerm) || name.includes(searchTerm);

        if (matches) {
            card.style.display = 'block';
            foundAny = true;
            card.classList.add('search-highlight');
            setTimeout(() => card.classList.remove('search-highlight'), 2000);
        } else {
            card.style.display = 'none';
        }
    });

    // Hide empty sections
    container.querySelectorAll('.catalog-section').forEach(section => {
        const hasVisible = Array.from(section.querySelectorAll('.color-card'))
            .some(card => card.style.display !== 'none');
        section.style.display = hasVisible ? 'block' : 'none';
    });

    // Auto-scroll to first match
    if (foundAny) {
        const firstVisible = container.querySelector('.color-card[style="display: block;"], .color-card:not([style])');
        if (firstVisible) {
            firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Copy and history functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showCopyNotification();

        if (text.startsWith('RAL')) {
            addToHistory(text);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyNotification();

        if (text.startsWith('RAL')) {
            addToHistory(text);
        }
    });
}

function showCopyNotification() {
    elements.copyNotification.classList.add('show');
    setTimeout(() => {
        elements.copyNotification.classList.remove('show');
    }, 2000);
}

function addToHistory(ralCode) {
    colorData.copyHistory = colorData.copyHistory.filter(code => code !== ralCode);
    colorData.copyHistory.unshift(ralCode);

    if (colorData.copyHistory.length > 10) {
        colorData.copyHistory = colorData.copyHistory.slice(0, 10);
    }

    updateHistoryDisplay();
}

function clearHistory() {
    colorData.copyHistory = [];
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const hasHistory = colorData.copyHistory.length > 0;

    // Update all history sections
    [elements.historySection, elements.catalogHistorySection, elements.classicHistorySection].forEach(section => {
        if (section) section.style.display = hasHistory ? 'block' : 'none';
    });

    [elements.clearHistory, elements.catalogClearHistory, elements.classicClearHistory].forEach(clearBtn => {
        if (clearBtn) clearBtn.style.display = hasHistory ? 'block' : 'none';
    });

    if (hasHistory) {
        updateBreadcrumb(elements.historyBreadcrumb, colorData.copyHistory, false);
        updateBreadcrumb(elements.catalogHistoryBreadcrumb, colorData.copyHistory, false);
        updateBreadcrumb(elements.classicHistoryBreadcrumb, colorData.copyHistory, false);
    } else {
        [elements.historyBreadcrumb, elements.catalogHistoryBreadcrumb, elements.classicHistoryBreadcrumb].forEach(breadcrumb => {
            if (breadcrumb) breadcrumb.innerHTML = '';
        });
    }
}

function updateBreadcrumb(breadcrumbElement, items, isPinned) {
    if (!breadcrumbElement) return;

    breadcrumbElement.innerHTML = '';

    items.forEach(ralCode => {
        const color = [...colorData.ralDesignPlus, ...colorData.ralClassic].find(c => c.code === ralCode);
        const rgb = color ? color.rgb : { r: 128, g: 128, b: 128 };

        const historyItem = document.createElement('div');
        historyItem.className = 'history-swatch';
        historyItem.innerHTML = `
            <div class="history-color" style="background-color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})"></div>
            <span>${ralCode}</span>
        `;

        historyItem.addEventListener('click', () => {
            copyToClipboard(ralCode);
        });

        breadcrumbElement.appendChild(historyItem);
    });

    // Add "Copy All" button
    if (items.length > 0) {
        const copyAllButton = document.createElement('button');
        copyAllButton.className = 'history-copy-all';
        copyAllButton.textContent = 'Copy All';
        copyAllButton.addEventListener('click', () => {
            const allCodes = items.join(', ');
            copyToClipboard(allCodes);
        });
        breadcrumbElement.appendChild(copyAllButton);
    }
}

// Utility functions (from previous implementation)
function parseRALTextFileImproved(text, language) {
    const colors = [];
    const lines = text.split('\n');

    let currentCode = '';
    let emptyLineCount = 0;
    let lineType = 'expectingCode';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '') {
            emptyLineCount++;
            if (emptyLineCount === 2 && currentCode) {
                lineType = 'expectingName';
                emptyLineCount = 0;
            }
            continue;
        }

        emptyLineCount = 0;

        if (lineType === 'expectingCode') {
            if (line.match(/^\d{3}\s+\d{2}\s+\d{2}$/)) {
                currentCode = `RAL ${line}`;
            }
        } else if (lineType === 'expectingName') {
            const currentName = line;
            const rgb = generateRGBFromRALCode(currentCode);
            colors.push({
                code: currentCode,
                name: currentName,
                language: language,
                rgb: rgb,
                hue: getHueCategory(rgb.r, rgb.g, rgb.b),
                lab: rgbToLab(rgb.r, rgb.g, rgb.b),
                catalog: 'designPlus'
            });
            currentCode = '';
            lineType = 'expectingCode';
        }
    }

    return colors;
}

function mergeColorData(enColors, ruColors) {
    const mergedMap = new Map();

    enColors.forEach(color => {
        mergedMap.set(color.code, {
            code: color.code,
            name: color.name,
            rgb: color.rgb,
            hue: color.hue,
            lab: color.lab,
            catalog: 'designPlus'
        });
    });

    ruColors.forEach(color => {
        if (mergedMap.has(color.code)) {
            mergedMap.get(color.code).nameRu = color.name;
        }
    });

    return Array.from(mergedMap.values());
}

// All the color conversion functions from before (rgbToHex, hexToRgb, rgbToCmyk, cmykToRgb, rgbToLab, etc.)
// ... include all your existing color conversion functions here ...

    function showError(message, container, retryFunction) {
        if (!container) return;

        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                ${retryFunction ? `<button onclick="${retryFunction}">Retry</button>` : ''}
            </div>
        `;
        container.style.display = 'block';
    }

    // Load sample data as fallback
    function loadSampleData() {
        console.log('Loading sample data as fallback...');

        // Create a comprehensive sample dataset
        const sampleColors = [];

        // Generate sample RAL colors across the spectrum
        const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
        const lightness = [20, 30, 40, 50, 60, 70, 80];
        const chroma = [0, 20, 40, 60, 80];

        let count = 0;
        for (let h = 0; h < hues.length && count < 100; h++) {
            for (let l = 0; l < lightness.length && count < 100; l++) {
                for (let c = 0; c < chroma.length && count < 100; c++) {
                    const hue = hues[h];
                    const light = lightness[l];
                    const chrom = chroma[c];

                    const code = `RAL ${hue.toString().padStart(3, '0')} ${light} ${chrom}`;
                    const rgb = hlcToRgb(hue, light, chrom);

                    sampleColors.push({
                        code: code,
                        nameEn: `Sample Color ${count + 1}`,
                        nameRu: `Пример цвета ${count + 1}`,
                        rgb: rgb,
                        hue: getHueCategory(rgb.r, rgb.g, rgb.b),
                        lab: rgbToLab(rgb.r, rgb.g, rgb.b)
                    });

                    count++;
                }
            }
        }

        colorData.ralColors = sampleColors;
        colorData.loaded = true;

        console.log(`Loaded ${sampleColors.length} sample colors`);

        // Update UI
        elements.loadingIndicator.style.display = 'none';
        elements.catalogLoading.style.display = 'none';

        // Show info message about using sample data
        const sampleMessage = 'Using sample color data. The RAL text files could not be loaded. You can still test all features with these sample colors.';
        showError(sampleMessage, elements.errorContainer, 'retryLoadColorData()');
        showError(sampleMessage, elements.catalogErrorContainer, 'retryLoadColorData()');

        // Enable the find matches button
        findMatchingColors();
        displayCatalog();
    }

    // Generate RGB values from RAL H L C code
    function generateRGBFromRALCode(code) {
        // Extract H, L, C from "RAL H L C" format
        const matches = code.match(/RAL\s+(\d+)\s+(\d+)\s+(\d+)/);
        if (!matches) {
            return { r: 128, g: 128, b: 128 }; // Default gray
        }

        const h = parseInt(matches[1]); // Hue (0-360)
        const l = parseInt(matches[2]); // Lightness (0-100)
        const c = parseInt(matches[3]); // Chroma (0-100)

        // Convert HLC to RGB
        return hlcToRgb(h, l, c);
    }

    // Convert HLC to RGB
    function hlcToRgb(h, l, c) {
        // Normalize values
        const hue = (h % 360) * Math.PI / 180;
        const lightness = l / 100;
        const chroma = c / 100;

        // Convert HLC to RGB using better algorithm
        let r, g, b;

        if (chroma === 0) {
            // Grayscale
            r = g = b = lightness;
        } else {
            // Convert to HSL-like coordinates then to RGB
            const hPrime = hue;
            const x = chroma * (1 - Math.abs((hPrime / (Math.PI/3)) % 2 - 1));

            let r1, g1, b1;
            if (hPrime < Math.PI/3) {
                [r1, g1, b1] = [chroma, x, 0];
            } else if (hPrime < 2*Math.PI/3) {
                [r1, g1, b1] = [x, chroma, 0];
            } else if (hPrime < Math.PI) {
                [r1, g1, b1] = [0, chroma, x];
            } else if (hPrime < 4*Math.PI/3) {
                [r1, g1, b1] = [0, x, chroma];
            } else if (hPrime < 5*Math.PI/3) {
                [r1, g1, b1] = [x, 0, chroma];
            } else {
                [r1, g1, b1] = [chroma, 0, x];
            }

            const m = lightness - chroma/2;
            r = r1 + m;
            g = g1 + m;
            b = b1 + m;

            // Clamp values
            r = Math.max(0, Math.min(1, r));
            g = Math.max(0, Math.min(1, g));
            b = Math.max(0, Math.min(1, b));
        }

        // Convert to 0-255 range
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    // Get hue category for filtering
    function getHueCategory(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        if (delta === 0) return 'neutral';

        let hue;
        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }

        hue = Math.round(hue * 60);
        if (hue < 0) hue += 360;

        // Define hue ranges for categories
        if ((hue >= 0 && hue < 15) || (hue >= 345 && hue <= 360)) return 'red';
        if (hue >= 15 && hue < 45) return 'orange';
        if (hue >= 45 && hue < 75) return 'yellow';
        if (hue >= 75 && hue < 165) return 'green';
        if (hue >= 165 && hue < 195) return 'blue';
        if (hue >= 195 && hue < 285) return 'purple';
        if (hue >= 285 && hue < 345) return 'purple';
        return 'neutral';
    }

    // Update settings
    function updateResultsCount() {
        elements.resultsCountValue.textContent = elements.resultsCount.value;
    }

    function updateMaxDifference() {
        elements.maxDifferenceValue.textContent = elements.maxDifference.value;
    }

    // RGB update functions
    function updateRed() {
        const value = Math.min(255, Math.max(0, parseInt(elements.redSlider.value) || 0));
        elements.redSlider.value = value;
        elements.redInput.value = value;
        updateColorFromRGB();
    }

    function updateGreen() {
        const value = Math.min(255, Math.max(0, parseInt(elements.greenSlider.value) || 0));
        elements.greenSlider.value = value;
        elements.greenInput.value = value;
        updateColorFromRGB();
    }

    function updateBlue() {
        const value = Math.min(255, Math.max(0, parseInt(elements.blueSlider.value) || 0));
        elements.blueSlider.value = value;
        elements.blueInput.value = value;
        updateColorFromRGB();
    }

    // CMYK update functions
    function updateCyan() {
        const value = Math.min(100, Math.max(0, parseInt(elements.cyanSlider.value) || 0));
        elements.cyanSlider.value = value;
        elements.cyanInput.value = value;
        updateColorFromCMYK();
    }

    function updateMagenta() {
        const value = Math.min(100, Math.max(0, parseInt(elements.magentaSlider.value) || 0));
        elements.magentaSlider.value = value;
        elements.magentaInput.value = value;
        updateColorFromCMYK();
    }

    function updateYellow() {
        const value = Math.min(100, Math.max(0, parseInt(elements.yellowSlider.value) || 0));
        elements.yellowSlider.value = value;
        elements.yellowInput.value = value;
        updateColorFromCMYK();
    }

    function updateBlack() {
        const value = Math.min(100, Math.max(0, parseInt(elements.blackSlider.value) || 0));
        elements.blackSlider.value = value;
        elements.blackInput.value = value;
        updateColorFromCMYK();
    }

    // Color conversion and update functions
    function updateColorFromRGB() {
        const r = parseInt(elements.redInput.value);
        const g = parseInt(elements.greenInput.value);
        const b = parseInt(elements.blueInput.value);

        const hex = rgbToHex(r, g, b);
        elements.hexInput.value = hex;

        const cmyk = rgbToCmyk(r, g, b);
        updateCmykInputs(cmyk);

        updateColorPreview();
    }

    function updateColorFromCMYK() {
        const c = parseInt(elements.cyanInput.value) / 100;
        const m = parseInt(elements.magentaInput.value) / 100;
        const y = parseInt(elements.yellowInput.value) / 100;
        const k = parseInt(elements.blackInput.value) / 100;

        elements.cmykInput.value = `${Math.round(c*100)},${Math.round(m*100)},${Math.round(y*100)},${Math.round(k*100)}`;

        const rgb = cmykToRgb(c, m, y, k);
        updateRgbInputs(rgb);

        updateColorPreview();
    }

    function updateFromHex() {
        const hex = elements.hexInput.value.replace('#', '');

        if (hex.length === 3 || hex.length === 6) {
            const rgb = hexToRgb(hex);
            if (rgb) {
                updateRgbInputs(rgb);
                const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
                updateCmykInputs(cmyk);
                updateColorPreview();
            }
        }
    }

    function updateFromCmyk() {
        const cmykStr = elements.cmykInput.value;
        const parts = cmykStr.split(',').map(part => parseInt(part.trim()));

        if (parts.length === 4 && parts.every(p => !isNaN(p) && p >= 0 && p <= 100)) {
            const [c, m, y, k] = parts;
            elements.cyanInput.value = c;
            elements.cyanSlider.value = c;
            elements.magentaInput.value = m;
            elements.magentaSlider.value = m;
            elements.yellowInput.value = y;
            elements.yellowSlider.value = y;
            elements.blackInput.value = k;
            elements.blackSlider.value = k;

            updateColorFromCMYK();
        }
    }

    function updateRgbInputs(rgb) {
        elements.redSlider.value = rgb.r;
        elements.redInput.value = rgb.r;
        elements.greenSlider.value = rgb.g;
        elements.greenInput.value = rgb.g;
        elements.blueSlider.value = rgb.b;
        elements.blueInput.value = rgb.b;
        elements.hexInput.value = rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    function updateCmykInputs(cmyk) {
        elements.cyanInput.value = Math.round(cmyk.c * 100);
        elements.cyanSlider.value = Math.round(cmyk.c * 100);
        elements.magentaInput.value = Math.round(cmyk.m * 100);
        elements.magentaSlider.value = Math.round(cmyk.m * 100);
        elements.yellowInput.value = Math.round(cmyk.y * 100);
        elements.yellowSlider.value = Math.round(cmyk.y * 100);
        elements.blackInput.value = Math.round(cmyk.k * 100);
        elements.blackSlider.value = Math.round(cmyk.k * 100);
        elements.cmykInput.value = `${Math.round(cmyk.c * 100)},${Math.round(cmyk.m * 100)},${Math.round(cmyk.y * 100)},${Math.round(cmyk.k * 100)}`;
    }

    function updateColorPreview() {
        const r = parseInt(elements.redInput.value);
        const g = parseInt(elements.greenInput.value);
        const b = parseInt(elements.blueInput.value);
        const cmyk = rgbToCmyk(r, g, b);

        elements.colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        elements.colorPreview.style.color = brightness > 128 ? 'black' : 'white';

        elements.colorPreview.innerHTML = `
            <div class="preview-values">
                <div class="preview-group">
                    <div class="preview-label">RGB</div>
                    <div>${r}, ${g}, ${b}</div>
                </div>
                <div class="preview-group">
                    <div class="preview-label">CMYK</div>
                    <div>${Math.round(cmyk.c * 100)}%, ${Math.round(cmyk.m * 100)}%, ${Math.round(cmyk.y * 100)}%, ${Math.round(cmyk.k * 100)}%</div>
                </div>
            </div>
        `;
    }

    // Color conversion functions
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function hexToRgb(hex) {
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToCmyk(r, g, b) {
        if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 1 };
        const rPrime = r / 255, gPrime = g / 255, bPrime = b / 255;
        const k = 1 - Math.max(rPrime, gPrime, bPrime);
        return {
            c: (1 - rPrime - k) / (1 - k) || 0,
            m: (1 - gPrime - k) / (1 - k) || 0,
            y: (1 - bPrime - k) / (1 - k) || 0,
            k: k || 0
        };
    }

    function cmykToRgb(c, m, y, k) {
        return {
            r: Math.round(255 * (1 - c) * (1 - k)),
            g: Math.round(255 * (1 - m) * (1 - k)),
            b: Math.round(255 * (1 - y) * (1 - k))
        };
    }

    function rgbToLab(r, g, b) {
        // Simplified Lab conversion for color difference
        const rLinear = r / 255;
        const gLinear = g / 255;
        const bLinear = b / 255;

        const x = rLinear * 0.4124 + gLinear * 0.3576 + bLinear * 0.1805;
        const y = rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722;
        const z = rLinear * 0.0193 + gLinear * 0.1192 + bLinear * 0.9505;

        return {
            l: Math.max(0, Math.min(100, y * 100)),
            a: Math.max(-128, Math.min(127, (x - y) * 200)),
            b: Math.max(-128, Math.min(127, (y - z) * 200))
        };
    }

    // Color matching functions
    function colorDifferenceRgb(rgb1, rgb2) {
        const rDiff = rgb1.r - rgb2.r, gDiff = rgb1.g - rgb2.g, bDiff = rgb1.b - rgb2.b;
        return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    }

    function colorDifferenceLab(lab1, lab2) {
        const lDiff = lab1.l - lab2.l, aDiff = lab1.a - lab2.a, bDiff = lab1.b - lab2.b;
        return Math.sqrt(lDiff * lDiff + aDiff * aDiff + bDiff * bDiff);
    }

    function findMatchingColors() {
        if (!colorData.loaded) {
            elements.resultsContainer.innerHTML = '<div class="loading">Still loading color data...</div>';
            return;
        }

        const inputRgb = {
            r: parseInt(elements.redInput.value),
            g: parseInt(elements.greenInput.value),
            b: parseInt(elements.blueInput.value)
        };

        const inputLab = rgbToLab(inputRgb.r, inputRgb.g, inputRgb.b);
        const resultsCount = parseInt(elements.resultsCount.value) || 12;
        const maxDifference = parseInt(elements.maxDifference.value) || 100;
        const colorSpace = elements.colorSpace.value;

        const colorsWithDifferences = colorData.ralColors.map(color => {
            let difference;
            if (colorSpace === 'cie76' && color.lab) {
                difference = colorDifferenceLab(inputLab, color.lab);
            } else {
                difference = colorDifferenceRgb(inputRgb, color.rgb);
            }

            return {
                ...color,
                difference: difference,
                cmyk: rgbToCmyk(color.rgb.r, color.rgb.g, color.rgb.b)
            };
        }).filter(color => color.difference <= maxDifference);

        colorsWithDifferences.sort((a, b) => a.difference - b.difference);
        const topMatches = colorsWithDifferences.slice(0, resultsCount);

        displayResults(topMatches);

        // Show catalog link for closest match
        if (topMatches.length > 0) {
            elements.viewCatalogLink.style.display = 'inline-block';
            elements.viewCatalogLink.onclick = (e) => {
                e.preventDefault();
                // When clicking view catalog link, copy the first match and put it in catalog search
                const firstMatchCode = topMatches[0].code;
                copyToClipboard(firstMatchCode);
                elements.catalogSearch.value = firstMatchCode;
                filterCatalog();

                // Switch to catalog page
                elements.navTabs.forEach(tab => tab.classList.remove('active'));
                document.querySelector('.nav-tab[data-page="catalog"]').classList.add('active');
                elements.pages.forEach(page => page.classList.remove('active'));
                elements.catalogPage.classList.add('active');
            };
        } else {
            elements.viewCatalogLink.style.display = 'none';
        }
    }

    function displayResults(matches) {
        elements.resultsContainer.innerHTML = '';

        if (matches.length === 0) {
            elements.resultsContainer.innerHTML = '<p>No matching colors found within the specified difference threshold. Try increasing the max difference value.</p>';
            return;
        }

        matches.forEach(match => {
            const colorCard = document.createElement('div');
            colorCard.className = 'color-card';
            colorCard.addEventListener('click', () => {
                // Copy RAL code to clipboard
                copyToClipboard(match.code);
            });

            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.backgroundColor = `rgb(${match.rgb.r}, ${match.rgb.g}, ${match.rgb.b})`;

            const brightness = (match.rgb.r * 299 + match.rgb.g * 587 + match.rgb.b * 114) / 1000;
            colorSwatch.style.color = brightness > 128 ? 'black' : 'white';
            colorSwatch.innerHTML = `
                <div>${match.code}</div>
                <div style="font-size: 0.8rem;">Click to copy</div>
            `;

            const colorInfo = document.createElement('div');
            colorInfo.className = 'color-info';

            const colorCode = document.createElement('div');
            colorCode.className = 'color-code';
            colorCode.textContent = match.code;

            const colorNameEn = document.createElement('div');
            colorNameEn.className = 'color-name';
            colorNameEn.textContent = match.nameEn || 'No English name';
            if (!match.nameEn) colorNameEn.style.color = '#999';

            const colorNameRu = document.createElement('div');
            colorNameRu.className = 'color-name-ru';
            colorNameRu.textContent = match.nameRu || 'No Russian name';
            if (!match.nameRu) colorNameRu.style.color = '#999';

            const colorValues = document.createElement('div');
            colorValues.className = 'color-values';
            colorValues.innerHTML = `
                <div class="value-group">
                    <div class="value-label">RGB</div>
                    <div>${match.rgb.r}, ${match.rgb.g}, ${match.rgb.b}</div>
                </div>
                <div class="value-group">
                    <div class="value-label">CMYK</div>
                    <div>${Math.round(match.cmyk.c * 100)}%, ${Math.round(match.cmyk.m * 100)}%, ${Math.round(match.cmyk.y * 100)}%, ${Math.round(match.cmyk.k * 100)}%</div>
                </div>
            `;

            const difference = document.createElement('div');
            difference.className = 'difference';
            if (match.difference < 30) difference.classList.add('difference-low');
            else if (match.difference < 70) difference.classList.add('difference-medium');
            else difference.classList.add('difference-high');
            difference.textContent = `Color difference: ${match.difference.toFixed(2)}`;

            colorInfo.appendChild(colorCode);
            colorInfo.appendChild(colorNameEn);
            colorInfo.appendChild(colorNameRu);
            colorInfo.appendChild(colorValues);
            colorInfo.appendChild(difference);

            colorCard.appendChild(colorSwatch);
            colorCard.appendChild(colorInfo);
            elements.resultsContainer.appendChild(colorCard);
        });
    }

    // Copy RAL code to clipboard with notification
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification();

            // Add to history if it's a RAL code
            if (text.startsWith('RAL')) {
                addToHistory(text); // Make sure this line says addToHistory, not addToHistory
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyNotification();

            if (text.startsWith('RAL')) {
                addToHistory(text); // And here too
            }
        });
    }

    // Show copy notification
    function showCopyNotification() {
        elements.copyNotification.classList.add('show');
        setTimeout(() => {
            elements.copyNotification.classList.remove('show');
        }, 2000);
    }

    // Update History
    function updateHistoryDisplay() {
        console.log('updateHistoryDisplay called');
        console.log('copyHistory:', colorData.copyHistory);
        console.log('historySection exists:', !!elements.historySection);
        console.log('catalogHistorySection exists:', !!elements.catalogHistorySection);

        const hasHistory = colorData.copyHistory.length > 0;
        console.log('hasHistory:', hasHistory);

        // Update main history sections
        elements.historySection.style.display = hasHistory ? 'block' : 'none';
        elements.catalogHistorySection.style.display = hasHistory ? 'block' : 'none';

        if (hasHistory) {
            console.log('Updating breadcrumbs with history');
            updateBreadcrumb(elements.historyBreadcrumb, colorData.copyHistory, false);
            updateBreadcrumb(elements.catalogHistoryBreadcrumb, colorData.copyHistory, false);
        }

        // Update pinned sections
        updatePinnedDisplay();
    }

    function updateBreadcrumb(breadcrumbElement, items, isPinned) {
        if (!breadcrumbElement) return;

        breadcrumbElement.innerHTML = '';

        items.forEach(ralCode => {
            const color = colorData.ralColors.find(c => c.code === ralCode);
            const rgb = color ? color.rgb : { r: 128, g: 128, b: 128 };

            const historyItem = document.createElement('div');
            historyItem.className = 'history-swatch';

            // THIS IS WHERE YOU ADD THE PIN BUTTONS:
            historyItem.innerHTML = `
                <div class="history-color" style="background-color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})"></div>
                <span>${ralCode}</span>
                ${isPinned ?
                    '<button class="unpin-btn" title="Unpin">✕</button>' :
                    '<button class="pin-btn" title="Pin">📍</button>'
                }
            `;

            // Click to copy
            historyItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('pin-btn') && !e.target.classList.contains('unpin-btn')) {
                    copyToClipboard(ralCode);
                }
            });

            // Pin/unpin button handler
            const pinBtn = historyItem.querySelector(isPinned ? '.unpin-btn' : '.pin-btn');
            pinBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHistoryPin(ralCode);
            });

            breadcrumbElement.appendChild(historyItem);
        });

        // Add "Copy All" button for main history (not pinned)
        if (!isPinned && items.length > 0) {
            const copyAllButton = document.createElement('button');
            copyAllButton.className = 'history-copy-all';
            copyAllButton.textContent = 'Copy All';
            copyAllButton.addEventListener('click', () => {
                const allCodes = items.join(', ');
                copyToClipboard(allCodes);
            });
            breadcrumbElement.appendChild(copyAllButton);
        }
    }

    // // //

    // Add this function - it was probably lost during our changes
    function addToHistory(ralCode) {
        // Remove if already exists (to avoid duplicates)
        colorData.copyHistory = colorData.copyHistory.filter(code => code !== ralCode);

        // Add to beginning of array
        colorData.copyHistory.unshift(ralCode);

        // Keep only last 10 items
        if (colorData.copyHistory.length > 10) {
            colorData.copyHistory = colorData.copyHistory.slice(0, 10);
        }

        // Update history displays
        updateHistoryDisplay();
    }

    // Also make sure clearHistory exists
    function clearHistory() {
        colorData.copyHistory = [];
        updateHistoryDisplay();
    }

    // And make sure toggleHistoryPin exists
    function toggleHistoryPin(ralCode) {
        const index = colorData.pinnedHistory.indexOf(ralCode);
        if (index > -1) {
            colorData.pinnedHistory.splice(index, 1);
        } else {
            colorData.pinnedHistory.push(ralCode);
        }
        localStorage.setItem('pinnedHistory', JSON.stringify(colorData.pinnedHistory));
        updateHistoryDisplay();
    }

    function updatePinnedDisplay() {
        const pinnedSections = [
            { section: 'historySection', breadcrumb: 'pinnedHistoryBreadcrumb' },
            { section: 'catalogHistorySection', breadcrumb: 'catalogPinnedHistoryBreadcrumb' },
            { section: 'classicHistorySection', breadcrumb: 'classicPinnedHistoryBreadcrumb' }
        ];

        pinnedSections.forEach(({ section, breadcrumb }) => {
            updatePinnedSection(section, breadcrumb);
        });
    }

    function updatePinnedSection(historySectionId, breadcrumbId) {
        const historySection = document.getElementById(historySectionId);
        if (!historySection) return;

        let pinnedSection = document.getElementById('pinned' + historySectionId);
        const hasPinned = colorData.pinnedHistory.length > 0;

        if (hasPinned) {
            if (!pinnedSection) {
                pinnedSection = document.createElement('div');
                pinnedSection.id = 'pinned' + historySectionId;
                pinnedSection.className = 'history-section';
                pinnedSection.innerHTML = `
                    <div class="history-title">
                        <span>📌 Pinned RAL Colors</span>
                        <button class="clear-history" onclick="clearPinned()">Clear Pins</button>
                    </div>
                    <div class="history-breadcrumb" id="${breadcrumbId}"></div>
                `;
                historySection.parentNode.insertBefore(pinnedSection, historySection);
            }

            const pinnedBreadcrumb = document.getElementById(breadcrumbId);
            if (pinnedBreadcrumb) {
                updateBreadcrumb(pinnedBreadcrumb, colorData.pinnedHistory, true);
            }
            pinnedSection.style.display = 'block';
        } else if (pinnedSection) {
            pinnedSection.style.display = 'none';
        }
    }

    function clearPinned() {
        colorData.pinnedHistory = [];
        localStorage.removeItem('pinnedHistory');
        updatePinnedDisplay();
    }

    // Add pin buttons to color cards
    function addPinButton(card, ralCode) {
        const pinBtn = document.createElement('button');
        pinBtn.className = 'pin-btn';
        pinBtn.innerHTML = colorData.pinnedColors.includes(ralCode) ? '📍' : '📌';
        pinBtn.title = colorData.pinnedColors.includes(ralCode) ? 'Unpin this color' : 'Pin this color';

        pinBtn.style.position = 'absolute';
        pinBtn.style.top = '10px';
        pinBtn.style.right = '10px';
        pinBtn.style.background = 'rgba(0,0,0,0)';
        pinBtn.style.border = 'none';
        pinBtn.style.borderRadius = '50%';
        pinBtn.style.width = '20px';
        pinBtn.style.height = '20px';
        pinBtn.style.cursor = 'pointer';
        pinBtn.style.fontSize = '12px';
        pinBtn.style.zIndex = '10';

        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePin(ralCode);

            // Update button appearance
            if (colorData.pinnedColors.includes(ralCode)) {
                pinBtn.innerHTML = '📍';
                pinBtn.title = 'Unpin this color';
            } else {
                pinBtn.innerHTML = '📌';
                pinBtn.title = 'Pin this color';
            }
        });

        card.style.position = 'relative';
        card.appendChild(pinBtn);
    }

    // Update createCatalogCard and displayResults to include pin buttons
    // Update the catalog card creation to match matcher design
    function createCatalogCard(color) {
        const card = document.createElement('div');
        card.className = 'color-card'; // Use same class as matcher
        card.id = `color-${color.code.replace(/\s+/g, '-')}`;
        card.addEventListener('click', () => {
            // Copy RAL code to clipboard
            copyToClipboard(color.code);

            // Update search field for user convenience, but don't filter
            // elements.catalogSearch.value = color.code;

            // Add highlight effect to the clicked card
            card.classList.add('search-highlight');
            setTimeout(() => {
                card.classList.remove('search-highlight');
            }, 2000);
        });

        const colorSwatch = document.createElement('div');
        colorSwatch.className = 'color-swatch'; // Same as matcher
        colorSwatch.style.backgroundColor = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;

        const brightness = (color.rgb.r * 299 + color.rgb.g * 587 + color.rgb.b * 114) / 1000;
        colorSwatch.style.color = brightness > 128 ? 'black' : 'white';
        colorSwatch.innerHTML = `
            <div>${color.code}</div>
            <div style="font-size: 0.8rem;">Click to copy</div>
        `;

        const colorInfo = document.createElement('div');
        colorInfo.className = 'color-info'; // Same as matcher

        const colorCode = document.createElement('div');
        colorCode.className = 'color-code';
        colorCode.textContent = color.code;

        const colorNameEn = document.createElement('div');
        colorNameEn.className = 'color-name';
        colorNameEn.textContent = color.nameEn || 'No English name';
        if (!color.nameEn) colorNameEn.style.color = '#999';

        const colorNameRu = document.createElement('div');
        colorNameRu.className = 'color-name-ru';
        colorNameRu.textContent = color.nameRu || 'No Russian name';
        if (!color.nameRu) colorNameRu.style.color = '#999';

        const colorValues = document.createElement('div');
        colorValues.className = 'color-values';
        colorValues.innerHTML = `
            <div class="value-group">
                <div class="value-label">RGB</div>
                <div>${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}</div>
            </div>
            <div class="value-group">
                <div class="value-label">CMYK</div>
                <div>${Math.round(color.cmyk.c * 100)}%, ${Math.round(color.cmyk.m * 100)}%, ${Math.round(color.cmyk.y * 100)}%, ${Math.round(color.cmyk.k * 100)}%</div>
            </div>
        `;

        colorInfo.appendChild(colorCode);
        colorInfo.appendChild(colorNameEn);
        colorInfo.appendChild(colorNameRu);
        colorInfo.appendChild(colorValues);

        card.appendChild(colorSwatch);
        card.appendChild(colorInfo);

        // Add Pins
        addPinButton(card, color.code);

        return card;
    }

    // Also update the displayCatalog function to calculate CMYK
    function displayCatalog() {
        if (!colorData.loaded || colorData.ralColors.length === 0) {
            console.log('No color data available for catalog');
            elements.catalogContainer.innerHTML = '<div class="loading">No color data available. Please check the data sources.</div>';
            return;
        }

        const hueCategories = {
            red: [], orange: [], yellow: [], green: [], blue: [], purple: [], neutral: []
        };

        // Sort colors by hue category and calculate CMYK
        colorData.ralColors.forEach(color => {
            // Calculate CMYK for catalog display
            color.cmyk = rgbToCmyk(color.rgb.r, color.rgb.g, color.rgb.b);

            if (hueCategories[color.hue]) {
                hueCategories[color.hue].push(color);
            } else {
                hueCategories.neutral.push(color);
            }
        });

        // Sort each category by RAL code for consistent ordering
        Object.keys(hueCategories).forEach(hue => {
            hueCategories[hue].sort((a, b) => a.code.localeCompare(b.code));
        });

        elements.catalogContainer.innerHTML = '';

        // Display each category
        const categoryOrder = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'neutral'];
        let totalColors = 0;

        categoryOrder.forEach(hue => {
            if (hueCategories[hue].length === 0) return;

            totalColors += hueCategories[hue].length;
            const section = document.createElement('div');
            section.id = `section-${hue}`;
            section.className = 'catalog-section';

            const header = document.createElement('div');
            header.className = 'section-header';
            header.textContent = `${hue.charAt(0).toUpperCase() + hue.slice(1)} Colors (${hueCategories[hue].length})`;
            section.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'catalog-grid';

            hueCategories[hue].forEach(color => {
                const card = createCatalogCard(color);
                grid.appendChild(card);
            });

            section.appendChild(grid);
            elements.catalogContainer.appendChild(section);
        });

        console.log(`Catalog displayed with ${totalColors} colors across ${categoryOrder.filter(hue => hueCategories[hue].length > 0).length} categories`);
    }

    // Completely rewrite filterCatalog function
    function filterCatalog() {
        const searchTerm = elements.catalogSearch.value.toLowerCase().trim();
        const catalogContainer = document.getElementById('catalogContainer');

        if (!catalogContainer) return;

        // Show all if empty search
        if (!searchTerm) {
            catalogContainer.querySelectorAll('.color-card').forEach(card => {
                card.style.display = 'block';
            });
            catalogContainer.querySelectorAll('.catalog-section').forEach(section => {
                section.style.display = 'block';
            });
            return;
        }

        let foundAny = false;

        // Search through ALL catalog cards
        catalogContainer.querySelectorAll('.color-card').forEach(card => {
            const codeElement = card.querySelector('.color-code');
            const nameEnElement = card.querySelector('.color-name');
            const nameRuElement = card.querySelector('.color-name-ru');

            if (!codeElement) return;

            const code = codeElement.textContent.toLowerCase();
            const nameEn = nameEnElement ? nameEnElement.textContent.toLowerCase() : '';
            const nameRu = nameRuElement ? nameRuElement.textContent.toLowerCase() : '';

            const matches = code.includes(searchTerm) || nameEn.includes(searchTerm) || nameRu.includes(searchTerm);

            if (matches) {
                card.style.display = 'block';
                foundAny = true;

                // Highlight the matching card
                card.classList.add('search-highlight');
                setTimeout(() => card.classList.remove('search-highlight'), 2000);
            } else {
                card.style.display = 'none';
            }
        });

        // Auto-scroll to first match
        if (foundAny) {
            const firstVisible = catalogContainer.querySelector('.color-card[style="display: block;"], .color-card:not([style])');
            if (firstVisible) {
                firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    // Make search work on Enter key too
    elements.catalogSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterCatalog();
        }
    });

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
