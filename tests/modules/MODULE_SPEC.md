# TestverQA Module Spec (guest · staging)

A light **requirements/spec contract** for Test Management coverage, derived from the
live crawl of https://testplay.venomva.com/ (30 pages: snapshot + page issues +
screenshot each; health clean except the sandboxed-iframe challenge on /frames).

Each module entry records the visited path, the captured `<title>`, the H1, and the
test that locks the identity. Used to link TM test cases to requirement coverage and
to detect spec-vs-app drift on later runs.

## Covered by the module identity sweep (tests/modules/modules.spec.ts)

| Path | Title (captured) | H1 (captured) | TM case |
|---|---|---|---|
| /ajax | AJAX & API · TestverQA | AJAX & API | TC-22 |
| /realtime | Real-time / WebSocket · TestverQA | Real-time / WebSocket | TC-23 |
| /files | File Operations · TestverQA | File Operations | TC-24 |
| /dialogs | Modals & Dialogs · TestverQA | Modals, Alerts & Toasts | TC-25 |
| /frames | iFrames & Windows · TestverQA | iFrames & Windows | TC-26 |
| /dragdrop | Drag & Drop · TestverQA | Drag & Drop | TC-27 |
| /shadow | Shadow DOM · TestverQA | Shadow DOM & Web Components | TC-28 |
| /canvas | Canvas & SVG · TestverQA | Canvas & SVG | TC-29 |
| /admin | Admin Dashboard · TestverQA | Admin Dashboard | TC-30 |
| /locators | Locator Challenges · TestverQA | Locator Challenges | TC-31 |
| /edge | Edge Cases · TestverQA | Edge Cases | TC-32 |
| /i18n | i18n & RTL · TestverQA | i18n & RTL | TC-33 |
| /a11y | Accessibility · TestverQA | Accessibility (a11y) | TC-34 |
| /api-docs | API Documentation · TestverQA | API Documentation | TC-35 |

## Covered by dedicated behaviour specs

| Module | Spec | TM cases |
|---|---|---|
| Home / | tests/home/home.spec.ts | TC-2 |
| Shop /shop (+cart, checkout, order) | tests/shop/shop.spec.ts | TC-3 … TC-6 |
| Tables & Grids /tables | tests/tables/tables.spec.ts | TC-7 … TC-12 |
| Tabs & Accordions /widgets | tests/widgets/widgets.spec.ts | TC-13 … TC-16 |
| Loaders & Waits /dynamic | tests/dynamic/dynamic.spec.ts | TC-17 … TC-21 |
| Auth /auth/login · /auth/forgot | tests/auth/auth.spec.ts | — |
| Forms /forms | tests/forms/forms.spec.ts | — |
| Buttons & Interactions /elements | tests/elements/elements.spec.ts | — |
| State Inspector /debug/state | tests/state/state.spec.ts | — |