# **Naming Consistency Rules**

To maintain clarity, predictability, and developer flow, all naming in this project must follow these rules. These apply to all folders, files, functions, variables, classes, components, enums, constants, configuration keys, and exports.

---

## **1. General Principles**

* Names must be **clear, descriptive, and predictable**.
* No abbreviations unless universally known (`id`, `url`, `db`, `api`).
* Avoid vague names (`stuff`, `data`, `helper`, `util2`, `processFile_v2`).
* Prefer **consistency over creativity**.
* Use the same naming pattern for the same type of item everywhere.

---

## **2. Folder Naming**

* Use **kebab-case**

  * Example: `controllers`, `user-routes`, `email-service`

---

## **3. File Naming**

* Use **kebab-case** for all files.
* The file name must match the main exported purpose.

  * Example:

    * Controller → `user.controller.js`
    * Service → `payment.service.js`
    * Model → `order.model.js`

---

## **4. Variables & Functions**

* Use **camelCase**

  * `userName`, `getUserData()`, `calculateTotal()`
* Functions must start with a **verb**

  * `createUser`, `updateOrder`, `validateToken`

---

## **5. Classes**

* Use **PascalCase**

  * `UserService`, `OrderController`, `JwtManager`

---

## **6. Constants & Enums**

* Use **UPPER_CASE_SNAKE_CASE**

  * `MAX_RETRY_LIMIT`, `DEFAULT_TIMEOUT`

---

## **7. Database / Model Fields**

* Use **snake_case**

  * `user_id`, `created_at`, `last_login`

---

## **8. React Components (if any)**

* Use **PascalCase**

  * `UserCard`, `DashboardLayout`

---

## **9. API Route Names**

* Use **kebab-case**
* Always pluralize resource names

  * `/users`, `/orders/:id`, `/auth/login`

---

## **10. Don’t Mix Styles**

❌ Wrong
`get_user-Info`, `User_service.js`, `userControllerFile`

✔️ Correct
`getUserInfo`, `user.service.js`, `user.controller.js`

---

# **End of Naming Rules**
