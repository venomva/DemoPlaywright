# Automation registration run — TestverQA admin profile (staging · admin role)

Date: verification pass (2026-09-19)
Target: https://testplay.venomva.com/ (all paths in scope, logged-in admin profile only)
Restrictions honored: no data-destroying actions, no purchases/payments, no real people, no logouts.
Out of scope (not automated): change password (no approved restore recipe for seeded password),
danger zone (delete account / sign out all sessions), State Inspector reseed (data-destroying).

## Pre-state
- Guest suite already green (43 tests, TC-2 … TC-35 automated, 100% automation coverage).
- No automated coverage of the logged-in admin profile area (/auth/profile, /auth/settings, /auth/2fa).

## New automated coverage
Spec: tests/auth/profile.spec.ts (5 tests) — run twice, 5/5 green both times (green-twice convention).

| Test | Verifies |
|---|---|
| Admin login completes 2FA and lands authenticated (home) | full admin sign-in: /auth/login (admin/admin123) -> /auth/2fa (OTP 123456) -> home |
| Admin profile page shows identity, account stats and recent orders | title, greeting, identity card (profile-name/handle/email), 3-row recent orders table |
| Admin settings: identity is read-only, preferences render as toggles | readonly username+role, 4 pref switch rows |
| Admin settings: save profile shows success and persists to profile (self-restoring) | success alert settings-success, persisted profile-name, restore in finally |
| Admin settings: saving notification preferences confirms with success alert | success alert on no-op save preferences |

Credentials: seeded admin admin/admin123 documented on /debug/state; 2FA hint 123456 documented on /auth/2fa.

## Test Management registration
Created 5 automated cases, each mapped via scriptPath + testName + framework(playwright):
- TC-37 Admin login completes 2FA and lands authenticated [admin]
- TC-38 Admin profile page shows identity, stats and recent orders [admin]
- TC-39 Admin settings: identity read-only + preferences toggles [admin]
- TC-40 Admin settings: save profile persists + self-restores [admin]
- TC-41 Admin settings: save preferences success alert [admin]

## Resulting Test Management state
- Test cases: 39 (39 automated / 0 manual)
- New admin-profile coverage registered against tests/auth/profile.spec.ts

## Notes
- The admin browser session is saved (browser_auth_state role=admin) for repeatable authenticated runs.
- Exploration artifacts: .testver/explore/admin-profile-001/ (plan.json, frontier.json, findings.json, shots/)