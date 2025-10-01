# 🍼 Naming Conventions

Keep it consistent. If you wonder which style to use, look here. If it's not here, copy an existing similar file.

## Core Cheatsheet

- camelCase → variables, functions, params
- PascalCase → types, interfaces, classes
- kebab-case → file & folder names (`user-controller.ts`)
- snake_case → DB tables + columns + ENV vars
- Boolean names start with: `is`, `has`, `should`
- Error variable names end with: `...Error`
- No vague names: never `data`, `info`, `list`, `result`

## Files & Folders

One feature = controller + service + repository + (types) + tests.

Example:

```
src/
  controllers/user-controller.ts
  services/user-service.ts
  repositories/user-repository.ts
  middlewares/auth-middleware.ts
  routes/index.ts
  types/user-types.ts
  utils/hash-password.ts
  tests/user-service.test.ts
```

## Functions

Format: verb + thing + qualifier(optional)

```
createUser()
getUserById()
deletePostById()
isEmailTaken()
hasPermission()
```

Bad: `create()`, `get()`, `check()`, `permission()`

## Variables

Make intent obvious.

```
const userId = req.user?.id;
const postCreationError = new Error('Failed to create post');
const isValidEmail = validateEmail(email);
```

Bad: `id`, `error`, `valid`

## Errors

```
try { ... } catch (userCreationError) {
  // log context
}
```

Never just `catch (error)` unless quick throw-through.

## Database

Tables: plural snake_case → `users`, `posts`, `post_comments`
Columns: snake_case → `created_at`, `user_id`
Booleans: `is_active`, `has_permission`
Foreign keys: `<entity>_id`
Always alias to camelCase when returning:

```
SELECT first_name AS firstName, created_at AS createdAt
```

Never `SELECT *` in code.

## Layer Verbs

- Repository: low-level verbs like `insertUser`, `findUserByEmail`
- Service: business verbs like `createUser`, `authenticateUser`
- Controller: HTTP intent like `handleUserRegistration`, `handleUserLogin`

## Types / Interfaces

PascalCase. No DB snake_case inside TS types.

```
interface User { id: number; email: string; username: string; createdAt: Date; }
interface CreateUserRequestBody { email: string; username: string; password: string; }
```

## Imports / Exports

Keep names unchanged across layers. If collision: prefix with domain.
`import { createUser as createUserService } from '../services/user-service.js'` (only if needed)

## Checklist (Quick)

```
[ ] File is kebab-case
[ ] Functions verb-first
[ ] No generic names
[ ] Booleans start is/has/should
[ ] DB query aliases snake_case → camelCase
[ ] No SELECT *
[ ] Types PascalCase
[ ] Error vars end with Error
```

## Migration Mini-Guide

1. Rename files to kebab-case
2. Fix imports
3. Rename functions/vars (verb + intent)
4. Add SQL column aliases
5. Update types last
6. Run tests

Done. Keep it boring and consistent. 🚀
