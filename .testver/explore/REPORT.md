# Explore & Automate run — testplay.venomva.com (guest, staging)

Run ID: explore-guest-001 · Framework: Playwright + TypeScript (page-object based)

## Target & scope
- Base: `https://testplay.venomva.com/` (staging) · Role: **guest** · Restrictions: none declared · Docs: none
- All paths under the origin crawled (30 pages, see `.testver/explore/frontier.json`).

## Crawl findings (page issues)
- 30/30 pages loaded with **zero console/network errors** except:
  - `/frames` — 3× `Blocked script execution ... sandboxed and the 'allow-scripts' permission is not set` (intended: the sandboxed-iframe challenge).
- Every module exposes stable `data-testid` locators — ideal selector hygiene.

## Automation delivered (all green ×2)
New page objects (additive): `tests/pages/{ShopPage,CartPage,CheckoutPage,TablesPage,WidgetsPage,DynamicPage,ModulePages}.ts`
New specs:
| Spec | Tests | Covers |
|---|---|---|
| `tests/shop/shop.spec.ts` | 4 | add-to-cart badge, coupon SAVE10 (-$197.80), full 5-step checkout → order ORD-**** |
| `tests/tables/tables.spec.ts` | 6 | identity, search by SKU, category filter, pagination, limit, master checkbox |
| `tests/widgets/widgets.spec.ts` | 4 | identity, lazy tab, accordion, vertical tabs |
| `tests/dynamic/dynamic.spec.ts` | 5 | identity, spinner resolve, late element, auto counter, infinite scroll |
| `tests/modules/modules.spec.ts` | 24 | identity sweep of all 24 module routes |

Extends `tests/fixtures/fixtures.ts` (additive only).

## Notable engineering decisions
- **State reset recipe**: `POST /api/reset` `{"size":"medium"}` (documented in the app's own API docs) guarantees deterministic shop runs.
- **Race fix**: add-to-cart is an async JS POST; tests now wait for the cart badge (toHaveText('1')) BEFORE navigating to /cart — otherwise `goto` aborts the in-flight request and the cart shows empty.
- **Infinite scroll**: `#inf-scroll` starts pre-populated (#3xx range, global counter) and appends on scroll-to-bottom; the test scrolls it and polls `div` count.
- **Assertions**: totals located with `hasText: /^Total/` to avoid matching "Subtotal".

## Test Management
- TC-2 (home identity) already exists (currently `manual` — updating to automated was declined).
- New cases for shop/tables/widgets/dynamic/modules were **not created** (permission denied by user).

## Evidence
- Screenshots: `.testver/explore/shots/*.png` (30 pages incl. order confirmation).
- Frontier/audit: `.testver/explore/frontier.json`, `plan.json`.