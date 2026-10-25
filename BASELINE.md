# Baseline run evidence — tests/home/home.spec.ts

- Date: recorded at setup
- Target: https://testplay.venomva.com/ (TestverQA playground)
- Framework: Playwright + TypeScript (page-object based)
- Scope: `tests/home/home.spec.ts` (2 tests)
- Result: **2 passed** (run via `npx playwright test tests/home/home.spec.ts`)
- Assertions: title `Home · TestverQA`, H1 `A complete playground for test automation` (visible + exact text), canonical heading check kept intact
- Testver platform: **TC-2** "Home page loads with expected identity [guest]" — type e2e, priority high, status active

Run evidence (JSON): `test-results/.last-run.json` + `test-results/baseline-home-run.json`
