# Server Tests

This directory contains all test files for the SocialMedia server application.

## Structure

```
tests/
├── setup.ts                 # Global test setup and configuration
├── helpers/                 # Test helper utilities
│   ├── db.helper.ts        # Database utilities for tests
│   └── auth.helper.ts      # Authentication utilities for tests
├── unit/                    # Unit tests
│   ├── utils/              # Tests for utility functions
│   ├── services/           # Tests for service layer
│   └── middleware/         # Tests for middleware
└── integration/            # Integration tests
    ├── auth.test.ts        # Auth endpoints tests
    └── posts.test.ts       # Posts endpoints tests
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Run specific test file

```bash
npm test -- tests/unit/utils/jwt.util.test.ts
```

### Run tests matching pattern

```bash
npm test -- --testNamePattern="JWT"
```

## Test Types

### Unit Tests

Unit tests focus on testing individual functions, classes, or modules in isolation. They use mocks and stubs for dependencies.

**Location:** `tests/unit/`

**Examples:**

- Utility functions (JWT, crypto, response formatting)
- Service layer business logic
- Middleware functionality

### Integration Tests

Integration tests verify that different parts of the application work together correctly. They test actual API endpoints with real database interactions.

**Location:** `tests/integration/`

**Examples:**

- Authentication flow (register, login)
- Post CRUD operations
- Follow/unfollow functionality

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from "@jest/globals";

describe("Feature Name", () => {
  it("should do something", () => {
    // Arrange
    const input = "test";

    // Act
    const result = someFunction(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

### Using Test Helpers

```typescript
import { createTestUser, clearDatabase } from "../helpers/db.helper.js";
import { generateTestToken } from "../helpers/auth.helper.js";

beforeEach(async () => {
  await clearDatabase();
  const user = await createTestUser("test@example.com", "testuser", "password");
  const token = generateTestToken(user);
});
```

### Mocking Dependencies

```typescript
import { jest } from "@jest/globals";

jest.mock("../../../src/repositories/auth.repository.js");
```

## Test Database

Tests use a separate test database to avoid affecting development or production data.

**Configuration:** `.env.test`

**Setup:**

1. Create a test database: `createdb socialmedia_test`
2. Run migrations on test database
3. Tests will automatically clear data before each test

## Coverage

Test coverage reports show which parts of the code are tested:

- **Statements:** % of statements executed
- **Branches:** % of conditional branches tested
- **Functions:** % of functions called
- **Lines:** % of code lines executed

**View coverage report:**

```bash
npm run test:coverage
open coverage/index.html
```

## Best Practices

1. **Isolation:** Each test should be independent and not rely on others
2. **Clear naming:** Use descriptive test names that explain what is being tested
3. **AAA Pattern:** Arrange, Act, Assert - structure tests clearly
4. **Mock external dependencies:** Don't make real API calls or access external services
5. **Clean up:** Always clean up test data after tests run
6. **Fast execution:** Unit tests should run quickly
7. **Meaningful assertions:** Test actual behavior, not implementation details

## Continuous Integration

Tests run automatically on:

- Pre-commit hooks (optional)
- Pull requests
- Main branch pushes

Ensure all tests pass before merging code.
