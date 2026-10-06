# Qmagic Skeleton Framework - Playwright + TypeScript (UI + API)

This is a standardized, generic **Playwright + TypeScript automation framework** template designed for **Qmagic**.

It provides a clean foundation for building UI and API automation for any project, with:
- ✅ Page Object Model (POM) architecture
- ✅ API testing support
- ✅ UI + API integration capabilities
- ✅ Reusable fixtures and utilities
- ✅ Comprehensive configuration
- ✅ CI/CD ready
- ✅ TypeScript with strict type checking

---

## Quick Start

### Prerequisites
- **Node.js** 20+
- **npm** or **yarn**

### Installation

```bash
npm install
npx playwright install
```

### Configuration

Create `.env` file:
```env
BASE_URL=https://opensource-demo.orangehrmlive.com
API_BASE_URL=https://opensource-demo.orangehrmlive.com
API_AUTH_TOKEN=
ENVIRONMENT=local
USER_PASSWORD=admin123
```

### Running Tests

```bash
npm test                              # Run all tests
npm run test:headed                   # See browser while testing
npm run report                        # View test report
npm run test:examples                 # Run example tests (sets TAGS=@example, workers=1)
```

---

## Framework Structure

```
├── core/
│   ├── api/                   ← Unified client and API errors
│   ├── ui/                    ← Base page, component, and modal classes
│   └── utils/                 ← Retry (transient-only, exponential backoff), schema, logging, error context
├── fixtures/
│   ├── apiFixture.ts          ← apiClient (test-scoped), authenticatedApiClient (worker-scoped)
│   ├── pageFixture.ts         ← Page Objects
│   ├── dataFixture.ts         ← Test data (testUsers)
│   └── index.ts               ← Merges the above with mergeTests
├── tests-setup/
│   └── auth.setup.ts          ← One-time UI login; seeds storageState for API tests
├── pages/
│   └── examples/              ← OrangeHRM page object reference
├── tests/
│   ├── examples/              ← OrangeHRM example tests
│   ├── ui/                    ← Your UI tests
│   ├── api/                   ← Your API tests
│   └── integration/           ← Your UI + API tests
├── utils/
│   ├── examples/              ← OrangeHRM API service example
│   └── helpers/               ← Reusable helpers
├── data/
│   └── user.json              ← Test user emails/usernames (not secrets; passwords via env)
├── .auth/                     ← Generated storageState (gitignored, never committed)
├── playwright.config.ts       ← Playwright configuration
└── example.env                ← Environment template
```

---

## Getting Started

### 1. Review Examples

The framework includes OrangeHRM examples against the public demo application. Review these to understand the patterns:

- `pages/examples/examplePage.ts` - OrangeHRM login and dashboard page object
- `tests/examples/exampleUI.spec.ts` - UI test pattern
- `tests/examples/exampleAPI.spec.ts` - API test pattern
- `tests/examples/exampleIntegration.spec.ts` - Integration pattern
- `utils/examples/exampleAPIService.ts` - OrangeHRM dashboard API service with schema validation

Run examples:
```bash
npx playwright test --grep @example
```

### 2. Create Your Tests

**Create UI test:**
```bash
# File: tests/ui/login.spec.ts
```

**Create page object:**
```bash
# File: pages/your-application/loginPage.ts
```

**Create API test:**
```bash
# File: tests/api/users.spec.ts
```

### 3. Run Tests

```bash
npm test
npm run report
```

---

## Page Object Model (POM)

### Structure

```typescript
import { BasePage } from '../core/ui/basePage';

export class YourPage extends BasePage {
  // Private locator getters
  private get submitButton() { ... }
  
  // Public action methods
  async clickSubmit() { ... }
  
  // Public assertion methods
  async verifySuccess() { ... }
}
```

### Best Practices

- ✅ Use private getters for locators
- ✅ Name action methods with verbs: `click*`, `fill*`, `select*`
- ✅ Name assertion methods with: `verify*`, `assert*`
- ✅ Keep methods focused (single responsibility)
- ❌ Avoid multiple assertions per method
- ❌ Avoid mixing UI and API logic

---

## API Testing

### Structure

```typescript
export class YourAPIService {
  constructor(private readonly client: APIClient) {}
  async get(endpoint: string) { return this.client.get(endpoint); }
  async post(endpoint: string, data: unknown) { return this.client.post(endpoint, data); }
}
```

### Best Practices

- ✅ Create service classes for API operations
- ✅ Use payload factories for test data
- ✅ Handle authentication centrally
- ✅ Return typed responses
- ❌ Don't hardcode API endpoints in tests
- ❌ Don't mix API and UI logic

The OrangeHRM API example uses `authenticatedApiClient`, a worker-scoped fixture that
reads a storageState file produced once by the `setup` Playwright project
(`tests-setup/auth.setup.ts`). API tests never construct a `Page` or launch a browser
themselves. Use `mockJSONResponse` when a UI test needs an isolated API response.

---

## UI + API Integration

### Pattern

```typescript
// 1. Create data via API
const data = await apiService.create(request, payload);

// 2. Perform UI actions  
await page.navigate(data.id);
await page.fillForm(data);

// 3. Verify via API
const verified = await apiService.get(request, data.id);
expect(verified).toMatchObject(data);
```

The working examples use OrangeHRM's public demo:
`https://opensource-demo.orangehrmlive.com`. Demo credentials are stored only in
`example.env`; copy it to `.env` for local execution and never commit `.env`.

---

## Configuration

### Environment Variables

Create `.env` file (use `example.env` as template):

```env
# Application URLs
BASE_URL=https://opensource-demo.orangehrmlive.com
API_BASE_URL=https://opensource-demo.orangehrmlive.com

# Authentication
API_AUTH_TOKEN=
USER_PASSWORD=admin123

# Playwright
ENVIRONMENT=local
BROWSER=chromium
```

`ENVIRONMENT=local` is the only environment that falls back to the OrangeHRM demo URL;
any other value (`qa`, `staging`, `production`, ...) requires `BASE_URL`/`API_BASE_URL`
to be set explicitly or the config throws a `ConfigurationError` at startup (fail fast,
see `config/environment.ts`).

### Playwright Config

Edit `playwright.config.ts`:
- Timeouts
- Retries
- Workers (parallel execution)
- Browser configuration
- Reporting

---

## Authentication

Usernames/emails for each test-user role live in `data/user.json` (test data, not
secrets). Each key requires a matching `<KEY>_PASSWORD` env var, derived by naming
convention (`user` → `USER_PASSWORD`, `secondUser` → `SECOND_USER_PASSWORD`, `admin` →
`ADMIN_PASSWORD`) — see `config/credentials.ts`. Add a new role by adding a key to
`data/user.json` and setting its password env var; no code change is required.

UI tests log in per-test through `ExamplePage.login()` — nothing is pre-authenticated,
so login-flow tests (e.g. "user can log in") stay realistic.

API tests use `authenticatedApiClient` instead of logging in through the UI. A one-time
setup project (`tests-setup/auth.setup.ts`, wired via `dependencies: ['setup']` in
`playwright.config.ts`) performs a single UI login and saves the session to
`.auth/user.json` (gitignored, generated at runtime, never committed).
`authenticatedApiClient` reads that file via `request.newContext({ storageState })` —
it never imports `Page`/`Browser`, so pure API tests never launch a browser. It is
worker-scoped (the session is expensive to establish and safe to share read-only within
a worker); `apiClient` (unauthenticated) is test-scoped.

---

## Retry Strategy

Retries are centralized in `APIClient` (`core/api/client.ts`) via `core/utils/retry.ts`
and only apply to transient failures — network errors, `429`, and `5xx`
(`isTransientAPIError` in `core/api/errors.ts`). Deterministic `4xx` and functional
assertion failures are never retried. Backoff is exponential with jitter (`250ms`,
`500ms`, `1000ms`, ...) to avoid retry storms. Default attempts: `0` locally, `1` on CI
(`API_CONFIG.retries` in `config/userAuth.ts`) — configurable per `APIClient` instance.
API services (e.g. `ExampleAPIService`) should not implement their own retry loops.

---

## Test Tags

Use tags to organize tests:

```typescript
test('@smoke @login User can login', async () => { ... });
```

Run specific tags:
```bash
npx playwright test --grep @smoke
npx playwright test --grep @login
```

Common tags:
- `@smoke` - Quick sanity tests
- `@regression` - Full test suite
- `@example` - Example tests (remove from production)

---

## Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### View Test Report
```bash
npm run report
```

### Enable Debug Logging
```bash
DEBUG=pw:api npx playwright test
```

---

## CI/CD Integration

### GitHub Actions

```yaml
- run: npm ci
- run: npx playwright install --with-deps
- run: npm test
- uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

See `azure-pipelines.yml` for Azure Pipelines example.

Set `ALLURE=true` to add Allure output alongside the HTML and JUnit reports.

---

## Project Cleanup

After reviewing examples, remove example files:

```bash
# Remove example tests
rm -r tests/examples/

# Remove example pages
rm -r pages/examples/

# Remove example utilities
rm -r utils/examples/
```

Then create your project-specific:
- `pages/[your-app]/` - Your page objects
- `tests/ui/` - Your UI tests
- `tests/api/` - Your API tests
- `tests/integration/` - Your integration tests
- `utils/services/` - Your API services
- `utils/helpers/` - Your helper functions

---

## Best Practices

### Test Writing

- Use AAA pattern: Arrange → Act → Assert
- Keep tests focused on single behavior
- Use meaningful test names
- Group related tests with `test.describe`
- Clean up data after tests

### Page Objects

- Keep locators private
- Name methods by action: `click*`, `fill*`, `verify*`
- Return new pages on navigation
- Avoid business logic in page objects
- Document complex methods

### API Testing

- Use service classes for API operations
- Type all requests and responses
- Handle errors explicitly
- Use payload factories
- Verify both response and behavior

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Element not found" | Check selectors, use `--debug`, verify app running |
| API auth fails | Verify token, check BASE_URL and API_BASE_URL |
| Slow tests | Use `--workers=6`, avoid hardcoded delays |
| Flaky tests | Add explicit waits, check for race conditions |

---

## Documentation

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- `FRAMEWORK_ARCHITECTURE_REVIEW.md` - Architecture details
- `IMPLEMENTATION_GUIDE.md` - Implementation patterns

---

## Support

For issues or questions:
1. Check Playwright documentation
2. Review example tests
3. Run in debug mode
4. Check test report with traces

---

**Qmagic Skeleton Framework - Playwright + TypeScript**  
Version 1.0.0 | August 2026

This framework is designed to be **generic, reusable, and project-independent**.

Happy Testing! 🎭
