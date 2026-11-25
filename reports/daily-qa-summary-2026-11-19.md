# Daily QA Summary — 2026-11-19

Project: `FirstTest` (Playwright, chromium + firefox) · Owner: Venomva · Generated from Testver platform data + Test Explorer run history.

> **Headline: no test activity today.** Nothing was executed on 2026-11-19. Last execution anywhere was a single local Playwright run on **2026-11-16** (1/1 passed); last suite-level CI run was **2026-11-14** (9/10 passed, 90%). The platform therefore scores execution freshness at **0**.

---

## 1. QA Health Score — 58/100

| Metric | Score | Weight | Detail |
|---|---|---|---|
| Requirement coverage | 100 | 25 | 20/20 requirements covered |
| Automation coverage | 45 | 25 | 55/122 test cases automated |
| Execution freshness | 0 | 20 | 0 executions in the last 7 days |
| Quality score | 50 | 15 | 0 test cases scored (no quality data) |
| Sync health | 96 | 15 | 54/56 script mappings synced |
| **Overall** | **58** | 100 | — |

```
Requirement coverage  ████████████████████ 100
Automation coverage   █████████            45
Execution freshness   ░░░░░░░░░░░░░░░░░░░░   0   ← biggest drag
Quality score         ██████████           50
Sync health           ███████████████████  96
```

---

## 2. Automation Inventory (57 scripts / 14 files, Playwright)

| Status | Scripts | Share |
|---|---|---|
| Passing (last run) | 13 | 22.8% |
| **Failing (last run)** | **11** | **19.3%** |
| Never run | 33 | 57.9% |
| Flaky (any recent flake) | 8 | — |
| Not linked to a test case | 28 | 49% |

### By folder

| Folder | Scripts | Failing | Never run | Flaky |
|---|---|---|---|---|
| tests/auth | 16 | **6** | 7 | 3 |
| tests/forms | 6 | 0 | 6 | 0 |
| tests/tables | 6 | 0 | 4 | 2 |
| tests/admin | 5 | **5** (all) | 0 | 0 |
| tests/dynamic | 5 | 0 | 5 | 0 |
| tests/shop | 5 | 0 | 1 | 3 |
| tests/state | 4 | 0 | 4 | 0 |
| tests/widgets | 4 | 0 | 2 | 0 |
| tests/home | 3 | 0 | 1 | 0 |
| tests/elements | 2 | 0 | 2 | 0 |
| tests/modules | 1 | 0 | 1 | 0 |

---

## 3. Failing Scripts (11) — oldest first

| Test | File | Test case | Last run | Failure |
|---|---|---|---|---|
| Admin dashboard renders with title, heading and nav active state | tests/admin/admin.spec.ts:23 | TC-42 | Oct 4 | Test timeout 30000ms |
| Admin dashboard shows all four KPI stat cards with seeded values | tests/admin/admin.spec.ts:40 | TC-43 | Oct 4 | Test timeout 30000ms |
| Admin dashboard notifications feed renders all seeded notifications | tests/admin/admin.spec.ts:52 | TC-44 | Oct 4 | Test timeout 30000ms |
| Admin dashboard recent-orders table shows headers and seeded rows | tests/admin/admin.spec.ts:63 | TC-45 | Oct 4 | Test timeout 30000ms |
| Admin dashboard View shop link navigates to the shop module | tests/admin/admin.spec.ts:76 | TC-46 | Oct 4 | Test timeout 30000ms |
| Admin profile page shows identity, account stats and recent orders | tests/auth/profile.spec.ts:39 | TC-38 | Oct 4 | Test timeout 30000ms |
| Admin settings: identity is read-only, preferences render as toggles | tests/auth/profile.spec.ts:59 | TC-39 | Oct 4 | Test timeout 30000ms |
| Admin settings: save profile shows success and persists (self-restoring) | tests/auth/profile.spec.ts:73 | TC-40 | Oct 4 | Test timeout 30000ms |
| Admin settings: saving notification preferences confirms with success alert | tests/auth/profile.spec.ts:106 | TC-41 | Oct 4 | Test timeout 30000ms |
| Admin login completes 2FA and lands authenticated (home) | tests/auth/profile.spec.ts:35 | TC-37 | Oct 9 | `getByTestId('username')` not visible (15s) |
| Manager login lands directly authenticated (no 2FA step) | tests/auth/manager-profile.spec.ts:30 | — (unlinked) | Nov 14 | Test timeout 30000ms |

**Single root-cause pattern:** 10 of 11 failures are `Test timeout of 30000ms exceeded` in a shared admin sign-in helper (`loginAsAdmin`, tests/auth/profile.spec.ts:24 → `getByTestId('username')`). The admin UI appears to have changed its username field — one locator fix is likely to clear all 10. The 11th (manager login) is the same auth path.

---

## 4. Defects

| ID | Severity | Priority | Status | Title |
|---|---|---|---|---|
| D-2 | critical | p2 | **open** | [FAIL] Admin login completes 2FA and lands authenticated (home) — `getByTestId('username')` not found, 17.3s, Chrome, 0 retries |
| D-1 | minor | p3 | resolved | Test-authoring issues found during exploration (add-to-cart race; infinite-scroll global counter) — fixed in specs, KAN-2 |

Open defect rate: **50%** (1 of 2). D-2 is 41 days old and is the same root cause as the 10 admin timeouts above.

---

## 5. Test Plans

| Plan | Release | Sprint | Cases | Executed | Passed | Failed | Pass rate |
|---|---|---|---|---|---|---|---|
| TP-2 Test Release | V1.1 | Sprint 2 | 9 | 9 | 8 | 1 | **89%** |
| TP-1 Test Release | V1.0 | Sprint 1 | 11 | 11 | 1 | 10 | **9%** |

V1.1 (current sprint) is healthy; V1.0's 9% is historical and was never re-run.

---

## 6. Test Case Coverage (123 cases)

| Area | Value |
|---|---|
| Total test cases | 123 (32 critical, 57 high, 34 medium) |
| Automated | 56 (46%) |
| Manual remaining | 67 |
| Status | draft 121 · active 1 · archived 1 |
| Type split | e2e 68 · web 35 · api 6 · security 5 · integration 3 · mobile 3 · performance 3 |
| Orphan test cases (no requirement) | 55 |

### Automation by priority — the real risk

| Priority | Cases | Automated | Automation rate |
|---|---|---|---|
| critical | 32 | **1** | **3%** ← risk |
| high | 57 | 31 | 54% |
| medium | 34 | 24 | 71% |

Critical coverage is inverted: the lowest automation sits on the highest-priority cases. Requirements are 100% *covered* by cases, but 0 critical/high/medium requirement is backed by an automated script.

---

## 7. Today's Actions (prioritised)

1. **Fix the admin auth locator** — `tests/auth/profile.spec.ts:24` `getByTestId('username')`; re-run the 5 admin + 5 profile specs, then close **D-2**. Fixes 10 of 11 red tests.
2. **Restore execution cadence** — 0 runs in 7 days is what drops health to 58. One scheduled daily run of a smoke suite lifts freshness and makes this report meaningful.
3. **Automate critical cases** — 31 of 32 critical cases are manual. Highest-value targets: REQ-9 (UPI), REQ-15 (prepaid/COD), REQ-6 (addresses), REQ-19 (tokenization).
4. **Link the 28 unlinked scripts** to test cases so coverage reporting counts them.
5. **Triage the 33 never-run scripts** (forms 6, dynamic 5, state 4, tables 4) — either run them or mark them out of scope.

---

## Data notes / discrepancies observed

- Total test cases reads **123** in the dashboard and analytics, **122** in health/coverage — a 1-case drift between the two aggregates.
- Requirement coverage reads 100% while 0 requirements map to an *automated* script; the two numbers measure different things and the report keeps them separate.
- Health and coverage figures were pulled live on 2026-11-19; the failing/passing statuses are **last-run** results, the newest of which is 2026-11-14 (library) / 2026-11-16 (single local run).
