# Exploration + Automation Report — TestverQA Admin Profile

**Run:** `admin-profile-001` · **Date:** 2026-09-19 · **Environment:** staging
**Target:** https://testplay.venomva.com/ (all paths) · **Role:** admin (logged-in profile only)
**Restrictions honored:** no data-destroying actions, no purchases/payments, no contacting real people, no logouts.

---

## 1. What was explored (logged-in admin view)

| Page | Path | Notes | Issues |
|---|---|---|---|
| Home (authenticated) | `/` | Header swaps "Sign in" for a **user pill** (`data-testid="user-pill"`, aria-label "Open user menu") → menu offers **View profile** (`/auth/profile`) and **Account settings** (`/auth/settings`) | none |
| Sign in | `/auth/login` | Username/password form; admin credentials are seeded and documented on `/debug/state` | none |
| 2FA | `/auth/2fa` | Admin login requires a 6-digit OTP; **hint documented on page: `123456`**; multi-page auth with session-stored state | none |
| Profile | `/auth/profile` | Greeting (H1 derived from full-name first token), identity card (`profile-name`, `profile-handle` @admin, `profile-email-display`, `profile-role` badge), account stats (3 orders, $11,229, ACCOUNT #00001), **Recent orders** table | none |
| Account settings | `/auth/settings` | Profile details (username/role **read-only**, full name + email editable), change password, security (2FA enabled, recovery codes disabled), **notification preferences** (4 switches), active sessions table, danger zone | none |
| Order confirmation | `/shop/order/ORD-000127` | Reachable from profile Recent orders "View →" | none |
| State Inspector | `/debug/state` | Documents seeded credentials (`admin/admin123`, `tester/test123`, `manager/manager123`); reset/reseed is **data-destroying → out of scope** | none |

## 2. Findings

1. **Admin login is a 2-step flow**: `/auth/login` (admin/admin123) → `/auth/2fa` (OTP `123456`) → home. Both the credentials and the OTP hint are documented on the playground itself.
2. **H1 greeting derives from the first token of the full name** — "Hello, Admin 👋" for "Admin User"; the identity card (H3 `profile-name`) holds the full name.
3. **Settings success alerts** share `data-testid="settings-success"` (`.alert.alert-success`): "Profile details saved successfully." / "Notification preferences saved."
4. **Notification toggles are visually hidden inputs** (custom switches) — assert on the wrapper row + checkbox type, not `toBeVisible()` on the input.
5. **Username & role on settings are immutable** (`readonly`); full name + email are the editable fields.
6. **No console errors / failed requests / HTTP errors** on any page probed.

## 3. What was automated

New spec **`tests/auth/profile.spec.ts`** — 5 tests, page-object based, run **green twice**:

| Test | Covers |
|---|---|
| Admin login completes 2FA and lands authenticated (home) | full 2-step sign-in |
| Admin profile page shows identity, account stats and recent orders | title, greeting, identity card, 3-row orders table |
| Admin settings: identity is read-only, preferences render as toggles | readonly identity + pref switches |
| Admin settings: save profile shows success and persists to profile (self-restoring) | write contract + restore in `finally` |
| Admin settings: saving notification preferences confirms with success alert | save-prefs success alert |

**New page objects (additive):** `TfaPage.ts`, `ProfilePage.ts`, `SettingsPage.ts`; **extended additively:** `LoginPage.ts` (login + 2FA helpers), `fixtures.ts` (3 new fixtures).

## 4. Files changed

| File | Change |
|---|---|
| `tests/auth/profile.spec.ts` | **new** — 5 admin-profile tests |
| `tests/pages/TfaPage.ts` | **new** — 2FA step page object |
| `tests/pages/ProfilePage.ts` | **new** — profile page object |
| `tests/pages/SettingsPage.ts` | **new** — settings page object |
| `tests/pages/LoginPage.ts` | **additive** — login fields + `submitAdminCredentials` |
| `tests/fixtures/fixtures.ts` | **additive** — tfaPage/profilePage/settingsPage fixtures |

## 5. Test Management registration

5 new automated cases (each mapped `scriptPath` → `testName`):

| Case | Test |
|---|---|
| TC-37 | Admin login completes 2FA and lands authenticated (home) |
| TC-38 | Admin profile page shows identity, account stats and recent orders |
| TC-39 | Admin settings: identity is read-only, preferences render as toggles |
| TC-40 | Admin settings: save profile shows success and persists to profile (self-restoring) |
| TC-41 | Admin settings: saving notification preferences confirms with success alert |

## 6. Out of scope (explicitly not automated)

- **Change password** — no approved recipe to restore the seeded password afterwards.
- **Danger zone** (delete account, "Sign out all other sessions") — destructive.
- **State Inspector Reset & reseed** — data-destroying.
- **Sign out** — restricted.
- **Purchases / payments** — restricted.

## 7. Artifacts

- Plan: `.testver/explore/admin-profile-001/plan.json`
- Crawl record: `.testver/explore/admin-profile-001/frontier.json`
- Findings: `.testver/explore/admin-profile-001/findings.json`
- Evidence screenshots: `.testver/explore/admin-profile-001/shots/` (`profile.png`, `settings.png`, `profile-verify.png`)
- Registration: `.testver/explore/admin-profile-001/automation-registration.md`
- Saved admin session: `browser_auth_state` role=admin (reusable via `authRole="admin"`)