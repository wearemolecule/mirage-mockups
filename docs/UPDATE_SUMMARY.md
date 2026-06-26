# Market Data v3 - Update Summary

## Overview
This document summarizes the functional updates and improvements made to the Market Data application interface.

---

## Navigation & Terminology Updates

### Tab Renaming
- **Detail Panel Tabs**: Renamed "Surfaces" to "Curves" and "Volatilities" to "Options"
- Updated all related CSS classes, JavaScript functions, and references throughout the application

### Filter & Column Label Updates
- **Filter Labels**:
  - "Curves" → "Spots/Curves"
  - "Region / ISO" → "TSO"
  - "Source" → "Mark Level"
- **Column Headers**:
  - "Source" → "Mark Level" (main grid and detail grids)
  - "Option" → "Strike" (main grid)
- **Placeholder Text**: Updated TSO and Mark Level filter placeholders to "All"

---

## Download & Export Functionality

### Download Menu Restructure
- Replaced "Download Surfaces" button with a dropdown menu titled "Download"
- **Download Menu Items** (Title Case):
  - Curves / Settles
  - Option Prices (updated from "Option prices")
  - Options / Vols
  - **--- divider ---**
  - Current View (quick download)
  - Current View + Settings (opens Download Settings modal)
  - **--- divider ---**
  - Presets (opens Download Presets modal)
- **Visual Improvements**:
  - Added horizontal dividers to separate menu groups
  - Removed ban cursor from Download button (now shows pointer)
  - Added ban cursor to dropdown items that do nothing (Curves/Settles, Option Prices, Options/Vols, Current View)

### Get Templates Menu
- Updated dropdown items to (Title Case):
  - Curves / Settles
  - Option Prices (updated from "Option prices")
  - Options / Vols

### Modal Updates
- **Download Curves** → **Download Presets**: 
  - Renamed modal and all related classes/IDs
  - Removed "Download Presets" button from action menu
  - Removed "Current View" from modal (moved to main Download dropdown)
  - Added all 8 presets from Presets filter:
    - US Power, Daily Gas, Monthly Power, Options Snapshot, Quarterly Metals, Weekly Natural Gas, Options Roll Over, Power Swaps
  - Changed "Dates" button to "Settings" in the modal
  - Changed section title from "Download Dates" to "Settings"
  - Updated "As Of" and "Contract Date" inputs: labels above inputs (not input groups)
  - Decreased space between label and input, set input height to 32px
  - Moved informational message below date inputs (instead of above)
  - Updated descriptive text: "*As Of and Contract Dates apply when downloading this item. If not set, the current view's dates will be used."
  - Added calendar icons to date inputs (matching Download Settings modal)
  - Increased spacing below "Settings" title (16px margin-bottom)
  - **Header Improvements**:
    - Moved subtitle "Guaranteed-complete extracts • Verified before download" to modal header below title
    - Updated header layout to stack title and subtitle vertically
  - **Visual Styling**:
    - Added light grey background (#f2f2f3) to download items
    - Added light grey background to outline buttons with darker grey hover (#e5e5e8)
    - Set Settings inputs to white backgrounds for better contrast
  - **Layout**:
    - Set modal body height to 500px with scrollable content
  - **Edit Functionality**:
    - Edit button closes modal and populates filters with the selected preset
    - Each preset's Edit button passes correct preset value and name
- **Download Dates** → **Download Settings**: 
  - Renamed modal and all related classes/IDs
  - Updated input layout: labels above inputs (not input groups)
  - Added calendar icons to date inputs
  - Updated descriptive text to clarify date usage
  - Added info box with light yellow background explaining date usage

---

## Preset Management

### Selection Bar Updates
- **Button Text**: "Add to Download List" → "Add to Preset"
- **Download Dropdown**: Updated to show "Download + Settings" option (changed from "Download With Settings")

### Filters Section
- **Label**: "Saved Filters" → "Presets"
- **Button**: "Save Filter" → "Save As a Preset"
- **Modal Title**: "Save Filter" → "Save As a Preset"
- **Save Button**: Disabled until name is entered in the input field

### Add Selected Products to Preset Modal
- **Modal Title**: "Add Selected Items To Download List" → "Add Selected Products to a Preset"
- **Button Text**: Simplified from "Add to / Create Preset" to "Add to Preset" (modal UI shows both options)
- **Section Titles** (Title Case):
  - "Add to a preset" → "Add to a Preset"
  - "Or create a new preset" → "Or Create a New Preset" (14px, regular weight)
  - "Download Settings (optional)" → "Download Settings (Optional)" (matching styling: 14px, regular weight)
- **Layout Improvements**:
  - Removed vertical divider between product list and options sections
  - Consistent spacing for all sections: 0 top margin, 2rem bottom margin
- **Removed Features**:
  - Removed search/add functionality above product list (selection done on main grid)
- **New Features**:
  - Added "Download Settings (Optional)" section with As Of and Contract Date inputs
  - Added calendar icons to date inputs
  - Added informational text about date usage (light yellow background)
  - Added "Add + Download" button alongside "Add" button
  - Dynamic button text: "Add" vs "Create" based on whether preset is selected or name is entered
  - Mutually exclusive preset/name inputs (selecting one clears the other)
- **Preset Options**: Updated to match filter presets:
  - US Power, Daily Gas, Monthly Power, Options Snapshot, Quarterly Metals, Weekly Natural Gas, Options Roll Over, Power Swaps
- **Input Placeholders** (Title Case): "Select a Preset" and "Preset Name"
- **Footer Button Order**: Cancel | Add + Download (secondary) | Add (primary)
- **Modal Height**: Fixed at 720px with scrollable product list
- **Button States**:
  - "Add" and "Add + Download" buttons disabled until preset is selected or name is entered
  - Buttons enable/disable dynamically based on input state

---

## Action Menus

### Options with Tabs (Curves + Options)
- **Updated Action Menu Items**:
  - Plus icon button (replaces "Add Mark")
  - Download Prices (replaces "Download Surface")
  - Download Vols
  - Upload File (replaces "Upload Surface/Vols")

### Cursor Improvements
- Removed ban cursor from Download and Get Templates buttons (now show pointer cursor)
- Added ban cursor to dropdown items that do nothing:
  - Download dropdown: Curves/Settles, Option Prices, Options/Vols, Current View (all call `downloadItem()` which only logs)
  - Templates dropdown: All items (call `getTemplate()` which only logs)
- Items that open modals (Current View + Settings, Presets) maintain pointer cursor

---

## Data Display

### Pagination
- Updated pagination text from "of 1000" to "of many" across all pagination instances

### Selection Behavior
- **Select All Checkbox**: Closes detail panel when checked (matching individual checkbox behavior)
- Ensures consistent behavior between header checkbox and row checkboxes

## Revalue Trades Modal

### As Of Input
- Added informational message below "As Of" input field
- Message text: "*Message about day after. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
- Styled with 11px font size, grey color (#666), and 8px top margin

---

## UI/UX Improvements

### Title Casing
- Standardized all buttons and titles to Title Case throughout the application
- Updated dropdown menu items: "Option prices" → "Option Prices"
- Updated input placeholders: "Select a preset" → "Select a Preset", "Preset name" → "Preset Name"
- Updated section titles to proper Title Case

### Visual Hierarchy
- Made "Or Create a New Preset" section less prominent (14px, regular weight) to emphasize primary "Add to a Preset" action
- Maintained consistent dotted borders and spacing for section headers

## Layout & Styling Improvements

### Filter Panel & Panels Container
- Removed border from `.panels-container`
- Removed bottom border from `.filter-panel` and set bottom padding to 0
- Standardized left and right padding between `.filter-panel` and `.panels-container` (both use 1em)

### Loading Overlay
- Fixed loading overlay visibility in Load Data functionality
- Updated selector to be more specific (`.content-bottom .table-container`)
- Changed background from light grey to semi-transparent white (rgba(255, 255, 255, 0.9)) for better visibility

## Technical Improvements

- Updated all CSS class names and JavaScript function names to reflect new terminology
- Ensured consistent naming conventions across HTML, CSS, and JavaScript
- Maintained backward compatibility where possible
- Fixed modal height constraints for better usability (720px fixed height with scrollable content)
- Implemented dynamic button text updates based on user input state
- Added mutually exclusive input logic for preset selection and name entry
- Removed hidden/unused code sections (tabs and actions section)
- Added dropdown dividers with darker styling (#cbcbd2) for better visual separation
- Updated border-radius selectors to use `:first-of-type` and `:last-of-type` for proper styling with dividers
- Implemented button disable/enable logic for form validation
- Added event listeners for real-time input validation

---

## Notes
- All changes maintain existing functionality while improving clarity and user experience
- Terminology updates align with business requirements and user feedback
- Modal layouts have been optimized for better content organization
- "Settings" was suggested to use instead of "Parameters" as discussed. "Settings" determined to be more understandable by users.
