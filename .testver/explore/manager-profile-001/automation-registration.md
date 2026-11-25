# Automation registration — manager profile (run manager-profile-001)

## Scope
Explore and Automate ONLY the logged-in user Profile for the **Manager** role on
https://testplay.venomva.com/ (staging). Credentials: seeded `manager/manager123`
(documented on /debug/state "Test credentials"); session captured securely via
`browser_auth_state save` — never in chat.

## Tests written (tests/auth/manager-profile.spec.ts — 6 tests)
All verified **green twice** (two consecutive scoped runs, 6/6 each).

| # | Scenario | Passes |
|---|----------|--------|
| 1 | Manager login lands directly authenticated (no 2FA step) | 2/2 |
| 2 | Manager profile shows identity, account stats and recent orders | 2/2 |
| 3 | Manager recent-order View opens the order confirmation | 2/2 |
| 4 | Manager settings: identity is read-only, 2FA controls are disabled | 2/2 |
| 5 | Manager settings: save profile shows success and persists to profile (self-restoring) | 2/2 |
| 6 | Manager settings: saving notification preferences confirms with success alert | 2/2 |

## Test Management records
None — TM test-case creation was **denied by the user** during this run.
Tests are therefore not linked to Testver test cases and will not appear in
Test Management coverage until the user approves creating them.

## Impact check
- Shared files touched (additive only — no existing member modified):
  - `tests/pages/LoginPage.ts` (added SEEDED_MANAGER_* + submitManagerCredentials)
  - `tests/pages/ProfilePage.ts` (added MANAGER_* constants + expectRoleIdentity / expectAccountStats / expectRecentOrders / expectInfoCard; added statOrders/statSpent/statId/infoCard locators)
  - `tests/pages/SettingsPage.ts` (added MANAGER_* constants + expectSecurity2faDisabled; expectIdentityReadOnly gained optional role/username params with admin defaults)
  - `tests/helpers/auth.ts` (added loginAsManager)
- Dependent admin spec `tests/auth/profile.spec.ts` re-run after changes: **5/5 PASS** — admin contracts unchanged.