# Spinova

Spinova is an app for buying vinyl records. The project combines an iOS, Android, and web app, an e-commerce API, and shared packages in a pnpm and Turborepo monorepo.

The implemented flow includes browsing and searching the catalog, wishlists, a shopping cart, addresses, order creation, and order history. The payment screen uses a demo card: **no charge is made**.

## Tech stack

- **App:** Expo, React Native, Expo Router, NativeWind, and TanStack Query.
- **API:** Elysia, Better Auth, and OpenAPI/Swagger documentation.
- **Data:** PostgreSQL, Drizzle ORM, and Drizzle Kit.
- **Monorepo:** pnpm, Turborepo, and TypeScript.

## Project structure

| Path                         | Purpose                                            |
| ---------------------------- | -------------------------------------------------- |
| `apps/mobile`                | Expo app, screens, components, and services.       |
| `apps/api`                   | HTTP API, business logic, and data access.         |
| `packages/auth`              | Shared Better Auth configuration.                  |
| `packages/database`          | Schema, migrations, Drizzle client, and seed data. |
| `packages/env`               | Environment variable validation.                   |
| `packages/eslint-config`     | Shared lint configuration.                         |
| `packages/typescript-config` | Shared TypeScript configuration.                   |

## Prerequisites

- Node.js **24 or later**.
- pnpm **11.23.0** (the version declared in `package.json`).
- A PostgreSQL instance accessible to the API.
- An Expo environment compatible with the project version to run the app on a phone or emulator.

## Local setup

1. Install dependencies from the repository root:

   ```sh
   pnpm install
   ```

2. Create a `.env` file in the repository root. The API, database, and app development scripts load it automatically. Adjust the URLs for your environment:

   ```dotenv
   NODE_ENV=development
   API_HOSTNAME=0.0.0.0
   PORT=3000
   API_VERSION=1.0.0
   BETTER_AUTH_SECRET=replace-with-a-random-secret-of-at-least-32-characters
   BETTER_AUTH_URL=http://localhost:3000
   DATABASE_URL=postgresql://user:password@localhost:5432/spinova
   WEB_APP_URL=http://localhost:8081
   EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000
   EXPO_PUBLIC_WEB_API_URL=http://localhost:3000
   ```

   `BETTER_AUTH_SECRET` must be at least 32 characters long. `API_VERSION`, `BETTER_AUTH_URL`, `DATABASE_URL`, and both `EXPO_PUBLIC_*` URLs are also required. `NODE_ENV`, `API_HOSTNAME`, and `PORT` have defaults; `WEB_APP_URL` is optional and adds an allowed origin to the API's CORS configuration.

   On a physical device, replace `YOUR_LOCAL_IP` with the IP address of the computer running the API. The phone and computer must be able to communicate over the network. The web app uses `EXPO_PUBLIC_WEB_API_URL`, while iOS and Android use `EXPO_PUBLIC_API_URL`. Set `BETTER_AUTH_URL` to an API URL accessible in the environment where you test authentication.

3. Apply the database migrations:

   ```sh
   pnpm --filter @spinova/database db:migrate
   ```

4. To populate the catalog with development data, run the seed:

   ```sh
   pnpm --filter @spinova/database db:seed
   ```

   The seed inserts and updates sample records. Run it against a development database.

## Run locally

Start the API and app in separate terminals:

```sh
pnpm --filter @spinova/api dev
```

```sh
pnpm --filter @spinova/mobile dev
```

The API uses port `3000` by default. With the values above, interactive API documentation is available at [http://localhost:3000/docs](http://localhost:3000/docs), and the root endpoint responds at [http://localhost:3000/](http://localhost:3000/). The app command opens Expo, where you can choose a target platform, including web.

## Useful commands

Run these from the repository root:

| Command                                       | Purpose                                       |
| --------------------------------------------- | --------------------------------------------- |
| `pnpm build`                                  | Build projects that define a build task.      |
| `pnpm check-types`                            | Type-check the projects.                      |
| `pnpm test`                                   | Run the tests configured in the monorepo.     |
| `pnpm --filter @spinova/api test:watch`       | Run API tests in watch mode.                  |
| `pnpm --filter @spinova/database db:generate` | Generate a migration from the Drizzle schema. |
| `pnpm --filter @spinova/database db:studio`   | Open Drizzle Studio.                          |

## API and code organization

The main API routes are `/products`, `/wishlist`, `/cart`, `/addresses`, and `/orders`. Better Auth provides the authentication routes. See `/docs` for current HTTP parameters and contracts.

API modules separate the domain, use cases, and infrastructure (routes and repositories). Dependencies are assembled in `apps/api/src/composition-root.ts`. The app accesses the API through the services in `apps/mobile/src/services`.

Checkout requires a delivery address, creates an order, reserves stock, and clears the cart in one transaction. The UI shows a demo payment method; the project does not yet integrate a payment provider.
