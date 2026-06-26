# Market Data Screen - Feature List & How-To Guide

## Key Features

### 📊 **Curves Grid & Filtering**
- **Search & Filter**: ⚠️ Visual only - Search bar with magnifying-glass icon (no actual filtering functionality)
- **Filter Options**: 
  - As Of date picker - ✅ Functional (can select dates, but doesn't filter data)
  - Curves/Opt-Vol checkboxes - ✅ Functional (can toggle, but doesn't filter data)
  - "More" button - ✅ Functional (expands/collapses additional filters with smooth slide animation)
  - Additional filters (Commodity, Region/ISO, Source, Instrument, Currency, Frequency) - ⚠️ Visual only (dropdowns work but don't filter)
  - All filter elements (inputs, labels, buttons) are standardized to 32px height
- **Filter Panel Animation**: ✅ Functional (filter panel fades out then slides up when detail panel opens)
- **Saved Filters**: ✅ Functional (dropdown works, can select filters, updates card title)
- **Clear Filters**: ✅ Functional (resets all filter inputs and updates card title to "All Results")
- **Load Data Button**: ✅ Functional (updates card title with selected filter name)
- **Card Title**: ✅ Functional (shows selected filter name after "Load Data" is pressed, or "All Results" when no filter is selected)
- **Option Column**: ✅ Functional (displays strike range for option products, "-" for non-options)

### 📈 **Product Detail Panel**
- **View Details**: ✅ Functional (click any product row to open detail panel with smooth slide-in animation)
- **Resizable Layout**: ✅ Functional (can drag resize handle between main grid and detail panel, and between left/right columns within detail panel; charts automatically resize)
- **Curves Tab**: 
  - View curves data in a table format - ✅ Functional (table displays with data)
  - 3D surface chart visualization - ⚠️ Visual only (static chart with accent color gradient: blue → yellow → orange, no data interaction)
  - Call/Put toggle - ⚠️ Visual only (buttons toggle active state but don't change chart data)
  - Chart placeholder for non-options products - ✅ Functional (shows "Chart Placeholder" text for non-option products)
- **Volatilities Tab** (Options only, when volatilities are available):
  - View volatility surface data - ✅ Functional (table displays with data)
  - 3D surface chart - ⚠️ Visual only (static chart, no hover interactions)
  - Info icon with tooltip - ✅ Functional (tooltip appears on hover)
  - Only displays if the option product has volatilities data - ✅ Functional (tab visibility logic works)
- **Non-Option Products**: ✅ Functional (displays as simplified view with section header, no tabs)
- **Source Section**: ✅ Functional (expandable/collapsible section)
- **Close Button**: ✅ Functional (closes panel with smooth slide-out animation; hover state shows red background with white icon)
- **Tab Switching**: ✅ Functional (can switch between Curves and Volatilities tabs)
- **Panel Title**: ✅ Functional (product name is bold, contract date is normal weight)

### 🎯 **Selection & Actions**
- **Select Products**: ✅ Functional (checkboxes work, can select individual products or "Select All")
- **Selection Bar**: ✅ Functional (appears when products are selected, shows count, automatically appears even when detail panel is open)
- **Actions Menu**:
  - **Track Daily Curves** (Primary) - ✅ Functional (opens modal with heatmap visualization)
  - **Revalue Trades** (Primary) - ✅ Functional (opens modal, can search and add products, set dates)
  - **Upload File** - ⚠️ Visual only (button exists but no file upload functionality)
  - **Download Curves** - ✅ Functional (opens modal with download lists)
  - **Download Surfaces** - ⚠️ Visual only (button exists but no functionality)
  - **Get Templates** (Dropdown) - ⚠️ Visual only (dropdown appears but no template download functionality)
- **Detail Panel Actions**: ⚠️ Visual only (buttons exist but no functionality - Add Mark, Upload Curve/Vols, Download Curve, Download Vols)

### 💾 **Download Functionality**
- **Download Curves Modal**: ✅ Functional (opens/closes, can expand/collapse items)
  - View and manage download lists - ✅ Functional (lists display, can expand/collapse)
  - "Current View" option - ⚠️ Visual only (button exists but no download functionality)
  - Saved download lists - ✅ Functional (can expand items to set dates)
  - **Download Dates**: ✅ Functional (can expand items, set As Of and Contract Date ranges)
  - Scrollable list - ✅ Functional (modal body is scrollable)
- **Download With Dates**: ⚠️ Visual only (can set date ranges but no actual download functionality)
- **Add to Download List** (Selection Bar) - ⚠️ Visual only (button exists but no functionality)
- **Download** (Selection Bar) - ⚠️ Visual only (button exists but no functionality)

### 🔄 **Workflow Features**
- **Revalue Trades**: ✅ Functional (modal opens/closes)
  - Search and add products - ⚠️ Visual only (search input works but doesn't filter, "Add" button doesn't add products)
  - Set custom "As Of" date - ✅ Functional (date picker works)
  - Warning message for user-provided data - ✅ Functional (displays when applicable)
  - Revalue button - ⚠️ Visual only (button exists but no revalue functionality)
- **Track Daily Curves**: ✅ Functional (modal opens/closes)
  - Monitor curve tracking status - ✅ Functional (heatmap displays with status colors)
  - Visual heatmap - ✅ Functional (shows received/copied/not received status, can expand/collapse sections)
- **Needs Attention**: ✅ Functional (button opens modal, modal displays product list, can click products to view details)

## How-To Guide

### Viewing Product Details
1. Use filters or search to find products
2. Click any product row in the curves grid
3. Detail panel slides in from the right with smooth animation
4. View Curves data (always available) or Volatilities (options only, when available)
5. For option products with volatilities: Tabs appear for Curves and Volatilities
6. For option products without volatilities: Displayed as non-option view with section header
7. Click the circular close button or click outside to close (panel slides out smoothly)

### Selecting & Downloading Products
1. Check the boxes next to products you want to select
2. Selection bar appears at the bottom with count
3. Click "Download" to download selected products
4. Or use "Add to Download List" to save for later

### Using Download Curves
1. Click "Download Curves" in the action menu
2. Choose "Current View" or a saved list
3. Click "Dates" on any item to set custom date ranges
4. Click "Download" to proceed

### Filtering Products
1. Use the search bar for quick lookup
2. Set "As Of" date for time-based filtering
3. Toggle Curves/Opt-Vol checkboxes
4. Click "More" for advanced filters (Commodity, Region, Source, etc.)
5. Use "Saved Filters" dropdown for quick access to presets

### Revaluing Trades
1. Click "Revalue Trades" in the action menu
2. Search for products to add
3. Set the "As Of" date
4. Review the list and click "Revalue"

## Notes

### Functional Features (✅)
- Product detail panel open/close with smooth animations
- Tab switching in detail panel (Curves/Volatilities)
- Product selection with checkboxes and selection bar
- Filter UI interactions (dropdowns, date pickers, checkboxes)
- Modal open/close functionality
- Expandable/collapsible sections
- Tooltips and info icons
- Card title updates based on filter selection
- Conditional display logic (tabs, volatilities visibility)

### Visual/Placeholder Features (⚠️)
- Charts are static visualizations and do not interact with grid data
- No actual data filtering (filters are UI-only)
- No file upload/download functionality
- No template download functionality
- No actual revalue calculations
- Search inputs don't filter data
- Pagination buttons don't change page (visual only)

### Design Details
- 3D charts use accent color gradient (blue → yellow → orange) for visual appeal
- Chart fade-in animation is optimized (0.3s transition)
- Detail panel automatically clears selections when opened
- Non-options products show a simplified Curves view without tabs
- Option products without volatilities display as non-option view (no Volatilities tab)
- All date pickers support range selection (MM/DD/YYYY - MM/DD/YYYY)
- Filter labels no longer include colons (cleaner appearance)
- Account name displays as "Meridian Energy" in header
- Region selector uses location-dot icon instead of chevron
- Server filters section has dotted top border for visual separation
- Pagination buttons are compact (20px × 20px) and borderless
- **Resizable Columns**: ✅ Functional (detail panel columns can be resized by dragging; 3D charts automatically resize)
- **Resizable Panel**: ✅ Functional (main grid and detail panel can be resized by dragging the handle between them)
- **Product Name Styling**: Brackets "[" and "]" in product names are light grey and normal weight (not bold)
- **Tab Styling**: Inactive tabs have lighter font color than active tabs for better visual distinction
- **Responsive Pagination**: ✅ Functional (pagination controls adapt to narrow container widths, hiding text when needed)
- **Saved Filters Dropdown**: ✅ Functional (uses fixed positioning to avoid overflow clipping, appears above all elements)