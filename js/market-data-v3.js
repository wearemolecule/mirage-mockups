// Sample market data - US Power products with USD currency
const marketData = [
    { product: '[ERCOT-N] ERCOT North Hub DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 14:00:00', status: 'settles' },
    { product: '[ERCOT-S] ERCOT South Hub DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 14:00:00', status: 'settles' },
    { product: '[ERCOT-H] ERCOT Houston Hub DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 14:00:00', status: 'prelims' },
    { product: '[ERCOT-W] ERCOT West Hub DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:45:00', status: 'best-available' },
    { product: '[PJM-W] PJM Western Hub DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:45:00', status: 'settles' },
    { product: '[PJM-E] PJM Eastern Hub DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:45:00', status: 'user-provided' },
    { product: '[PJM-AEP] PJM AEP Dayton DA', contract: 'Jul 2025 - Dec 2025', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Daily', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:30:00', status: 'settles' },
    { product: '[MISO-IN] MISO Indiana Hub', contract: 'Jul 2025 - Dec 2025', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Daily', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:30:00', status: 'settles' },
    { product: '[MISO-LA] MISO Louisiana Hub', contract: 'Jul 2025 - Dec 2025', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Daily', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:30:00', status: 'substituted' },
    { product: '[MISO-IL] MISO Illinois Hub', contract: 'Jul 2025 - Dec 2025', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Daily', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:30:00', status: 'prelims' },
    { product: '[CAISO-SP15] CAISO SP15', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:30:00', status: 'settles' },
    { product: '[CAISO-NP15] CAISO NP15', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:30:00', status: 'user-estimate' },
    { product: '[CAISO-ZP26] CAISO ZP26', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:15:00', status: 'best-available' },
    { product: '[NYISO-Z-A] NYISO Zone A DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:00:00', status: 'settles' },
    { product: '[NYISO-Z-G] NYISO Zone G DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:00:00', status: 'copied' },
    { product: '[NYISO-Z-J] NYISO Zone J DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:00:00', status: 'settles' },
    { product: '[SPP-NORTH] SPP North Hub', contract: 'Jul 2025 - Dec 2025', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Daily', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:00:00', status: 'prelims' },
    { product: '[SPP-SOUTH] SPP South Hub', contract: 'Jul 2025 - Dec 2025', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Daily', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:00:00', status: 'settles' },
    { product: '[ISONE-MA] ISO-NE Mass Hub DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 12:45:00', status: 'user-provided' },
    { product: '[ISONE-CT] ISO-NE Connecticut DA', contract: 'Jul 2025 - Jul 2026', instrument: 'Swaps', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: '-', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 12:45:00', status: 'best-available' },
    // Adding some options with and without volatilities for demonstration
    { product: '[PJM-W.0] PJM Western Hub Option', contract: 'Jul 2025 - Jul 2026', instrument: 'Options', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: 'Yes', strikeRange: '$1.55 – $3.35', hasVolatilities: true, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:45:00', status: 'settles' },
    { product: '[ERCOT-N.0] ERCOT North Hub Option', contract: 'Jul 2025 - Jul 2026', instrument: 'Options', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: 'Yes', strikeRange: '$0.75 – $15,000.00', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 14:00:00', status: 'settles' },
    { product: '[NYISO-Z-A.0] NYISO Zone A Option', contract: 'Jul 2025 - Jul 2026', instrument: 'Options', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: 'Yes', strikeRange: '$2.50 – $8.75', hasVolatilities: true, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:00:00', status: 'user-provided' },
    { product: '[CAISO-SP15.0] CAISO SP15 Option', contract: 'Jul 2025 - Jul 2026', instrument: 'Options', commodity: 'Power', currency: 'USD', uom: 'MWh', frequency: 'Hourly', option: 'Yes', strikeRange: '$5.25 – $12.50', hasVolatilities: false, markingOnly: '', source: 'ICE', lastUpdated: '06/09/2025 13:30:00', status: 'prelims' },
];

// Sample volatility data
const volatilityData = [
    { product: '[OPJ.0] ICE Option on PJM Western Hub Real-Time', contract: '02/01/2026 – 02/01/2026', strike: '$30.55' },
    { product: '[PHE] ICE Option on Henry Penultimate Fixed Price', contract: '12/01/2025 – 02/01/2026', strike: '$1.00, $1.10, $1.20, $1.30, $1.40, $1.50, $1.60, $1.70, $1.80, $1.90, $2.00, $2.10, $2.20, $2.30, $2.40, $2.50, $2.60, $2.70, $2.80, $2.90' },
    { product: '[B.0] ICE Brent Crude American-Style Option', contract: '02/01/2026 – 11/01/2026', strike: '$12.00, $13.00, $14.00, $15.00, $16.00, $17.00, $18.00, $19.00, $20.00, $21.00, $22.00, $23.00, $24.00, $25.00, $26.00, $27.00, $28.00, $29.00, $30.00' },
    { product: '[PMI.OPJ.0] PJM Western Hub option (PMI +OP)', contract: '07/01/2026 – 03/01/2027', strike: '$4.00, $47.20591, $50.00, $51.00, $52.00, $52.01, $53.00, $54.00, $55.00, $56.00, $57.00, $58.00, $59.00, $60.00' },
    { product: '[CL.0] ICE WTI Crude Oil American-Style Option', contract: '03/01/2026 – 03/01/2026', strike: '$65.00, $66.00, $67.00, $68.00, $69.00, $70.00, $71.00, $72.00, $73.00, $74.00, $75.00' },
    { product: '[NG.0] ICE Natural Gas American-Style Option', contract: '02/01/2026 – 05/01/2026', strike: '$2.50, $2.60, $2.70, $2.80, $2.90, $3.00, $3.10, $3.20, $3.30, $3.40, $3.50, $3.60, $3.70, $3.80, $3.90, $4.00' },
    { product: '[HO.0] ICE Heating Oil #2 American-Style Option', contract: '04/01/2026 – 06/01/2026', strike: '$2.20, $2.25, $2.30, $2.35, $2.40, $2.45, $2.50, $2.55, $2.60, $2.65, $2.70, $2.75, $2.80' },
    { product: '[RB.0] ICE RBOB Gasoline American-Style Option', contract: '03/01/2026 – 04/01/2026', strike: '$1.80, $1.85, $1.90, $1.95, $2.00, $2.05, $2.10, $2.15, $2.20, $2.25, $2.30, $2.35, $2.40, $2.45, $2.50' },
    { product: '[ERCOT-N.0] ERCOT North Hub DA Option', contract: '08/01/2026 – 12/01/2026', strike: '$25.00, $30.00, $35.00, $40.00, $45.00, $50.00, $55.00, $60.00, $65.00, $70.00, $75.00, $80.00, $85.00, $90.00, $95.00, $100.00' },
    { product: '[PJM-W.0] PJM Western Hub DA Option', contract: '09/01/2026 – 11/01/2026', strike: '$30.00, $35.00, $40.00, $45.00, $50.00, $55.00, $60.00, $65.00, $70.00, $75.00, $80.00' },
];

// Track selected rows
let selectedRows = new Set();
let selectedMarks = new Set();
let surfacesChart = null;

// Format product name with yellow short name (inside brackets only)
/* ============================================
   UTILITIES - Formatting Functions
   ============================================ */
function formatProductName(product) {
    // Match pattern like [SHORT-NAME] Rest of name
    const match = product.match(/^\[([^\]]+)\](.*)$/);
    if (match) {
        return `<span class="bracket">[</span><span class="short-name">${match[1]}</span><span class="bracket">]</span>${match[2]}`;
    }
    return product;
}

// Format option cell to show strike range for options, dash for non-options
function formatOptionCell(row) {
    // If not an option, show dash
    if (row.instrument !== 'Options' || row.option === '-') {
        return '-';
    }
    
    // For options: show strike range if available, otherwise show dash
    return row.strikeRange || '-';
}

// Format volatilities cell based on instrument type and hasVolatilities flag
function formatVolatilitiesCell(row) {
    // If not an option, show dash
    if (row.instrument !== 'Options' || row.option === '-') {
        return '-';
    }
    
    // For options: show check icon if hasVolatilities is true, X icon if false
    if (row.hasVolatilities === true) {
        return '<i class="fas fa-check" style="color: var(--color-green);"></i>';
    } else {
        return '<i class="fas fa-times" style="color: var(--color-red);"></i>';
    }
}

// Populate table
/* ============================================
   TABLES - Main Curves Grid
   ============================================ */
function populateTable() {
    const tbody = document.getElementById('data-table-body');
    tbody.innerHTML = '';

    // Add enough rows to fill the viewport (100 rows)
    for (let i = 0; i < 100; i++) {
        const dataIndex = i % marketData.length;
        const row = marketData[dataIndex];
        const tr = document.createElement('tr');
        tr.dataset.index = i;
        
        tr.innerHTML = `
            <td>
                <div class="status-cell">
                    <div class="status-indicator status-${row.status}"></div>
                    <input type="checkbox" class="row-checkbox" onchange="toggleRowSelection(${i}, this.checked)">
                </div>
            </td>
            <td><span class="product-link">${formatProductName(row.product)}</span></td>
            <td>${row.contract}</td>
            <td>${row.instrument}</td>
            <td>${row.commodity}</td>
            <td>${row.currency}</td>
            <td>${row.uom}</td>
            <td>${row.frequency}</td>
            <td>${formatOptionCell(row)}</td>
            <td style="text-align: center;">${formatVolatilitiesCell(row)}</td>
            <td>${row.markingOnly}</td>
            <td>${row.source}</td>
            <td>${row.lastUpdated}</td>
        `;
        
        // Add click handler to entire row, but exclude checkbox clicks
        tr.addEventListener('click', function(e) {
            // Don't open panel if clicking on checkbox or status indicator
            if (e.target.type === 'checkbox' || e.target.closest('.status-cell') || e.target.closest('.row-checkbox')) {
                return;
            }
            showProductDetail(dataIndex);
        });
        
        tbody.appendChild(tr);
    }
    
    updateSelectAllCheckbox();
}

// Populate Volatilities table
function populateVolatilitiesTable() {
    const tbody = document.getElementById('volatilities-table-body');
    tbody.innerHTML = '';

    // Add enough rows to fill the viewport (100 rows)
    for (let i = 0; i < 100; i++) {
        const dataIndex = i % volatilityData.length;
        const row = volatilityData[dataIndex];
        const tr = document.createElement('tr');
        tr.dataset.index = i;
        
        tr.innerHTML = `
            <td><span class="product-link">${formatProductName(row.product)}</span></td>
            <td>${row.contract}</td>
            <td>${row.strike}</td>
        `;
        
        // Add click handler to entire row
        tr.addEventListener('click', function(e) {
            showVolatilityDetail(i);
        });
        
        tbody.appendChild(tr);
    }
}

// Show volatility detail panel
function showVolatilityDetail(index) {
    const product = volatilityData[index % volatilityData.length];
    const panel = document.getElementById('volatilities-detail-panel');
    const title = document.getElementById('volatilities-detail-panel-title');
    const tableWrapper = document.querySelector('#volatilities-content .table-wrapper');
    
    // Remove previous highlights
    document.querySelectorAll('#volatilities-table-body tr').forEach(tr => {
        tr.classList.remove('selected');
    });
    
    // Highlight selected row
    const selectedRow = document.querySelector(`#volatilities-table-body tr[data-index="${index}"]`);
    if (selectedRow) {
        selectedRow.classList.add('selected');
    }
    
    // Format product name with yellow short name
    const formattedProductName = formatProductName(product.product);
    
    // Format title like "[OPJ.0] ICE Option on PJM Western Hub Real-Time 02/01/2026 – 02/01/2026"
    title.innerHTML = `${formattedProductName} ${product.contract}`;
    
    // Populate surfaces table
    populateSurfacesTable(product);
    
    // Show the panel and adjust grid width
    panel.classList.remove('hidden');
    if (tableWrapper) {
        tableWrapper.style.width = '25%';
    }
    
    // Hide pagination when panel is visible
    const contentBottom = document.querySelector('#volatilities-content .content-bottom');
    if (contentBottom) {
        contentBottom.classList.add('panel-visible');
    }
    
    // Initialize the surface chart after panel is fully visible
    setTimeout(() => {
        initSurfacesChart();
    }, 300);
}

// Close volatility detail panel
function closeVolatilityDetailPanel() {
    const panel = document.getElementById('volatilities-detail-panel');
    const tableWrapper = document.querySelector('#volatilities-content .table-wrapper');
    
    // Dispose chart
    if (surfacesChart) {
        surfacesChart.dispose();
        surfacesChart = null;
    }
    
    // Remove highlight from selected row
    document.querySelectorAll('#volatilities-table-body tr').forEach(tr => {
        tr.classList.remove('selected');
    });
    
    // Hide the panel and restore grid to full width
    panel.classList.add('hidden');
    if (tableWrapper) {
        tableWrapper.style.width = '100%';
    }
    
    // Show pagination when panel is hidden
    const contentBottom = document.querySelector('#volatilities-content .content-bottom');
    if (contentBottom) {
        contentBottom.classList.remove('panel-visible');
    }
}

// Populate Surfaces table
function populateSurfacesTable(product) {
    const tbody = document.getElementById('surfaces-table-body');
    tbody.innerHTML = '';
    
    // Generate sample surfaces data - Contract dates and volatility values
    const contracts = ['02/01/2026', '03/01/2026', '04/01/2026', '05/01/2026', '06/01/2026', '07/01/2026', '08/01/2026', '09/01/2026', '10/01/2026', '11/01/2026'];
    
    // Add enough rows to fill the grid space (100 rows)
    for (let i = 0; i < 100; i++) {
        const contractIndex = i % contracts.length;
        const contract = contracts[contractIndex];
        const volatility = (0.1 + Math.random() * 0.2).toFixed(5);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contract}</td>
            <td>${volatility}</td>
        `;
        tbody.appendChild(row);
    }
}

// Initialize Surfaces ECharts chart
function initSurfacesChart() {
    const chartDom = document.getElementById('surfaces-chart');
    if (!chartDom) return;
    
    // Ensure container has dimensions
    const rect = chartDom.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        // Wait a bit longer if container isn't ready
        setTimeout(initSurfacesChart, 200);
        return;
    }
    
    // Dispose existing chart if any
    if (surfacesChart) {
        surfacesChart.dispose();
    }
    
    // Get container dimensions
    const width = rect.width || chartDom.offsetWidth || 500;
    const height = rect.height || chartDom.offsetHeight || 400;
    
    // Set explicit dimensions
    chartDom.style.width = width + 'px';
    chartDom.style.height = height + 'px';
    chartDom.style.minHeight = '400px';
    
    surfacesChart = echarts.init(chartDom);
    
    // Generate sample data for surface chart
    const data = [];
    for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
            const x = (i / 20) * 10;
            const y = (j / 20) * 10;
            const z = Math.sin(Math.sqrt(x * x + y * y)) * 0.5 + 0.5;
            data.push([x, y, z]);
        }
    }
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            textStyle: {
                color: '#fff'
            }
        },
        visualMap: {
            max: 1,
            min: 0,
            calculable: true,
            realtime: false,
            right: 10,
            top: 'center',
            textStyle: {
                color: '#666'
            },
            inRange: {
                // Accent color gradient: Blue -> Yellow -> Orange (using accent colors)
                color: [
                    '#4dafd4', // Blue accent
                    '#5fb8c9', // Blue to cyan
                    '#71c1be', // Cyan
                    '#83cab3', // Cyan to teal
                    '#95d3a8', // Teal to green
                    '#a7dc9d', // Green to yellow-green
                    '#b9e592', // Yellow-green
                    '#cbed87', // Light yellow
                    '#dba43a', // Yellow accent (prominent)
                    '#e0a52d', // Yellow to orange
                    '#e46f16'  // Orange accent
                ]
            },
            outOfRange: {
                colorAlpha: 0.1
            }
        },
        xAxis3D: {
            type: 'value',
            min: 0,
            max: 10
        },
        yAxis3D: {
            type: 'value',
            min: 0,
            max: 10
        },
        zAxis3D: {
            type: 'value',
            min: 0,
            max: 1
        },
        grid3D: {
            boxWidth: 120,
            boxDepth: 120,
            boxHeight: 60,
            viewControl: {
                projection: 'perspective',
                autoRotate: false,
                distance: 300,
                alpha: 40,
                beta: 30,
                minDistance: 150,
                maxDistance: 600,
                rotateSensitivity: 1,
                zoomSensitivity: 1
            },
            light: {
                main: {
                    intensity: 1.2,
                    shadow: true
                },
                ambient: {
                    intensity: 0.4
                }
            }
        },
        series: [{
            type: 'surface',
            wireframe: {
                show: false
            },
            data: data,
            itemStyle: {
                opacity: 0.8
            },
            parametric: false
        }]
    };
    
    surfacesChart.setOption(option);
    
    // Resize after a short delay to ensure container is ready
    setTimeout(() => {
        if (surfacesChart) {
            surfacesChart.resize();
        }
    }, 500);
    
    // Handle resize
    const resizeHandler = function() {
        if (surfacesChart) {
            surfacesChart.resize();
        }
    };
    window.addEventListener('resize', resizeHandler);
}

// Get source color based on status
function getSourceColor(status) {
    const colorMap = {
        'best-available': '#9898a5',
        'user-provided': '#4dafd4',
        'settles': '#708c46',
        'prelims': '#e46f16',
        'substituted': '#c30000',
        'user-estimate': '#875ca6',
        'copied-prior': '#dd4d4d'
    };
    return colorMap[status] || '#9898a5';
}

// Show product detail panel
/* ============================================
   DETAIL PANEL - Product Detail Management
   ============================================ */
function showProductDetail(index, needsAttention = false) {
    const product = marketData[index];
    const panel = document.getElementById('detail-panel');
    const title = document.getElementById('detail-panel-title');
    const header = document.querySelector('#detail-panel .detail-panel-header');
    const tableWrapper = document.querySelector('.table-wrapper');
    
    // Clear all selections and close selection bar when opening detail panel
    clearSelection();
    
    // Hide filter panel first (slide up animation)
    const filterPanelToHide = document.querySelector('.filter-panel');
    if (filterPanelToHide) {
        filterPanelToHide.classList.add('hidden');
    }
    
    // Set source color for header border
    if (header && product.status) {
        const sourceColor = getSourceColor(product.status);
        header.style.setProperty('--source-color', sourceColor);
    }
    
    // Remove previous highlights
    document.querySelectorAll('#data-table-body tr').forEach(tr => {
        tr.classList.remove('selected');
    });
    
    // Highlight selected row
    const selectedRow = document.querySelector(`#data-table-body tr[data-index="${index}"]`);
    if (selectedRow) {
        selectedRow.classList.add('selected');
    }
    
    // Format product name with yellow short name (reusable function)
    const formattedProductName = formatProductName(product.product);
    
    // Format title like "[48] CME Live Cattle Future AUG 2025 - AUG 2026"
    title.innerHTML = `${formattedProductName} <span class="contract-date">${product.contract}</span>`;
    
    // Populate curve summary
    populateCurveSummary(product, needsAttention);
    
    // Show/hide tabs vs header based on whether product is an option WITH volatilities
    const optionsTab = document.getElementById('detail-options-tab');
    const detailTabsRow = document.getElementById('detail-tabs-row');
    const curvesSectionHeader = document.getElementById('curves-section-header');
    const marksSection = document.querySelector('.detail-section.marks-expanded');
    const isOption = product.instrument === 'Options' || (product.option && product.option !== '-');
    const hasVolatilities = product.hasVolatilities === true;
    
    // Get chart and placeholder elements
    const curvesChart = document.getElementById('curves-options-chart');
    const curvesChartPlaceholder = document.getElementById('curves-chart-placeholder');
    const volatilitiesChart = document.getElementById('volatilities-chart');
    
    // Show tabs only if it's an option AND has volatilities
    if (isOption && hasVolatilities) {
        // Show tabs row for option products with volatilities
        if (detailTabsRow) detailTabsRow.style.display = 'flex';
        if (curvesSectionHeader) curvesSectionHeader.style.display = 'none';
        if (marksSection) marksSection.classList.add('with-tabs');
        
        // Enable Options tab
        if (optionsTab) {
            optionsTab.classList.remove('disabled');
        }
        
        // Show chart, hide placeholder for option products
        if (curvesChart) curvesChart.style.display = 'block';
        if (curvesChartPlaceholder) curvesChartPlaceholder.style.display = 'none';
    } else {
        // Show header for non-option products OR options without volatilities
        if (detailTabsRow) detailTabsRow.style.display = 'none';
        if (curvesSectionHeader) {
            curvesSectionHeader.style.display = 'flex';
            // Set header title based on product type
            const sectionTitle = curvesSectionHeader.querySelector('.detail-section-title');
            if (sectionTitle) {
                sectionTitle.textContent = isOption ? 'Curves' : 'Curves';
            }
            
            // Update action buttons based on product type
            const addMarkBtn = document.getElementById('add-mark-btn');
            const uploadCurveBtn = document.getElementById('upload-curve-btn');
            const downloadCurveBtn = document.getElementById('download-curve-btn');
            const addMarkPlusBtn = document.getElementById('add-mark-plus-btn');
            const downloadPricesBtn = document.getElementById('download-prices-btn');
            const downloadVolsBtn = document.getElementById('download-vols-btn');
            const uploadFileBtn = document.getElementById('upload-file-btn');
            
            if (isOption) {
                // Options without volatilities: same menu as options with tabs
                // Hide old buttons, show new ones
                if (addMarkBtn) addMarkBtn.style.display = 'none';
                if (uploadCurveBtn) uploadCurveBtn.style.display = 'none';
                if (downloadCurveBtn) downloadCurveBtn.style.display = 'none';
                if (addMarkPlusBtn) addMarkPlusBtn.style.display = 'flex';
                if (downloadPricesBtn) downloadPricesBtn.style.display = 'flex';
                if (downloadVolsBtn) downloadVolsBtn.style.display = 'flex';
                if (uploadFileBtn) uploadFileBtn.style.display = 'flex';
            } else {
                // Non-options: Show original buttons
                if (addMarkBtn) addMarkBtn.style.display = 'flex';
                if (uploadCurveBtn) uploadCurveBtn.style.display = 'flex';
                if (downloadCurveBtn) downloadCurveBtn.style.display = 'flex';
                if (addMarkPlusBtn) addMarkPlusBtn.style.display = 'none';
                if (downloadPricesBtn) downloadPricesBtn.style.display = 'none';
                if (downloadVolsBtn) downloadVolsBtn.style.display = 'none';
                if (uploadFileBtn) uploadFileBtn.style.display = 'none';
            }
        }
        if (marksSection) marksSection.classList.remove('with-tabs');
        
        // Ensure curves tab content is active and options is hidden
        const curvesTabContent = document.getElementById('curves-tab-content');
        const optionsTabContent = document.getElementById('options-tab-content');
        if (curvesTabContent) curvesTabContent.classList.add('active');
        if (optionsTabContent) optionsTabContent.classList.remove('active');
        
        // Ensure we're on Curves tab (no tabs, but content structure remains)
        if (optionsTab && optionsTab.classList.contains('active')) {
            switchCurvesTab('curves');
        }
        
        // Show chart for options (even without vols), placeholder for non-options
        if (isOption) {
            // Options without volatilities still show chart
            if (curvesChart) curvesChart.style.display = 'block';
            if (curvesChartPlaceholder) curvesChartPlaceholder.style.display = 'none';
        } else {
            // Non-options show placeholder
            if (curvesChart) curvesChart.style.display = 'none';
            if (curvesChartPlaceholder) curvesChartPlaceholder.style.display = 'flex';
        }
    }
    
    // Reset chart opacity before showing panel (only for option products)
    if (curvesChart && isOption) curvesChart.style.opacity = '0';
    if (volatilitiesChart) volatilitiesChart.style.opacity = '0';
    
    // Populate curves table
    populateMarksTable(product);
    
    // Show the panel and adjust grid width (with slight delay to let filter panel slide up first)
    setTimeout(() => {
        panel.classList.remove('hidden');
        tableWrapper.style.width = '25%';
        
        // Show resize handle
        const panelResizeHandle = document.getElementById('panel-resize-handle');
        if (panelResizeHandle) {
            panelResizeHandle.style.display = 'flex';
        }
    }, 100); // Small delay to let filter panel start sliding up
    
    // Filter panel is already hidden via CSS class when detail panel is visible
    
    // Hide pagination when panel is visible
    const contentBottom = document.querySelector('.content-bottom');
    if (contentBottom) {
        contentBottom.classList.add('panel-visible');
    }
}

// Close product detail panel
function closeDetailPanel() {
    const panel = document.getElementById('detail-panel');
    const tableWrapper = document.querySelector('.table-wrapper');
    
    // Remove highlight from selected row
    document.querySelectorAll('#data-table-body tr').forEach(tr => {
        tr.classList.remove('selected');
    });
    
    // Hide the panel and restore grid to full width
    panel.classList.add('hidden');
    
    // Reset detail panel width (clear any width set during resize)
    if (panel) {
        panel.style.width = '';
    }
    
    // Reset table wrapper to full width (clear any flex/width set during resize)
    if (tableWrapper) {
        tableWrapper.style.width = '100%';
        tableWrapper.style.flex = '';
        tableWrapper.style.maxWidth = '';
    }
    
    // Hide resize handle
    const panelResizeHandle = document.getElementById('panel-resize-handle');
    if (panelResizeHandle) {
        panelResizeHandle.style.display = 'none';
    }
    
    // Show filter panel when panel is hidden (slide down animation)
    const filterPanel = document.querySelector('.filter-panel');
    if (filterPanel) {
        filterPanel.classList.remove('hidden');
        filterPanel.style.display = '';
    }
    
    // Show pagination when panel is hidden
    const contentBottom = document.querySelector('.content-bottom');
    if (contentBottom) {
        contentBottom.classList.remove('panel-visible');
    }
}

// Toggle Source section
// Toggle Refine mode between filter and search
function toggleRefineMode(section) {
    // Determine IDs based on section
    const prefix = section ? `${section}-` : '';
    const icon = document.getElementById(`${prefix}refine-toggle-icon`);
    const input = document.getElementById(`${prefix}refine-input`);
    const applyBtn = document.getElementById(`${prefix}refine-apply-btn`);
    
    if (!icon || !input || !applyBtn) return;
    
    const iconElement = icon.querySelector('i');
    const isFilterMode = iconElement.classList.contains('fa-filter');
    
    if (isFilterMode) {
        // Switch to search mode
        iconElement.classList.remove('fa-filter');
        iconElement.classList.add('fa-search');
        input.placeholder = 'Search current results';
        applyBtn.style.display = 'none';
    } else {
        // Switch to filter mode
        iconElement.classList.remove('fa-search');
        iconElement.classList.add('fa-filter');
        input.placeholder = 'Refine current results';
        applyBtn.style.display = '';
    }
}

function toggleSourceSection() {
    const sourceContent = document.getElementById('source-content');
    const sourceSection = sourceContent.closest('.detail-section');
    const marksSection = sourceSection.nextElementSibling;
    const toggleBtn = document.querySelector('.detail-section-toggle');
    const isCollapsed = sourceContent.classList.toggle('collapsed');
    sourceSection.classList.toggle('source-collapsed');
    sourceSection.classList.toggle('source-expanded', !isCollapsed);
    if (marksSection && marksSection.classList.contains('detail-section')) {
        marksSection.classList.toggle('marks-expanded', isCollapsed);
    }
    toggleBtn.innerHTML = sourceContent.classList.contains('collapsed') ? '<i class="fas fa-chevron-down"></i>' : '<i class="fas fa-chevron-up"></i>';
}

// Populate curve summary with column data
function populateCurveSummary(product, needsAttention = false) {
    const summaryMeta = document.getElementById('curve-summary-meta');
    if (!summaryMeta) return;
    
    const parts = [];
    
    // Add "Needs Attention" indicator first if from attention modal
    if (needsAttention) {
        parts.push('<i class="fas fa-exclamation-circle" style="color: #c30000;"></i> <span style="color: #c30000;">Needs Attention</span>');
    }
    
    // Add all column data with separator
    if (product.instrument && product.instrument !== '-') parts.push(product.instrument);
    if (product.commodity && product.commodity !== '-') parts.push(product.commodity);
    if (product.currency && product.currency !== '-') parts.push(product.currency);
    if (product.uom && product.uom !== '-') parts.push(product.uom);
    if (product.frequency && product.frequency !== '-') parts.push(product.frequency);
    if (product.option && product.option !== '-') parts.push(product.option);
    if (product.markingOnly) parts.push('Marking Only');
    if (product.source && product.source !== '-') parts.push(product.source);
    if (product.lastUpdated) parts.push(`Updated ${product.lastUpdated}`);
    
    summaryMeta.innerHTML = parts.join(' • ');
}

// Populate Curves table with sample data
/* ============================================
   TABLES - Curves Detail Table
   ============================================ */
function populateMarksTable(product) {
    const tbody = document.getElementById('curves-table-body');
    const thead = document.getElementById('curves-table-header');
    tbody.innerHTML = '';
    
    // Check if product is an option
    const isOption = product.instrument === 'Options' || (product.option && product.option !== '-');
    
    // Show/hide Call/Put toggle for options
    const curvesChartControls = document.getElementById('curves-chart-controls');
    if (curvesChartControls) {
        curvesChartControls.style.display = isOption ? 'block' : 'none';
    }
    
    // Update table headers based on product type
    if (isOption) {
        thead.innerHTML = `
            <tr>
                <th style="width: 35px; text-align: center;">
                        <input type="checkbox" id="curves-select-all" title="Select all" onchange="toggleCurvesSelectAll(this.checked)">
                </th>
                <th>Contract</th>
                <th>Value</th>
                <th>Mark Level</th>
                <th>Updated At</th>
                <th>Strike</th>
                <th>Call/Put</th>
            </tr>
        `;
    } else {
        thead.innerHTML = `
            <tr>
                <th style="width: 35px; text-align: center;">
                        <input type="checkbox" id="curves-select-all" title="Select all" onchange="toggleCurvesSelectAll(this.checked)">
                </th>
                <th>Contract</th>
                <th>Value</th>
                <th>Mark Level</th>
                <th>Updated</th>
            </tr>
        `;
    }
    
    // Generate sample marks data
    const months = ['January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026'];
    const baseValue = 50 + Math.random() * 50;
    
    // Add enough rows to fill the grid space (100 rows)
    const sources = ['User Provided', 'Settles', 'Prelims', 'Substituted', 'User Provided Estimate', 'Copy'];
    const statuses = ['user-provided', 'settles', 'prelims', 'substituted', 'user-estimate', 'copied-prior'];
    
    if (isOption) {
        // Generate option marks data with Strike and Call/Put columns
        const strikes = ['0.00', '100.00', '100.50', '101.00', '101.50', '102.00', '102.50', '103.00'];
        const callPutOptions = ['Call', 'Put'];
        
    for (let i = 0; i < 100; i++) {
        const monthIndex = i % months.length;
            const sourceIndex = i % sources.length;
            const strikeIndex = i % strikes.length;
            const callPutIndex = i % callPutOptions.length;
            
            const month = months[monthIndex];
            const value = (Math.random() * 3).toFixed(5);
            const source = sources[sourceIndex];
            const status = statuses[sourceIndex];
            const strike = strikes[strikeIndex];
            const callPut = callPutOptions[callPutIndex];
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="status-cell">
                        <div class="status-indicator status-${status}"></div>
                        <input type="checkbox" class="marks-row-checkbox" data-index="${i}">
                    </div>
                </td>
                <td>${month}</td>
                <td>$${value}</td>
                <td>${source}</td>
                <td>02/14/2026 00:00:01</td>
                <td>$${strike}</td>
                <td>${callPut}</td>
            `;
            tbody.appendChild(row);
        }
        
        // Initialize chart (placeholder) - delay to allow panel animation to complete
        setTimeout(() => {
            initCurvesOptionsChart();
            // Re-initialize column resize in case elements weren't ready
            initColumnResize();
        }, 400);
    } else {
        // Generate regular marks data (non-options)
        for (let i = 0; i < 100; i++) {
            const monthIndex = i % months.length;
            const sourceIndex = i % sources.length;
        const month = months[monthIndex];
        const value = (baseValue + (Math.random() - 0.5) * 20).toFixed(2);
            const source = sources[sourceIndex];
            const status = statuses[sourceIndex];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                    <div class="status-cell">
                        <div class="status-indicator status-${status}"></div>
                <input type="checkbox" class="marks-row-checkbox" data-index="${i}">
                    </div>
            </td>
            <td>${month}</td>
            <td>$${value}</td>
                <td>${source}</td>
            <td>Updated Jun 09 @ 00:00</td>
        `;
        tbody.appendChild(row);
    }
    
        // Don't initialize chart for non-option products - placeholder will be shown instead
    }
    
    // Re-attach the select all checkbox handler
    const selectAllCheckbox = document.getElementById('curves-select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.onchange = function() {
            toggleCurvesSelectAll(this.checked);
        };
    }
    
    // Add individual checkbox handlers
            const checkboxes = document.querySelectorAll('.marks-row-checkbox');
            checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            toggleMarksSelection(index, this.checked);
            });
        });
}

// Toggle marks select all
/* ============================================
   SELECTION - Curves Table Selection
   ============================================ */
function toggleCurvesSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.marks-row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
        const index = parseInt(checkbox.getAttribute('data-index'));
        toggleMarksSelection(index, checked);
    });
}

// Toggle marks selection
function toggleMarksSelection(index, checked) {
    const checkbox = document.querySelector(`.marks-row-checkbox[data-index="${index}"]`);
    const row = checkbox ? checkbox.closest('tr') : null;
    
    if (checked) {
        selectedMarks.add(index);
        if (row) {
            row.classList.add('selected');
        }
    } else {
        selectedMarks.delete(index);
        if (row) {
            row.classList.remove('selected');
        }
    }
    
    // Clear curves/vols selections when marks are selected
    if (selectedMarks.size > 0) {
        selectedRows.clear();
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('#data-table-body tr.selected, #volatilities-table-body tr.selected').forEach(tr => tr.classList.remove('selected'));
    }
    
    updateMarksSelectionBar();
    updateMarksSelectAllCheckbox();
}

// Update marks select all checkbox
function updateMarksSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('curves-select-all');
    if (!selectAllCheckbox) return;
    
    const totalRows = document.querySelectorAll('.marks-row-checkbox').length;
    const checkedRows = selectedMarks.size;
    
    if (checkedRows === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedRows === totalRows) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

// Update selection bar for marks
function updateMarksSelectionBar() {
    const bar = document.getElementById('selection-bar');
    const count = document.getElementById('selection-count');
    const actions = bar.querySelector('.selection-actions');
    
    // Move selection bar to curves table container
    const curvesTableContainer = document.querySelector('.curves-table-container');
    if (curvesTableContainer && bar.parentElement !== curvesTableContainer) {
        curvesTableContainer.appendChild(bar);
    }
    
    count.textContent = selectedMarks.size;
    count.parentElement.innerHTML = `<span id="selection-count">${selectedMarks.size}</span> marks selected`;
    
    if (selectedMarks.size > 0) {
        // Update buttons for marks (Delete before Download)
        actions.innerHTML = `
            <button class="selection-btn secondary" onclick="deleteSelectedMarks()">Delete</button>
            <button class="selection-btn filled" onclick="downloadSelectedMarks()">Download</button>
        `;
        bar.classList.add('visible');
    } else {
        // Restore original buttons
        actions.innerHTML = `
            <button class="selection-btn secondary" onclick="showAddToPresetModal()">Add to Preset</button>
            <div class="action-dropdown">
                <button class="selection-btn filled action-dropdown__trigger" onclick="downloadSelected()">
                    Download
                </button>
                <button class="selection-btn filled action-dropdown__chevron">
                    ▾
                </button>
                <div class="action-dropdown__menu" id="selection-action-dropdown">
                    <div class="dropdown-menu-item" onclick="showDownloadSettingsModal()">Download + Settings</div>
                </div>
            </div>
        `;
        bar.classList.remove('visible');
    }
}

// Download selected marks
function downloadSelectedMarks() {
    console.log('Downloading', selectedMarks.size, 'marks');
    // Add download logic here
}

// Delete selected marks
function deleteSelectedMarks() {
    if (confirm(`Are you sure you want to delete ${selectedMarks.size} mark(s)?`)) {
        console.log('Deleting', selectedMarks.size, 'marks');
        // Add delete logic here
        selectedMarks.clear();
        document.querySelectorAll('.marks-row-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('#curves-table-body tr.selected').forEach(tr => tr.classList.remove('selected'));
        updateMarksSelectionBar();
        updateMarksSelectAllCheckbox();
    }
}

// Row selection
function toggleRowSelection(index, checked) {
    const row = document.querySelector(`tr[data-index="${index}"]`);
    
    if (checked) {
        selectedRows.add(index);
        row.classList.add('selected');
        
        // Close detail panel if visible (Curves)
        const detailPanel = document.getElementById('detail-panel');
        if (detailPanel && !detailPanel.classList.contains('hidden')) {
            closeDetailPanel();
        }
    } else {
        selectedRows.delete(index);
        row.classList.remove('selected');
    }
    
    updateSelectionBar();
    updateSelectAllCheckbox();
}

function toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach((checkbox, idx) => {
        const index = parseInt(checkbox.closest('tr').getAttribute('data-index'));
        checkbox.checked = checked;
        
        if (checked) {
            selectedRows.add(index);
            checkbox.closest('tr').classList.add('selected');
        } else {
            selectedRows.delete(index);
            checkbox.closest('tr').classList.remove('selected');
        }
    });
    
    // Close detail panel if visible when selecting all
    if (checked) {
        const detailPanel = document.getElementById('detail-panel');
        if (detailPanel && !detailPanel.classList.contains('hidden')) {
            closeDetailPanel();
        }
    }
    
    updateSelectionBar();
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (!selectAllCheckbox) return;
    
    const totalRows = document.querySelectorAll('.row-checkbox').length;
    const checkedRows = selectedRows.size;
    
    if (checkedRows === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedRows === totalRows) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

function updateSelectionBar() {
    const bar = document.getElementById('selection-bar');
    const count = document.getElementById('selection-count');
    
    // Don't update if marks are selected
    if (selectedMarks.size > 0) {
        return;
    }
    
    // Move selection bar to the appropriate table wrapper
    const curvesTableWrapper = document.querySelector('#curves-content .table-wrapper');
    const volsTableWrapper = document.querySelector('#volatilities-content .table-wrapper');
    
    if (selectedRows.size > 0) {
        // Determine which grid has selections and move bar there
        const curvesSelected = document.querySelector('#curves-content tr.selected');
        const volsSelected = document.querySelector('#volatilities-content tr.selected');
        
        // Default to curves table wrapper if we have selections but can't find selected rows in DOM
        // (this can happen when detail panel closes and DOM is updating)
        if (curvesSelected && curvesTableWrapper) {
            if (bar.parentElement !== curvesTableWrapper) {
                curvesTableWrapper.appendChild(bar);
            }
        } else if (volsSelected && volsTableWrapper) {
            if (bar.parentElement !== volsTableWrapper) {
                volsTableWrapper.appendChild(bar);
            }
        } else if (curvesTableWrapper) {
            // Fallback: if we have selections but can't find selected rows, use curves wrapper
            if (bar.parentElement !== curvesTableWrapper) {
                curvesTableWrapper.appendChild(bar);
            }
        }
        
        count.textContent = selectedRows.size;
        count.parentElement.innerHTML = `<span id="selection-count">${selectedRows.size}</span> products selected`;
        bar.classList.add('visible');
    } else {
        bar.classList.remove('visible');
    }
}

function clearSelection() {
    selectedRows.clear();
    selectedMarks.clear();
    document.querySelectorAll('.row-checkbox, .marks-row-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('tr.selected').forEach(tr => tr.classList.remove('selected'));
    updateSelectionBar();
    updateSelectAllCheckbox();
    updateMarksSelectionBar();
    updateMarksSelectAllCheckbox();
    const dropdown = document.getElementById('selection-action-dropdown');
    if (dropdown) dropdown.classList.remove('visible');
}

// Marks section tab switching
/* ============================================
   DETAIL PANEL - Tab Management
   ============================================ */
function switchCurvesTab(tab) {
    // Validate tab parameter
    if (tab !== 'curves' && tab !== 'options') {
        tab = 'curves';
    }
    
    // Find tabs within the detail panel context
    const detailTabsRow = document.getElementById('detail-tabs-row');
    if (!detailTabsRow) return; // Detail panel tabs not available
    
    // Find tab elements within the detail panel (using unique IDs)
    const curvesTab = document.getElementById('detail-curves-tab');
    const optionsTab = document.getElementById('detail-options-tab');
    
    // Check if trying to switch to disabled tab
    if (tab === 'options' && optionsTab && optionsTab.classList.contains('disabled')) {
        return; // Don't switch to disabled tab
    }
    
    // Remove active class from all tabs in the detail panel
    const allTabs = detailTabsRow.querySelectorAll('.curves-tab');
    allTabs.forEach(t => t.classList.remove('active'));
    
    // Hide all tab contents
    document.querySelectorAll('.curves-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tab === 'curves') {
        // Activate Curves tab
        if (curvesTab) {
            curvesTab.classList.add('active');
        }
        const curvesContent = document.getElementById('curves-tab-content');
        if (curvesContent) {
            curvesContent.classList.add('active');
        }
    } else if (tab === 'options') {
        // Activate Options tab
        if (optionsTab && !optionsTab.classList.contains('disabled')) {
            optionsTab.classList.add('active');
        }
        const optionsContent = document.getElementById('options-tab-content');
        if (optionsContent) {
            optionsContent.classList.add('active');
            // Populate options table if not already populated
            const tbody = document.getElementById('volatilities-curves-table-body');
            if (tbody && tbody.children.length === 0) {
                populateVolatilitiesMarksTable();
            }
            // Initialize chart if not already initialized
            setTimeout(() => {
                initVolatilitiesChart();
            }, 100);
        }
    }
}

/* ============================================
   VOLATILITIES - Strike Headers & Table
   ============================================ */
// Generate strike column headers in standard sequential pattern: 1.0, 1.1, 1.2, ..., 11.0
function generateStrikeHeaders() {
    const strikes = [];
    
    // Generate strikes from 1.0 to 11.0 with 0.1 increments
    for (let strike = 1.0; strike <= 11.0; strike += 0.1) {
        strikes.push(Math.round(strike * 10) / 10); // Round to avoid floating point precision issues
    }
    
    return strikes;
}

// Populate Volatilities Curves table
function populateVolatilitiesMarksTable() {
    const tbody = document.getElementById('volatilities-curves-table-body');
    const headerRow = document.getElementById('volatilities-strikes-header-row');
    if (!tbody || !headerRow) return;
    
    // Generate strike headers
    const strikes = generateStrikeHeaders();
    
    // Update table header
    let headerHTML = '<th>Contract</th>';
    strikes.forEach(strike => {
        // Standard decimal formatting: 1.0, 1.1, 1.2, etc.
        const displayValue = strike.toFixed(1);
        headerHTML += `<th>${displayValue}</th>`;
    });
    headerRow.innerHTML = headerHTML;
    
    tbody.innerHTML = '';
    
    // Generate sample surfaces data - Contract dates and volatility values
    const contracts = ['02/01/2026', '01/01/2026', '12/01/2025', '11/01/2025', '10/01/2025', '09/01/2025', '08/01/2025', '07/01/2025', '06/01/2025', '05/01/2025'];
    const sources = ['User Provided', 'Settles', 'Prelims', 'Substituted', 'User Provided Estimate', 'Copy'];
    
    // Generate sample timestamps
    function generateTimestamp() {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Random date within last week
        const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    }
    
    // Add enough rows to fill the grid space (100 rows)
    for (let i = 0; i < 100; i++) {
        const contractIndex = i % contracts.length;
        const contract = contracts[contractIndex];
        const row = document.createElement('tr');
        
        // Generate volatility values for each strike
        let rowHTML = `<td>${contract}</td>`;
        strikes.forEach((strike, strikeIndex) => {
            // Generate a volatility value (between 0.1 and 0.3, with some variation)
            const baseVol = 0.15 + (strike - 6) * 0.01; // Slight variation based on strike
            const volatility = (baseVol + (Math.random() - 0.5) * 0.05).toFixed(5);
            
            // Generate tooltip data
            const source = sources[(i + strikeIndex) % sources.length];
            const lastUpdated = generateTimestamp();
            const tooltipText = `Source: ${source}\nLast Updated: ${lastUpdated}`;
            
            rowHTML += `<td data-tooltip="${tooltipText.replace(/"/g, '&quot;')}">${volatility}</td>`;
        });
        
        row.innerHTML = rowHTML;
        
        // Add hover event listeners for chart interaction
        const rowContractIdx = contractIndex;
        row.addEventListener('mouseenter', function() {
            highlightVolatilitiesChartPoint(rowContractIdx);
        });
        row.addEventListener('mouseleave', function() {
            removeVolatilitiesChartHighlight();
        });
        
        tbody.appendChild(row);
    }
    
    // Initialize volatilities chart after table is populated
    setTimeout(() => {
        initVolatilitiesChart();
    }, 100);
}

// Store chart data and instance for row hover interaction (for Curves tab)
let curvesChartData = null;
let curvesChartInstance = null;
let curvesChartContracts = [];
let curvesChartStrikes = [];

/* ============================================
   CHARTS - Curves Options Chart
   ============================================ */
// Initialize 3D chart for Curves tab (placeholder)
function initCurvesOptionsChart() {
    const chartDom = document.getElementById('curves-options-chart');
    if (!chartDom) return;
    
    // Reset opacity to 0 for fade-in animation
    chartDom.style.opacity = '0';
    
    // Ensure container has dimensions
    const rect = chartDom.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        // Wait a bit longer if container isn't ready
        setTimeout(initCurvesOptionsChart, 200);
        return;
    }
    
    // Dispose existing chart if any
    let chart = chartDom._echartsInstance;
    if (chart) {
        chart.dispose();
    }
    
    // Get container dimensions from parent wrapper
    const parentRect = chartDom.parentElement.getBoundingClientRect();
    const width = parentRect.width || chartDom.offsetWidth || 500;
    const height = parentRect.height || chartDom.offsetHeight || 400;
    
    chart = echarts.init(chartDom);
    chartDom._echartsInstance = chart;
    curvesChartInstance = chart;
    
    // Generate sample data for surface chart (matching market-data.html)
    const data = [];
    for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
            const x = (i / 20) * 10;
            const y = (j / 20) * 10;
            const z = Math.sin(Math.sqrt(x * x + y * y)) * 0.5 + 0.5;
            data.push([x, y, z]);
        }
    }
    
    curvesChartData = data;
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            textStyle: {
                color: '#fff'
            }
        },
        visualMap: {
            max: 1,
            min: 0,
            calculable: true,
            realtime: false,
            right: 10,
            top: 'center',
            textStyle: {
                color: '#666'
            },
            inRange: {
                // Accent color gradient: Blue -> Yellow -> Orange (using accent colors)
                color: [
                    '#4dafd4', // Blue accent
                    '#5fb8c9', // Blue to cyan
                    '#71c1be', // Cyan
                    '#83cab3', // Cyan to teal
                    '#95d3a8', // Teal to green
                    '#a7dc9d', // Green to yellow-green
                    '#b9e592', // Yellow-green
                    '#cbed87', // Light yellow
                    '#dba43a', // Yellow accent (prominent)
                    '#e0a52d', // Yellow to orange
                    '#e46f16'  // Orange accent
                ]
            },
            outOfRange: {
                colorAlpha: 0.1
            }
        },
        xAxis3D: {
            type: 'value',
            min: 0,
            max: 10
        },
        yAxis3D: {
            type: 'value',
            min: 0,
            max: 10
        },
        zAxis3D: {
            type: 'value',
            min: 0,
            max: 1
        },
        grid3D: {
            boxWidth: 120,
            boxDepth: 120,
            boxHeight: 60,
            viewControl: {
                projection: 'perspective',
                autoRotate: false,
                distance: 300,
                alpha: 40,
                beta: 30,
                minDistance: 150,
                maxDistance: 600,
                rotateSensitivity: 1,
                zoomSensitivity: 1
            },
            light: {
                main: {
                    intensity: 0.8,
                    shadow: true
                },
                ambient: {
                    intensity: 0.6
                }
            }
        },
        series: [{
            type: 'surface',
            wireframe: {
                show: false
            },
            data: data,
            itemStyle: {
                opacity: 0.8
            },
            parametric: false
        }]
    };
    
    chart.setOption(option);
    
    // Fade in the chart after it's initialized
    // Wait for panel animation (300ms) + chart render time
    setTimeout(() => {
        chartDom.style.opacity = '1';
    }, 300);
    
    // Resize after a short delay to ensure container is ready
    setTimeout(() => {
        if (chart) {
            chart.resize();
        }
    }, 500);
    
    // Handle resize
    const resizeHandler = function() {
        if (chart) {
            chart.resize();
        }
    };
    window.addEventListener('resize', resizeHandler);
}

// Store chart data and instance for Volatilities tab
let volatilitiesChartData = null;
let volatilitiesChartInstance = null;
let volatilitiesChartContracts = [];
let volatilitiesChartStrikes = [];

// Toggle Call/Put for Volatilities chart
function toggleCallPut(value, button) {
    // Remove active class from all toggle buttons
    const toggleGroup = button.closest('.call-put-toggle');
    toggleGroup.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // TODO: Update chart data based on Call/Put selection
    console.log('Call/Put toggled to:', value);
}

// Toggle Call/Put for Marks chart
/* ============================================
   CHARTS - Call/Put Toggle
   ============================================ */
function toggleCurvesCallPut(value, button) {
    // Remove active class from all toggle buttons
    const toggleGroup = button.closest('.call-put-toggle');
    toggleGroup.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // TODO: Update marks chart data based on Call/Put selection
    console.log('Marks Call/Put toggled to:', value);
}

// Initialize 3D chart for Volatilities tab
/* ============================================
   CHARTS - Volatilities Chart
   ============================================ */
function initVolatilitiesChart() {
    const chartDom = document.getElementById('volatilities-chart');
    if (!chartDom) return;
    
    // Reset opacity to 0 for fade-in animation
    chartDom.style.opacity = '0';
    
    // Ensure container has dimensions
    const rect = chartDom.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        // Wait a bit longer if container isn't ready
        setTimeout(initVolatilitiesChart, 200);
        return;
    }
    
    // Dispose existing chart if any
    let chart = chartDom._echartsInstance;
    if (chart) {
        chart.dispose();
    }
    
    // Get container dimensions from parent wrapper
    const parentRect = chartDom.parentElement.getBoundingClientRect();
    const width = parentRect.width || chartDom.offsetWidth || 500;
    const height = parentRect.height || chartDom.offsetHeight || 400;
    
    chart = echarts.init(chartDom);
    chartDom._echartsInstance = chart;
    volatilitiesChartInstance = chart;
    
    // Generate sample data for surface chart (matching market-data.html)
    const data = [];
    for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
            const x = (i / 20) * 10;
            const y = (j / 20) * 10;
            const z = Math.sin(Math.sqrt(x * x + y * y)) * 0.5 + 0.5;
            data.push([x, y, z]);
        }
    }
    
    volatilitiesChartData = data;
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            textStyle: {
                color: '#fff'
            }
        },
        visualMap: {
            max: 1,
            min: 0,
            calculable: true,
            realtime: false,
            right: 10,
            top: 'center',
            textStyle: {
                color: '#666'
            },
            inRange: {
                // Accent color gradient: Blue -> Yellow -> Orange (using accent colors)
                color: [
                    '#4dafd4', // Blue accent
                    '#5fb8c9', // Blue to cyan
                    '#71c1be', // Cyan
                    '#83cab3', // Cyan to teal
                    '#95d3a8', // Teal to green
                    '#a7dc9d', // Green to yellow-green
                    '#b9e592', // Yellow-green
                    '#cbed87', // Light yellow
                    '#dba43a', // Yellow accent (prominent)
                    '#e0a52d', // Yellow to orange
                    '#e46f16'  // Orange accent
                ]
            },
            outOfRange: {
                colorAlpha: 0.1
            }
        },
        xAxis3D: {
            type: 'value',
            min: 0,
            max: 10,
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#666'
                }
            }
        },
        yAxis3D: {
            type: 'value',
            min: 0,
            max: 10,
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#666'
                }
            }
        },
        zAxis3D: {
            type: 'value',
            min: 0,
            max: 1,
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#666'
                }
            }
        },
        grid3D: {
            boxWidth: 120,
            boxDepth: 120,
            boxHeight: 60,
            viewControl: {
                projection: 'perspective',
                autoRotate: false,
                distance: 300,
                alpha: 40,
                beta: 30,
                minDistance: 150,
                maxDistance: 600,
                rotateSensitivity: 1,
                zoomSensitivity: 1
            },
            light: {
                main: {
                    intensity: 0.8,
                    shadow: true
                },
                ambient: {
                    intensity: 0.6
                }
            }
        },
        series: [{
            type: 'surface',
            wireframe: {
                show: false
            },
            data: data,
            itemStyle: {
                opacity: 0.8
            },
            parametric: false
        }]
    };
    
    chart.setOption(option);
    
    // Fade in the chart after it's initialized
    // Wait for panel animation (300ms) + chart render time
    setTimeout(() => {
        chartDom.style.opacity = '1';
    }, 300);
    
    // Resize after a short delay to ensure container is ready
    setTimeout(() => {
        if (chart) {
            chart.resize();
        }
    }, 500);
    
    // Handle resize
    const resizeHandler = function() {
        if (chart) {
            chart.resize();
        }
    };
    window.addEventListener('resize', resizeHandler);
}

// Highlight chart points when hovering over Volatilities table row
function highlightVolatilitiesChartPoint(contractIndex) {
    if (!volatilitiesChartInstance || !volatilitiesChartData || !volatilitiesChartContracts) return;
    
    const contract = volatilitiesChartContracts[contractIndex];
    if (!contract) return;
    
    // Find all data points for this contract
    const highlightedData = volatilitiesChartData.filter(d => d[1] === contractIndex);
    
    // Get current option
    const option = volatilitiesChartInstance.getOption();
    if (!option || !option.series || !option.series[0]) return;
    
    // Add a scatter series to highlight the contract's points
    const scatterData = highlightedData.map(d => [d[0], d[1], d[2]]);
    
    // Update chart with highlight series
    volatilitiesChartInstance.setOption({
        series: [
            option.series[0], // Keep original surface
            {
                type: 'scatter3D',
                data: scatterData,
                symbolSize: 8,
                itemStyle: {
                    color: '#ff0000',
                    opacity: 1
                },
                emphasis: {
                    itemStyle: {
                        color: '#ff0000',
                        opacity: 1
                    }
                }
            }
        ]
    }, { notMerge: false });
}

// Remove highlight from Volatilities chart
function removeVolatilitiesChartHighlight() {
    if (!volatilitiesChartInstance) return;
    
    const option = volatilitiesChartInstance.getOption();
    if (option && option.series && option.series.length > 1) {
        // Remove the scatter series (keep only the surface)
        volatilitiesChartInstance.setOption({
            series: [option.series[0]]
        }, { notMerge: false });
    }
}

// Tab switching
/* ============================================
   MAIN NAVIGATION - Tab Switching
   ============================================ */
function switchTab(tab) {
    // Validate tab parameter
    if (tab !== 'curves' && tab !== 'volatilities') {
        // Fallback: ensure curves tab is selected if invalid tab
        tab = 'curves';
    }
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    // Find and activate the correct tab element
    const curvesTab = document.getElementById('curves-tab');
    const volatilitiesTab = document.querySelector('.tab:not(#curves-tab)');
    
    if (tab === 'curves') {
        if (curvesTab) {
            curvesTab.classList.add('active');
        }
        document.getElementById('curves-content').style.display = 'flex';
        document.getElementById('volatilities-content').style.display = 'none';
        
        // Restore the saved filter title when switching to Curves
        if (savedFilterShowsPlaceholder()) {
            updatePageTitle('');
        } else {
            const savedFilter = document.getElementById('saved-filters-value').textContent;
            updatePageTitle(savedFilter);
        }
    } else {
        if (volatilitiesTab) {
            volatilitiesTab.classList.add('active');
        }
        document.getElementById('curves-content').style.display = 'none';
        document.getElementById('volatilities-content').style.display = 'flex';
        populateVolatilitiesTable();
        
        // Clear the saved filter title when switching to Volatilities
        const titleFilter = document.getElementById('page-title-filter');
        if (titleFilter) {
            titleFilter.textContent = '';
        }
    }
    
    // Safety check: ensure at least one tab is active
    const activeTab = document.querySelector('.tab.active');
    if (!activeTab) {
        // Fallback: activate curves tab if somehow no tab is active
        if (curvesTab) {
            curvesTab.classList.add('active');
        }
        document.getElementById('curves-content').style.display = 'flex';
        document.getElementById('volatilities-content').style.display = 'none';
    }
}

// toggleServerFilters, expandServerFilters — implemented in js/filters-card.js

// Clear all filter selections and inputs
function clearFilters() {
    // Clear saved filter and show placeholder
    const savedFiltersValue = document.getElementById('saved-filters-value');
    if (savedFiltersValue) {
        savedFiltersValue.textContent = SAVED_FILTER_PLACEHOLDER_TEXT;
        savedFiltersValue.classList.add('placeholder');
    }
    
    // Remove selected class from all filter items
    document.querySelectorAll('.custom-select-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Clear all text inputs
    document.querySelectorAll('.filter-input[type="text"]').forEach(input => {
        input.value = '';
    });
    
    // Reset all date inputs to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    document.querySelectorAll('.filter-input[type="date"]').forEach(input => {
        input.value = todayStr;
    });
    
    document.querySelectorAll('select.filter-input').forEach(select => {
        if (select.options.length > 0) {
            select.selectedIndex = 0;
        }
    });
    
    // Clear all checkboxes in expanded filters
    document.querySelectorAll('#server-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear page title and tab title
    updatePageTitle('');
}

// Close Download Presets modal and show expanded filters
function editFromDownloadPresets(presetValue, presetName) {
    // Close the modal
    closeDownloadPresetsModal();
    
    // Find the preset item in the filters dropdown
    const presetItem = document.querySelector(`.custom-select-item[data-value="${presetValue}"]`);
    if (presetItem) {
        // Select the preset using the existing function
        selectSavedFilter(presetItem);
    } else {
        console.error('Preset not found:', presetValue);
    }
    
    // Expand server filters
    expandServerFilters();
}

// Legend toggle
function toggleLegend() {
    const popover = document.getElementById('legend-popover');
    popover.classList.toggle('visible');
}

// Download dropdown
function toggleDownloadDropdown() {
    const dropdown = document.getElementById('selection-action-dropdown');
    if (dropdown) dropdown.classList.toggle('visible');
}

// Modal functions
function showSaveFilterModal() {
    const modal = document.getElementById('save-filter-modal');
    const nameInput = document.getElementById('filter-name-input');
    const saveBtn = document.getElementById('save-filter-btn');
    
    modal.classList.add('visible');
    
    // Disable Save button initially
    if (saveBtn) {
        saveBtn.disabled = true;
    }
    
    // Clear input and focus
    if (nameInput) {
        nameInput.value = '';
        nameInput.focus();
    }
}

function closeSaveFilterModal() {
    const modal = document.getElementById('save-filter-modal');
    const nameInput = document.getElementById('filter-name-input');
    const saveBtn = document.getElementById('save-filter-btn');
    
    modal.classList.remove('visible');
    if (nameInput) {
        nameInput.value = '';
    }
    if (saveBtn) {
        saveBtn.disabled = true;
    }
}

function saveFilter() {
    const name = document.getElementById('filter-name-input').value;
    if (name) {
        // Add to saved filters dropdown
        const select = document.getElementById('saved-filters-select');
        const option = document.createElement('option');
        option.value = name.toLowerCase().replace(/\s+/g, '-');
        option.textContent = name;
        select.appendChild(option);
        select.value = option.value;
        
        alert(`Filter "${name}" saved successfully!`);
        closeSaveFilterModal();
    }
}

function showDownloadSettingsModal() {
    document.getElementById('download-settings-modal').classList.add('visible');
    const dropdown = document.getElementById('selection-action-dropdown');
    if (dropdown) dropdown.classList.remove('visible');
}

function closeDownloadSettingsModal() {
    document.getElementById('download-settings-modal').classList.remove('visible');
}

function downloadWithSettings() {
    alert('Downloading with custom settings...');
    closeDownloadSettingsModal();
}

function downloadSelected() {
    alert(`Downloading ${selectedRows.size} selected products...`);
    const dropdown = document.getElementById('selection-action-dropdown');
    if (dropdown) dropdown.classList.remove('visible');
}

function showAddToPresetModal() {
    const modal = document.getElementById('add-to-preset-modal');
    const list = document.getElementById('selected-products-list');
    const countSpan = document.getElementById('modal-selection-count');
    
    countSpan.textContent = selectedRows.size;
    
    // Populate selected products
    list.innerHTML = '';
    selectedRows.forEach(rowIndex => {
        // Get the actual data index (since we cycle through marketData)
        const dataIndex = rowIndex % marketData.length;
        const product = marketData[dataIndex];
        if (!product) return; // Skip if product doesn't exist
        
        const item = document.createElement('div');
        item.className = 'selected-product-item';
        // Format product name with yellow short names (same as grid)
        const productName = product.product;
        const formattedProduct = formatProductName(productName);
        item.innerHTML = `
            <span>${formattedProduct}</span>
            <button class="remove-product" onclick="removeFromModalPreset(${rowIndex}, this)"><i class="fas fa-times"></i></button>
        `;
        list.appendChild(item);
    });
    
    // Set up button text updates based on input
    const presetSelect = document.getElementById('preset-select');
    const presetNameInput = document.getElementById('preset-name-input');
    const addBtn = document.getElementById('add-btn');
    const addDownloadBtn = document.getElementById('add-download-btn');
    
    function updateButtonText(source) {
        const hasPreset = presetSelect && presetSelect.value !== '';
        const hasName = presetNameInput && presetNameInput.value.trim() !== '';
        
        // Mutually exclusive: clear the other field based on which one was just changed
        if (source === 'name' && hasName && hasPreset) {
            // Name was just entered, clear preset
            presetSelect.value = '';
        } else if (source === 'preset' && hasPreset && hasName) {
            // Preset was just selected, clear name
            presetNameInput.value = '';
        }
        
        // Re-check after clearing
        const finalHasPreset = presetSelect && presetSelect.value !== '';
        const finalHasName = presetNameInput && presetNameInput.value.trim() !== '';
        
        // Enable/disable buttons based on whether preset or name is filled
        const hasInput = finalHasPreset || finalHasName;
        if (addBtn) {
            addBtn.disabled = !hasInput;
        }
        if (addDownloadBtn) {
            addDownloadBtn.disabled = !hasInput;
        }
        
        if (finalHasName) {
            // Creating new preset
            if (addBtn) addBtn.textContent = 'Create';
            if (addDownloadBtn) addDownloadBtn.textContent = 'Create + Download';
        } else if (finalHasPreset) {
            // Adding to existing preset
            if (addBtn) addBtn.textContent = 'Add';
            if (addDownloadBtn) addDownloadBtn.textContent = 'Add + Download';
        } else {
            // Default: Adding (no preset selected, no name entered)
            if (addBtn) addBtn.textContent = 'Add';
            if (addDownloadBtn) addDownloadBtn.textContent = 'Add + Download';
        }
    }
    
    // Set initial button text and disable buttons
    if (addBtn) addBtn.disabled = true;
    if (addDownloadBtn) addDownloadBtn.disabled = true;
    updateButtonText();
    
    // Watch for changes
    if (presetNameInput) {
        presetNameInput.addEventListener('input', () => updateButtonText('name'));
    }
    if (presetSelect) {
        presetSelect.addEventListener('change', () => updateButtonText('preset'));
    }
    
    modal.classList.add('visible');
}

function removeFromModalPreset(index, button) {
    button.parentElement.remove();
    const countSpan = document.getElementById('modal-selection-count');
    countSpan.textContent = parseInt(countSpan.textContent) - 1;
}

function closeAddToPresetModal() {
    const modal = document.getElementById('add-to-preset-modal');
    modal.classList.remove('visible');
    
    // Reset inputs and button text
    const presetSelect = document.getElementById('preset-select');
    const presetNameInput = document.getElementById('preset-name-input');
    const addBtn = document.getElementById('add-btn');
    const addDownloadBtn = document.getElementById('add-download-btn');
    
    if (presetSelect) presetSelect.value = '';
    if (presetNameInput) presetNameInput.value = '';
    if (addBtn) {
        addBtn.textContent = 'Add';
        addBtn.disabled = true;
    }
    if (addDownloadBtn) {
        addDownloadBtn.textContent = 'Add + Download';
        addDownloadBtn.disabled = true;
    }
}

function addToPreset() {
    alert('Products added to preset!');
    closeAddToPresetModal();
}

function addToPresetAndDownload() {
    alert('Products added to preset and downloading!');
    closeAddToPresetModal();
}

/* ============================================
   ACTION MENU - Templates
   ============================================ */
function getTemplate(type) {
    console.log('Getting template:', type);
    // Add template download logic here
    // For now, just log the action
}

function downloadItem(type) {
    console.log('Downloading:', type);
    // Add download logic here
    // For now, just log the action
}

/* ============================================
   MODALS - Download & Watchlist
   ============================================ */
function showDownloadPresetsModal() {
    document.getElementById('download-presets-modal').classList.add('visible');
}

function closeDownloadPresetsModal() {
    document.getElementById('download-presets-modal').classList.remove('visible');
    hideWatchlistPanel();
}

function showEditWatchlistModal(event) {
    if (event) event.stopPropagation();
    // Hide Download Presets modal completely
    const downloadModal = document.getElementById('download-presets-modal');
    downloadModal.classList.remove('visible');
    downloadModal.style.display = 'none';
    // Show Edit Watchlist modal
    document.getElementById('edit-watchlist-modal').classList.add('visible');
    // Set the input value (in case it doesn't render from HTML attribute)
    document.getElementById('edit-watchlist-name').value = 'Assorted Watchlist';
}

function closeEditWatchlistModal() {
    document.getElementById('edit-watchlist-modal').classList.remove('visible');
    // Show Download Presets modal again
    const downloadModal = document.getElementById('download-presets-modal');
    downloadModal.style.display = '';
    downloadModal.classList.add('visible');
}

function saveWatchlist() {
    // Close Edit Watchlist modal and show Download Presets modal
    document.getElementById('edit-watchlist-modal').classList.remove('visible');
    const downloadModal = document.getElementById('download-presets-modal');
    downloadModal.style.display = '';
    downloadModal.classList.add('visible');
}

function saveAndDownloadWatchlist() {
    // Close all modals
    document.getElementById('edit-watchlist-modal').classList.remove('visible');
    document.getElementById('download-presets-modal').classList.remove('visible');
    document.getElementById('download-presets-modal').style.display = '';
}

/* ============================================
   MODALS - Revalue Trades
   ============================================ */
function showRevalueProductsModal() {
    const modal = document.getElementById('revalue-products-modal');
    modal.classList.add('visible');
    populateRevalueProductsList();
}

function populateRevalueProductsList() {
    // Sample products - in real app, this would come from selected products
    const sampleProducts = [
        { shortName: 'NG', longName: 'Natural Gas' },
        { shortName: 'HO', longName: 'Heating Oil' },
        { shortName: 'RB', longName: 'RBOB Gasoline' },
        { shortName: 'CL', longName: 'Crude Oil' },
        { shortName: 'WTI', longName: 'West Texas Intermediate' },
        { shortName: 'BRENT', longName: 'Brent Crude' },
        { shortName: 'HO', longName: 'Heating Oil' },
        { shortName: 'NG', longName: 'Natural Gas' },
        { shortName: 'RB', longName: 'RBOB Gasoline' },
        { shortName: 'CL', longName: 'Crude Oil' },
        { shortName: 'WTI', longName: 'West Texas Intermediate' }
    ];

    const listContainer = document.getElementById('revalue-products-list');
    const countElement = document.getElementById('revalue-products-count');
    
    listContainer.innerHTML = '';
    sampleProducts.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = 'revalue-product-item';
        item.innerHTML = `
            <span class="product-name">[<span class="short-name">${product.shortName}</span>] Product ${product.longName}</span>
            <button class="revalue-remove-product" onclick="removeProductFromRevalue(${index})" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        listContainer.appendChild(item);
    });

    if (countElement) {
        countElement.textContent = sampleProducts.length;
    }
}

function removeProductFromRevalue(index) {
    const listContainer = document.getElementById('revalue-products-list');
    const items = listContainer.querySelectorAll('.revalue-product-item');
    if (items[index]) {
        items[index].remove();
        updateRevalueProductsCount();
    }
}

function updateRevalueProductsCount() {
    const listContainer = document.getElementById('revalue-products-list');
    const countElement = document.getElementById('revalue-products-count');
    const count = listContainer.querySelectorAll('.revalue-product-item').length;
    if (countElement) {
        countElement.textContent = count;
    }
}

function addProductToRevalue() {
    // TODO: Implement add product functionality
    console.log('Add product to revalue');
}

function closeRevalueProductsModal() {
    document.getElementById('revalue-products-modal').classList.remove('visible');
}

function revalueProducts() {
    // TODO: Implement revalue products logic
    console.log('Revalue products');
    closeRevalueProductsModal();
}

function showDailyCurveTrackerModal() {
    const modal = document.getElementById('daily-curve-tracker-modal');
    modal.classList.add('visible');
    populateCurveTracker();
}

function closeDailyCurveTrackerModal() {
    document.getElementById('daily-curve-tracker-modal').classList.remove('visible');
}

function populateCurveTracker() {
    const products = [
        'NG', 'CL', 'B', 'PGP-BL', 'HB_NORTH 2X16', 
        'WEST INT HUB 7X8', 'WESTERN HUB 7X16', 'M.HSCX', 'TZ6', 'M.9Q8W'
    ];

    const selectsContainer = document.getElementById('curve-tracker-selects');
    const heatmapContainer = document.getElementById('curve-tracker-heatmap');
    
    selectsContainer.innerHTML = '';
    
    // Colors matching the actual implementation
    const colors = {
        received: '#708c46',
        copied: '#e46f16',
        notReceived: '#c30000'
    };
    const strokeColor = '#ffffff';
    
    const cellSize = 30;
    const numCols = 10;
    const numRows = products.length;
    const svgWidth = cellSize * numCols;
    const svgHeight = cellSize * numRows;

    // Generate random data for heatmap
    const data = [];
    for (let row = 0; row < numRows; row++) {
        const rowData = [];
        for (let col = 0; col < numCols; col++) {
            const rand = Math.random();
            let val, color;
            if (rand < 0.5) { val = 1; color = colors.received; }
            else if (rand < 0.8) { val = 2; color = colors.copied; }
            else { val = 0; color = colors.notReceived; }
            rowData.push({ val, color });
        }
        data.push(rowData);
    }

    // Create selects - height matches cellSize
    products.forEach((product, index) => {
        const select = document.createElement('div');
        select.className = 'tracker-select';
        select.style.height = cellSize + 'px';
        select.innerHTML = `
            <div class="tracker-select-value">${product}</div>
            <div class="tracker-select-indicators">
                <div class="tracker-select-clear">
                    <svg height="14" width="14" viewBox="0 0 20 20">
                        <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z" fill="currentColor"></path>
                    </svg>
                </div>
                <div class="tracker-select-separator"></div>
                <div class="tracker-select-dropdown">
                    <svg height="14" width="14" viewBox="0 0 20 20">
                        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
        `;
        selectsContainer.appendChild(select);
    });

    // Create SVG heatmap with white background and white strokes
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" style="background: white;">`;
    
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = col * cellSize;
            const y = row * cellSize;
            const cell = data[row][col];
            svgContent += `<rect width="${cellSize}" height="${cellSize}" x="${x}" y="${y}" fill="${cell.color}" stroke="${strokeColor}" stroke-width="1"></rect>`;
        }
    }
    
    svgContent += '</svg>';
    heatmapContainer.innerHTML = svgContent;
}

function showWatchlistPanel() {
    document.getElementById('watchlist-panel').classList.add('visible');
}

function hideWatchlistPanel() {
    document.getElementById('watchlist-panel').classList.remove('visible');
}

function toggleDownloadDates(button) {
    const datesSection = button.closest('.download-item').querySelector('.download-settings-section');
    const chevron = button.querySelector('i');
    if (datesSection) {
        // Check if section is currently visible
        const isCurrentlyVisible = datesSection.style.display === 'block' || 
            (datesSection.style.display === '' && window.getComputedStyle(datesSection).display !== 'none');
        
        // Toggle visibility
        datesSection.style.display = isCurrentlyVisible ? 'none' : 'block';
        
        // Toggle chevron icon
        if (chevron) {
            if (isCurrentlyVisible) {
                // About to hide, show down chevron
                chevron.classList.remove('fa-chevron-up');
                chevron.classList.add('fa-chevron-down');
            } else {
                // About to show, show up chevron
                chevron.classList.remove('fa-chevron-down');
                chevron.classList.add('fa-chevron-up');
            }
        }
    }
}

function showNeedsAttentionModal() {
    document.getElementById('needs-attention-modal').classList.add('visible');
}

function closeNeedsAttentionModal() {
    document.getElementById('needs-attention-modal').classList.remove('visible');
}

function showAttentionProductDetail(productName) {
    // Close the attention modal first
    closeNeedsAttentionModal();
    
    // Find the product in marketData by matching the product name
    const productIndex = marketData.findIndex(p => p.product === productName);
    
    if (productIndex !== -1) {
        // Use the existing showProductDetail function with needsAttention flag
        showProductDetail(productIndex, true);
    } else {
        // If product not found, create a basic product object and show the panel
        const panel = document.getElementById('detail-panel');
        const title = document.getElementById('detail-panel-title');
        const header = document.querySelector('#detail-panel .detail-panel-header');
        const tableWrapper = document.querySelector('.table-wrapper');
        
        // Set source color for header border (use substituted/error color for needs attention)
        if (header) {
            header.style.setProperty('--source-color', '#c30000');
        }
        
        // Format product name
        const formattedProductName = formatProductName(productName);
        title.innerHTML = formattedProductName;
        
        // Create a basic product object for populating marks
        const basicProduct = {
            product: productName,
            contract: '',
            instrument: '',
            commodity: '',
            currency: '',
            uom: '',
            frequency: '',
            option: '',
            callPut: '',
            markingOnly: '',
            source: '',
            lastUpdated: '',
            status: 'substituted'
        };
        
        // Enable/disable Options tab based on whether product is an option
        const optionsTab = document.getElementById('detail-options-tab');
        const isOption = basicProduct.instrument === 'Options' || (basicProduct.option && basicProduct.option !== '-');
        
        if (optionsTab) {
            if (isOption) {
                optionsTab.classList.remove('disabled');
            } else {
                optionsTab.classList.add('disabled');
                // If Options tab is currently active, switch to Curves tab
                if (optionsTab.classList.contains('active')) {
                    switchCurvesTab('curves');
                }
            }
        }
        
        populateCurveSummary(basicProduct, true);
        populateMarksTable(basicProduct);
        
        // Show the panel and adjust grid width
        panel.classList.remove('hidden');
        tableWrapper.style.width = '25%';
        
        // Hide pagination when panel is visible
        const contentBottom = document.querySelector('.content-bottom');
        if (contentBottom) {
            contentBottom.classList.add('panel-visible');
        }
    }
}

function loadSavedFilter(value) {
    // Filter loading logic can be added here if needed
}

let gridLoadingOverlayTimeoutId = null;

function showGridLoadingOverlay(durationMs = 1500) {
    const tableContainer = document.querySelector('.content-bottom .table-container');
    if (!tableContainer) return;
    if (gridLoadingOverlayTimeoutId !== null) {
        clearTimeout(gridLoadingOverlayTimeoutId);
        gridLoadingOverlayTimeoutId = null;
    }
    tableContainer.classList.add('loading');
    gridLoadingOverlayTimeoutId = window.setTimeout(() => {
        tableContainer.classList.remove('loading');
        gridLoadingOverlayTimeoutId = null;
    }, durationMs);
}

const SAVED_FILTER_PLACEHOLDER_TEXT = 'Select a preset...';

function savedFilterShowsPlaceholder() {
    const el = document.getElementById('saved-filters-value');
    if (!el) return true;
    if (el.classList.contains('placeholder')) return true;
    const t = el.textContent.trim();
    return t === 'Select filter' || t === SAVED_FILTER_PLACEHOLDER_TEXT;
}

function resetPresetSelectorToPlaceholder() {
    const savedFiltersValue = document.getElementById('saved-filters-value');
    if (savedFiltersValue) {
        savedFiltersValue.textContent = SAVED_FILTER_PLACEHOLDER_TEXT;
        savedFiltersValue.classList.add('placeholder');
    }
    document.querySelectorAll('.custom-select-item').forEach(item => {
        item.classList.remove('selected');
    });
}

// Store original parent for dropdown restoration
let savedFiltersDropdownOriginalParent = null;

// Custom Saved Filters Dropdown
function toggleSavedFiltersDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('saved-filters-options');
    if (!dropdown) return;
    
    const trigger = event.currentTarget;
    const isOpen = dropdown.classList.contains('open');
    
    if (isOpen) {
        dropdown.classList.remove('open');
        dropdown.style.top = '';
        dropdown.style.left = '';
        dropdown.style.width = '';
        dropdown.style.position = '';
        dropdown.style.visibility = '';
        dropdown.style.zIndex = '';
        
        // Move dropdown back to original parent if it was moved
        if (savedFiltersDropdownOriginalParent && dropdown.parentElement === document.body) {
            savedFiltersDropdownOriginalParent.appendChild(dropdown);
            savedFiltersDropdownOriginalParent = null;
        }
    } else {
        // Store original parent before moving
        if (dropdown.parentElement !== document.body) {
            savedFiltersDropdownOriginalParent = dropdown.parentElement;
            document.body.appendChild(dropdown);
        }
        
        // Calculate position for fixed dropdown
        const rect = trigger.getBoundingClientRect();
        
        dropdown.style.position = 'fixed';
        dropdown.style.top = (rect.bottom + 4) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = Math.max(rect.width, 220) + 'px';
        dropdown.style.display = 'block';
        dropdown.style.visibility = 'visible';
        dropdown.style.zIndex = '10000';
        dropdown.classList.add('open');
    }
}

// Helper function to close dropdown and restore position
function closeSavedFiltersDropdown() {
    const dropdown = document.getElementById('saved-filters-options');
    if (!dropdown) return;
    
    dropdown.classList.remove('open');
    dropdown.style.display = 'none';
    dropdown.style.top = '';
    dropdown.style.left = '';
    dropdown.style.width = '';
    dropdown.style.position = '';
    dropdown.style.visibility = '';
    dropdown.style.zIndex = '';
    
    // Move dropdown back to original parent if it was moved
    if (savedFiltersDropdownOriginalParent && dropdown.parentElement === document.body) {
        savedFiltersDropdownOriginalParent.appendChild(dropdown);
        savedFiltersDropdownOriginalParent = null;
    }
}

function selectSavedFilter(item) {
    const value = item.dataset.value;
    const label = item.querySelector('.custom-select-item-label').textContent;
    const savedFiltersValue = document.getElementById('saved-filters-value');
    savedFiltersValue.textContent = label;
    savedFiltersValue.classList.remove('placeholder');
    
    closeSavedFiltersDropdown();
    
    // Mark as selected
    document.querySelectorAll('.custom-select-item').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    
    // Update card title
    updatePageTitle(label);
    
    loadSavedFilter(value);
    showGridLoadingOverlay();
}

function updatePageTitle(filterName) {
    // Clear screen title filter (no longer showing filter name)
    const titleFilter = document.getElementById('page-title-filter');
    if (titleFilter) {
        titleFilter.textContent = '';
    }
    
    // Update Curves tab title (hidden but code preserved)
    const curvesTab = document.getElementById('curves-tab');
    if (curvesTab) {
    if (filterName) {
            curvesTab.innerHTML = 'Curves <span style="color: #ccc; margin: 0 2px;">|</span> <span style="font-weight: normal;">' + filterName + '</span>';
    } else {
            curvesTab.textContent = 'Curves';
        }
    }
    
    // Note: Card title is only updated when Apply Filters is pressed (see loadData function)
}

function toggleFavorite(event, button) {
    event.stopPropagation();
    
    // If this button is already active, don't allow deselecting (radio button behavior)
    if (button.classList.contains('active')) {
        return;
    }
    
    // Deselect all other favorites first
    const allFavorites = document.querySelectorAll('.custom-select-item-action.favorite');
    allFavorites.forEach(fav => {
        fav.classList.remove('active');
        fav.textContent = '☆';
    });
    
    // Select this one
    button.classList.add('active');
    button.textContent = '★';
}

function deleteFilter(event, button) {
    event.stopPropagation();
    const item = button.closest('.custom-select-item');
    const filterName = item.querySelector('.custom-select-item-label').textContent;
    if (confirm(`Delete filter "${filterName}"?`)) {
        item.remove();
    }
}

// Add click handlers to select items
document.addEventListener('DOMContentLoaded', function() {
    // Set initial page title with default filter
    const defaultFilter = document.getElementById('saved-filters-value').textContent;
    updatePageTitle(defaultFilter);
    
    // Set As Of date to today
    const asOfDate = document.getElementById('as-of-date');
    if (asOfDate) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        asOfDate.value = `${year}-${month}-${day}`;
    }
    
    document.querySelectorAll('.custom-select-item').forEach(item => {
        item.addEventListener('click', function(e) {
if (!e.target.closest('.custom-select-item-action')) {
                selectSavedFilter(this);
            }
        });
    });

    // Initialize column resize functionality
    initColumnResize();
    
    // Initialize panel resize functionality
    initPanelResize();
    
    // Initialize responsive pagination
    initResponsivePagination();
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('saved-filters-dropdown');
    const options = document.getElementById('saved-filters-options');
    if (dropdown && options && !dropdown.contains(e.target) && !options.contains(e.target)) {
        closeSavedFiltersDropdown();
    }
});

/* ============================================
   COLUMN RESIZE - Resizable Columns
   ============================================ */
function initColumnResize() {
    const surfacesResizeHandle = document.getElementById('column-resize-handle');
    const volatilitiesResizeHandle = document.getElementById('volatilities-column-resize-handle');

    if (surfacesResizeHandle) {
        setupResizeHandle(surfacesResizeHandle, 'surfaces');
    }

    if (volatilitiesResizeHandle) {
        setupResizeHandle(volatilitiesResizeHandle, 'volatilities');
    }
}

function setupResizeHandle(handle, tabType) {
    let isResizing = false;
    let startX = 0;
    let startLeftWidth = 0;
    let startRightWidth = 0;
    let leftColumn, rightColumn, container;

    handle.addEventListener('mousedown', function(e) {
        isResizing = true;
        handle.classList.add('resizing');
        startX = e.clientX;

        // Find the columns based on tab type (detail panel uses curves-tab-content and options-tab-content)
        if (tabType === 'surfaces') {
            container = document.getElementById('curves-tab-content');
            leftColumn = container ? container.querySelector('.curves-left-column') : null;
            rightColumn = container ? container.querySelector('.curves-right-column') : null;
        } else if (tabType === 'volatilities') {
            container = document.getElementById('options-tab-content');
            leftColumn = container ? container.querySelector('.curves-left-column') : null;
            rightColumn = container ? container.querySelector('.volatilities-right-column') : null;
        }

        if (leftColumn && rightColumn && container) {
            const containerRect = container.getBoundingClientRect();
            startLeftWidth = leftColumn.getBoundingClientRect().width;
            startRightWidth = rightColumn.getBoundingClientRect().width;
        }

        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing || !leftColumn || !rightColumn || !container) return;

        const containerWidth = container.getBoundingClientRect().width;
        const handleWidth = handle.getBoundingClientRect().width;
        const deltaX = e.clientX - startX;
        const newLeftWidth = startLeftWidth + deltaX;
        const newRightWidth = startRightWidth - deltaX;

        // Min width constraints
        const minWidth = 200;
        const maxLeftWidth = containerWidth - handleWidth - minWidth;
        const maxRightWidth = containerWidth - handleWidth - minWidth;

        if (newLeftWidth >= minWidth && newLeftWidth <= maxLeftWidth && 
            newRightWidth >= minWidth && newRightWidth <= maxRightWidth) {
            const leftPercent = (newLeftWidth / containerWidth) * 100;
            const rightPercent = (newRightWidth / containerWidth) * 100;

            leftColumn.style.flex = `0 0 ${leftPercent}%`;
            rightColumn.style.flex = `0 0 ${rightPercent}%`;
            
            // Resize charts when columns are resized
            if (tabType === 'surfaces' && curvesChartInstance) {
                curvesChartInstance.resize();
            } else if (tabType === 'volatilities' && volatilitiesChartInstance) {
                volatilitiesChartInstance.resize();
            }
        }
    });

    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            handle.classList.remove('resizing');
            
            // Final chart resize after resize is complete
            if (tabType === 'surfaces' && curvesChartInstance) {
                setTimeout(() => curvesChartInstance.resize(), 10);
            } else if (tabType === 'volatilities' && volatilitiesChartInstance) {
                setTimeout(() => volatilitiesChartInstance.resize(), 10);
            }
        }
    });
}

/* ============================================
   PANEL RESIZE - Resize Grid and Detail Panel
   ============================================ */
function initPanelResize() {
    const panelResizeHandle = document.getElementById('panel-resize-handle');
    if (!panelResizeHandle) return;

    let isResizing = false;
    let startX = 0;
    let startTableWidth = 0;
    let startPanelWidth = 0;
    let tableWrapper, detailPanel, container;

    panelResizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        panelResizeHandle.classList.add('resizing');
        startX = e.clientX;

        tableWrapper = document.querySelector('.table-wrapper');
        detailPanel = document.getElementById('detail-panel');
        container = document.querySelector('.content-bottom');

        if (tableWrapper && detailPanel && container) {
            startTableWidth = tableWrapper.getBoundingClientRect().width;
            startPanelWidth = detailPanel.getBoundingClientRect().width;
        }

        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing || !tableWrapper || !detailPanel || !container) return;

        const containerWidth = container.getBoundingClientRect().width;
        const handleWidth = 24; // Resize handle width
        const deltaX = e.clientX - startX;
        const newTableWidth = startTableWidth + deltaX;
        const newPanelWidth = startPanelWidth - deltaX;

        // Min width constraints
        const minTableWidth = 300;
        const minPanelWidth = 300;
        const maxTableWidth = containerWidth - handleWidth - minPanelWidth;
        const maxPanelWidth = containerWidth - handleWidth - minTableWidth;

        if (newTableWidth >= minTableWidth && newTableWidth <= maxTableWidth && 
            newPanelWidth >= minPanelWidth && newPanelWidth <= maxPanelWidth) {
            const tablePercent = (newTableWidth / containerWidth) * 100;
            const panelPercent = (newPanelWidth / containerWidth) * 100;

            tableWrapper.style.flex = `0 0 ${tablePercent}%`;
            detailPanel.style.width = `calc(${panelPercent}% - 12px)`;
            
            // Resize charts when panel is resized
            if (curvesChartInstance) {
                curvesChartInstance.resize();
            }
            if (volatilitiesChartInstance) {
                volatilitiesChartInstance.resize();
            }
        }
    });

    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            panelResizeHandle.classList.remove('resizing');
            
            // Final chart resize after panel resize is complete
            setTimeout(() => {
                if (curvesChartInstance) {
                    curvesChartInstance.resize();
                }
                if (volatilitiesChartInstance) {
                    volatilitiesChartInstance.resize();
                }
            }, 10);
        }
    });
}

/* ============================================
   RESPONSIVE PAGINATION - Handle Narrow Widths
   ============================================ */
function initResponsivePagination() {
    // Use ResizeObserver as fallback for browsers without container query support
    const paginationElements = document.querySelectorAll('.curves-pagination, .pagination-row');
    
    paginationElements.forEach(element => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const countText = entry.target.querySelector('.pagination-count-text');
                const pageText = entry.target.querySelector('.pagination-page-text');
                
                // Hide text when narrow (500px threshold)
                if (width <= 500) {
                    if (countText) countText.style.display = 'none';
                    if (pageText) pageText.style.display = 'none';
                } else {
                    if (countText) countText.style.display = '';
                    if (pageText) pageText.style.display = '';
                }
                
                // Reduce gaps when very narrow (350px threshold)
                const controls = entry.target.querySelector('.pagination-controls');
                const info = entry.target.querySelector('.pagination-info');
                if (width <= 350) {
                    if (controls) controls.style.gap = '4px';
                    if (info) info.style.gap = '4px';
                } else {
                    if (controls) controls.style.gap = '';
                    if (info) info.style.gap = '';
                }
            }
        });
        
        resizeObserver.observe(element);
    });
}

function loadData() {
    resetPresetSelectorToPlaceholder();
    updatePageTitle('');
    
    // Close detail panel if it's visible
    const panel = document.getElementById('detail-panel');
    if (panel && !panel.classList.contains('hidden')) {
        closeDetailPanel();
    }
    
    showGridLoadingOverlay();
    
    // Data loading logic can be added here if needed
}

// Set up event listener for filter name input to enable/disable Save button
const filterNameInput = document.getElementById('filter-name-input');
const saveFilterBtn = document.getElementById('save-filter-btn');
if (filterNameInput && saveFilterBtn) {
    filterNameInput.addEventListener('input', function() {
        saveFilterBtn.disabled = this.value.trim() === '';
    });
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('visible');
        }
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.legend-btn') && !e.target.closest('.legend-popover')) {
        document.getElementById('legend-popover').classList.remove('visible');
    }
    if (!e.target.closest('.action-dropdown')) {
        const dropdown = document.getElementById('selection-action-dropdown');
        if (dropdown) dropdown.classList.remove('visible');
    }
});

// Initialize
populateTable();
