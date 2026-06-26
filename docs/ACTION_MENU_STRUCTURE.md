# Action Menu Structure

This document outlines the structure, organization, and styling of action menus throughout the Market Data application.

## Overview

Action menus are used in two main locations:
1. **Main Curves Card** - Primary action menu for the entire curves grid
2. **Detail Panel** - Context-specific actions when viewing product details

---

## Main Curves Card Action Menu

**Location**: Top-right of the Curves card header  
**Container Class**: `.curves-card-actions`

### Structure

The main action menu is organized into three functional groups separated by visual dividers:

#### Group 1: Primary Actions (Modal Launchers)
- **Track Daily Curves** (`action-btn-primary`)
  - Function: `showDailyCurveTrackerModal()`
  - Opens modal for tracking daily curves
  
- **Separator** (`action-separator`)

- **Revalue Trades** (`action-btn-primary`)
  - Function: `showRevalueProductsModal()`
  - Opens modal for revaluing trades
  - Note: Previously named "Revalue Products"

- **Separator** (`action-separator`)

#### Group 2: File Operations
- **Upload File** (`action-btn`)
  - Standard action button (no primary styling)

- **Download Curves** (`action-btn`)
  - Function: `showDownloadCurvesModal()`
  - Opens download curves modal

- **Download Surfaces** (`action-btn`)
  - Standard action button

#### Group 3: Templates
- **Get Templates** (`action-btn` with dropdown)
  - Container: `.templates-dropdown-wrapper`
  - Button: `.templates-btn-main`
  - Dropdown: `.templates-dropdown`
  - Options:
    - Curves
    - Surfaces
    - Vols
  - Function: `getTemplate(type)`

### Visual Structure

```
[Track Daily Curves] | [Revalue Trades] | [Upload File] [Download Curves] [Download Surfaces] [Get Templates ▼]
  (Primary)            (Primary)           (Standard)     (Standard)        (Standard)         (Standard + Dropdown)
```

---

## Detail Panel Action Menus

### Non-Option Products

**Location**: Right side of `.detail-section-header` when viewing non-option products  
**Container Class**: `.detail-section-actions`

#### Actions
- **Add Mark** (`action-btn`)
- **Upload Curve** (`action-btn`)
- **Download Curve** (`action-btn`)

**Note**: No separators used in detail panel menus

### Option Products (Curves + Volatilities Tabs)

**Location**: Right side of `.curves-tabs-row` when viewing option products  
**Container Class**: `.actions`

#### Actions
- **Add Mark** (`action-btn`)
- **Upload Curve/Vols** (`action-btn`)
- **Download Curve** (`action-btn`)
- **Download Vols** (`action-btn`)

**Note**: No separators used in detail panel menus

---

## Button Types & Styling

### Primary Action Buttons

**Class**: `.action-btn-primary`

**Purpose**: Used for high-priority actions that launch modals (Track Daily Curves, Revalue Trades)

**Styling**:
- Background: `#f8edcc` (Light accent yellow)
- Border: `#e8c97a` (Slightly darker yellow border)
- Text Color: `var(--color-text-primary)` (Dark grey)
- Hover Background: `#f5e6c0` (Slightly darker yellow)
- Hover Border: `#e0c085` (Slightly darker yellow border)
- Font Size: `11px`
- Border Radius: `var(--radius-md)` (4px)

**Usage**:
- Only applied to modal-launching actions in the main menu
- Not used in detail panel action menus

### Standard Action Buttons

**Class**: `.action-btn`

**Purpose**: Used for standard file operations and other secondary actions

**Styling**:
- Background: `var(--color-bg-secondary)` (`#f2f2f3`)
- Border: `1px solid var(--color-border-light)` (`#e5e5e8`)
- Text Color: `var(--color-gray-800)` (`#1a1a1a`)
- Hover Background: `var(--color-gray-200)` (`#e5e5e8`)
- Hover Border: `var(--color-border-medium)` (`#cbcbd2`)
- Font Size: `11px`
- Border Radius: `var(--radius-md)` (4px)

**Usage**:
- File operations (Upload, Download)
- Template dropdown
- All detail panel actions

---

## Separators (Delineations)

**Class**: `.action-separator`

**Purpose**: Visual dividers to group related actions

**Styling**:
- Width: `1px`
- Height: `20px`
- Background: `var(--color-border-medium)` (`#cbcbd2`)
- Margin: `0 var(--spacing-md)` (0 8px)
- Alignment: `align-self: center`

**Usage**:
- Placed between functional groups in the main action menu
- **Not used** in detail panel action menus
- Separates:
  1. Primary actions (Track Daily Curves, Revalue Trades) from file operations
  2. File operations from templates

---

## Layout & Spacing

### Main Action Menu (`.curves-card-actions`)
- Display: `flex`
- Gap: `4px` between items
- Alignment: Items are aligned in a horizontal row

### Detail Panel Actions (`.detail-section-actions`, `.actions`)
- Display: `flex` (inherited from parent)
- Gap: `4px` between items
- No separators used

---

## Functional Grouping Logic

### Main Menu Groups

1. **Primary Actions** (Modal Launchers)
   - Track Daily Curves
   - Revalue Trades
   - *Separator*

2. **File Operations**
   - Upload File
   - Download Curves
   - Download Surfaces
   - *No separator before templates*

3. **Templates**
   - Get Templates (with dropdown)

### Rationale

- **Primary buttons** are visually distinct (yellow background) to indicate they launch modals/workflows
- **Separators** create visual breaks between functional groups
- **File operations** are grouped together as they share similar functionality
- **Templates** is a dropdown menu, visually distinct from standard buttons

---

## Implementation Notes

### HTML Structure Example

```html
<div class="curves-card-actions">
    <!-- Primary Action -->
    <button class="action-btn action-btn-primary" onclick="showDailyCurveTrackerModal()">
        Track Daily Curves
    </button>
    
    <!-- Separator -->
    <span class="action-separator"></span>
    
    <!-- Another Primary Action -->
    <button class="action-btn action-btn-primary" onclick="showRevalueProductsModal()">
        Revalue Trades
    </button>
    
    <!-- Separator -->
    <span class="action-separator"></span>
    
    <!-- Standard Actions -->
    <button class="action-btn">Upload File</button>
    <button class="action-btn" onclick="showDownloadCurvesModal()">Download Curves</button>
    <button class="action-btn">Download Surfaces</button>
    
    <!-- Dropdown Menu -->
    <div class="templates-dropdown-wrapper">
        <button class="action-btn templates-btn-main">
            Get Templates
            <i class="fas fa-caret-down" style="margin-left: 6px; font-size: 10px;"></i>
        </button>
        <div class="templates-dropdown">
            <div class="templates-dropdown-item" onclick="getTemplate('curves')">Curves</div>
            <div class="templates-dropdown-item" onclick="getTemplate('surfaces')">Surfaces</div>
            <div class="templates-dropdown-item" onclick="getTemplate('vols')">Vols</div>
        </div>
    </div>
</div>
```

### CSS Classes Reference

- `.curves-card-actions` - Main action menu container
- `.action-btn` - Standard action button
- `.action-btn-primary` - Primary action button (yellow styling)
- `.action-separator` - Visual divider between groups
- `.templates-dropdown-wrapper` - Templates dropdown container
- `.templates-btn-main` - Templates button
- `.templates-dropdown` - Dropdown menu
- `.templates-dropdown-item` - Individual dropdown option
- `.detail-section-actions` - Detail panel actions container (non-option)
- `.actions` - Detail panel actions container (option products)

---

## Future Considerations

- Consider adding icons to primary action buttons if needed
- Evaluate if additional separators would improve clarity
- Monitor user feedback on button grouping and visual hierarchy
- Consider accessibility improvements (ARIA labels, keyboard navigation)
