# Life Manager Backend

This repository contains the backend API for a personal "life manager" application built with NestJS, Sequelize, and PostgreSQL.

The app is centered around a tree of `data_nodes`. A user can create nested nodes, organize them by parent/child relationships, search them by note text, move them around, reorder siblings, store JSON attributes on nodes, and bookmark important nodes for quick access.

## Tech Stack

- NestJS 11
- Sequelize + `sequelize-typescript`
- PostgreSQL
- JWT authentication with Passport
- Swagger/OpenAPI docs
- Optional Socket.IO gateway

## Main Features

- User registration and login
- JWT-protected APIs
- Hierarchical data nodes
- Node search by note text
- Node move and reorder operations
- JSON attributes on nodes
- Bookmark registration and bookmark listing
- Date-node helper endpoint that creates or returns:
  `life -> year -> month -> day`

## Project Structure

```text
src/
  auth/          Authentication endpoints and JWT login flow
  bookmarks/     Bookmark model, controller, service, repository
  chat/          Optional Socket.IO gateway
  data-nodes/    Tree node APIs and data access layer
  users/         User model and repository layer
  db/sequelize/  Sequelize migrations and seeders
```

## Environment Variables

This project uses `.env.local` for local development. Current variables used by the app include:

```env
APP_ENV=dev
PORT=3000
API_BASE_URL=/api
DOCS_URL=/docs
SOCKETIO_ENDPOINT=/ws
SOCKETIO_ENDPOINT_ON=false

JWT_SECRET=supersecret

DB_DATABASE=life-manager-222
DB_USERNAME=postgres
DB_PASSWORD=NewPassword
DB_HOST=127.0.0.1
```

Make sure PostgreSQL is running and that the configured database already exists before running migrations.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure your local environment in `.env.local`.

3. Run database migrations:

```bash
npm run migrate:dev
```

4. Optionally seed demo data:

```bash
npm run seed:dev
```

5. Start the development server:

```bash
npm run start:dev
```

By default the server runs on `http://localhost:3000`.

## API Docs

Swagger UI is exposed using the configured docs path:

```text
http://localhost:3000/docs
```

Because the app also uses `API_BASE_URL=/api`, the main API routes are available under:

```text
http://localhost:3000/api/...
```

## Available Scripts

```bash
npm run start:dev     # Start in watch mode
npm run build         # Build the application
npm run start:prod    # Run compiled output
npm run migrate:dev   # Run Sequelize migrations
npm run seed:dev      # Seed demo data
npm run test          # Run unit tests
npm run test:e2e      # Run e2e tests
npm run lint          # Run ESLint with --fix
```

## API Overview

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Data Nodes

- `GET /api/v1/data-nodes`
- `GET /api/v1/data-nodes/search?query=...`
- `POST /api/v1/data-nodes/today`
- `GET /api/v1/data-nodes/:parentId`
- `POST /api/v1/data-nodes/:parentId`
- `PATCH /api/v1/data-nodes/:id`
- `PATCH /api/v1/data-nodes/:id/attributes`
- `PATCH /api/v1/data-nodes/:id/position`
- `PATCH /api/v1/data-nodes/:id/moveto/:parentId`
- `DELETE /api/v1/data-nodes/:id`

### Bookmarks

- `GET /api/v1/bookmarks`
- `POST /api/v1/bookmarks/:nodeId`

## Notes About IDs

The API uses encoded IDs externally and decodes them internally through the Nest request/response pipeline. In practice, clients should treat all returned IDs as opaque strings and pass them back unchanged when calling protected endpoints.

## Development Notes

- Models are auto-loaded through `SequelizeModule.forRoot`.
- Database naming uses underscored column names.
- `synchronize` is disabled, so schema changes should be made through migrations.
- Socket.IO support is optional and controlled by `SOCKETIO_ENDPOINT_ON`.

## Status

This backend is already usable for authenticated node management and bookmarks, and it is structured in a straightforward module-per-feature NestJS style that is easy to extend as the product grows.
