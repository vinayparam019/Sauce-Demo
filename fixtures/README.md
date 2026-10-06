# Fixtures

Import `test` from `fixtures/index.ts` in framework tests. Keep authentication and cleanup in fixtures so each test receives isolated dependencies.

Fixtures are split by concern into modules, merged in `index.ts`:

- `apiFixture.ts` — `ApiFixtures` (`apiClient`, test-scoped) and `ApiWorkerFixtures` (`authenticatedApiClient`, worker-scoped). Never imports `Page`/`Browser`: the authenticated session is bootstrapped once by the `setup` Playwright project (`tests-setup/auth.setup.ts`), which saves a storageState file; `authenticatedApiClient` reads that file via `request.newContext()`. Pure API tests never launch a browser.
- `pageFixture.ts` — `PageFixtures` (page objects, e.g. `examplePage`).
- `dataFixture.ts` — `DataFixtures` (test data, e.g. `testUsers`).
- `index.ts` — merges the modules with `mergeTests`. Import individual fixtures directly in tests (e.g. `{ examplePage, authenticatedApiClient }`) instead of grouped wrapper objects.

To add a new fixture: extend the relevant module's type and `extend()` call. Choose worker scope for expensive, safely-shareable resources (e.g. an authenticated session); use test scope for anything mutated per test (e.g. `Page`, page objects).
