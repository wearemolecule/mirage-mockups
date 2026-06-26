# Shared CSS

Reusable styles for Market Data screens. Used by `alerts.html`, `market-data-v3.html`, and any new screens.

## Usage

Link the single bundle in your HTML:

```html
<link rel="stylesheet" href="css/shared.css">
```

## Structure

- **shared.css** – Main entry; imports all modules below. Use this in your pages.
- **variables.css** – Design tokens (colors, spacing, radii, transitions).
- **base.css** – Reset, body, utility classes (flex, etc.).
- **header.css** – App header and region selector.
- **layout.css** – Main content, panels, table wrapper, detail panel.
- **components.css** – Tables, charts, page header, tabs, buttons, cards, filters, modals, dropdowns.
- **notifications.css** – Bell icon and notifications panel (optional for screens that don’t use it).

To add page-only styles, link an extra stylesheet after `shared.css` or use a separate file (e.g. `css/screens/my-screen.css`).
