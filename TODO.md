# Spinova — Backlog & Technical Debt

## API

- [x] **Standardize route prefixes**: Evaluate adopting `.group("/prefix")` across API route modules instead of flat router definitions (standardized using Elysia constructor `prefix`).
- [x] **Apply SOLID & Clean Architecture**: Refactored all API modules (`products`, `orders`, `cart`, `addresses`, `wishlist`) to Clean Architecture (Domain Errors, Use Cases, Repository Interfaces, Drizzle implementations, Route Factories with DI) and eliminated union status anti-patterns.
