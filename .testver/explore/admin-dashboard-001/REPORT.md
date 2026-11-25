# Explore & Automate — report

**Explored as admin · 5 tests written · 5 automated · 2 findings (worst: medium)**

## Automated tests

| # | Scenario | Test case | Spec · test | Verified | Status |
|---|----------|-----------|-------------|----------|--------|
| 1 | Admin dashboard renders with title, heading and nav active state | TC-42 | `tests/admin/admin.spec.ts` · "Admin dashboard renders with title, heading and nav active state" | 2/2 green | ✅ automated |
| 2 | Admin dashboard shows all four KPI stat cards with seeded values | TC-43 | `tests/admin/admin.spec.ts` · "Admin dashboard shows all four KPI stat cards with seeded values" | 2/2 green | ✅ automated |
| 3 | Admin dashboard notifications feed renders all seeded notifications | TC-44 | `tests/admin/admin.spec.ts` · "Admin dashboard notifications feed renders all seeded notifications" | 2/2 green | ✅ automated |
| 4 | Admin dashboard recent-orders table shows headers and seeded rows | TC-45 | `tests/admin/admin.spec.ts` · "Admin dashboard recent-orders table shows headers and seeded rows" | 2/2 green | ✅ automated |
| 5 | Admin dashboard View shop link navigates to the shop module | TC-46 | `tests/admin/admin.spec.ts` · "Admin dashboard View shop link navigates to the shop module" | 2/2 green | ✅ automated |

## Findings

| Severity | Finding | Where | Seen | Evidence |
|----------|---------|-------|------|----------|
| medium | /admin dashboard data is served to unauthenticated guests | /admin | ×1 | `.testver/explore/admin-dashboard-001/shots/02-admin-as-guest.png` |
| info | Orders-by-status chart is a static canvas with no accessible tooltip | /admin | ×1 | `probed live (hover) — no .chartjs-tooltip node` |

_These are proposals. Nothing was filed as a defect — promote the ones you accept._

## Coverage

| Measure | Value |
|---------|-------|
| Explored as | admin |
| Tests automated | 5 of 5 |
