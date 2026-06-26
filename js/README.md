# Shared JS

Reusable and page-specific scripts for Market Data screens.

## Shared (use on any screen)

- **shared.js** – Load first. Provides `MarketDataUI`:
  - `MarketDataUI.closeOnOutsideClick(containerSelector, [triggerSelector], onClose)` – Close panel/dropdown when clicking outside.
  - `MarketDataUI.showModal(modalId)` / `MarketDataUI.closeModal(modalId)` – Toggle modal overlay by id.

```html
<script src="js/shared.js"></script>
```

## Page-specific

- **alerts.js** – Logic for the Market Data / Alerts screen (curves, volatilities, notifications, modals).
- **market-data-v3.js** – Logic for the Market Data v3 screen (curves, detail panel, no notifications).

Load after `shared.js`:

```html
<script src="js/shared.js"></script>
<script src="js/alerts.js"></script>
```

## New screen

1. Link `css/shared.css` in `<head>`.
2. Link `js/shared.js` before your script.
3. Add your own HTML and a new `js/your-screen.js` for page logic, or inline script if small.
