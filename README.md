# 🏆 @bepalo/query

![hero](./assets/hero.png)

[![npm version](https://img.shields.io/npm/v/@bepalo/query.svg)](https://www.npmjs.com/package/@bepalo/query)
[![CI](https://img.shields.io/github/actions/workflow/status/bepalo/query/ci.yaml?label=ci)](https://github.com/bepalo/query/actions/workflows/ci.yaml)
[![tests](https://img.shields.io/github/actions/workflow/status/bepalo/query/testing.yaml?label=tests)](https://github.com/bepalo/query/actions/workflows/testing.yaml)
[![license](https://img.shields.io/npm/l/@bepalo/query.svg)](LICENSE)

<!-- ![Benchmarked](https://img.shields.io/badge/benchmarked-yes-green) -->

[![Vitest](https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](test-result.md)

**A type-safe access-control-driven unified RESTful database query engine for backend using Drizzle ORM.**

Bepalo Query automatically creates secure database-backed REST resources directly from your Drizzle schema and ACL definitions.

Instead of writing CRUD endpoints, validation, authorization, role checks, pagination, filtering, relation loading, and result formatting manually, you define access rules once and let the framework generate the API.

## Coming soon

_Working on ways to lift relations name restrictions to table names, and safely adding ACL resource-id tpe-safety to query-client._

## 🎯 Why Bepalo Query?

Traditional applications require building:

- CRUD endpoints
- Validation
- Authentication
- Authorization
- Filtering
- Pagination
- Relation loading
- Error handling

Bepalo Query replaces all of that with a declarative ACL.

Your workflow after project setup becomes:

`( Add/Update Schema )` -> `( Add/Update ACL )` -> `( Query Resource )`

## ✨ Features

- 🔐 Access-control driven authorization
- 🔐 query route definitions for server-side
- 🔐 client builder for client-side
- 🟦 All Typescript type-safe
- 👤 Role-based access control
- 🛡️ Column-level security
- 🛡️ Row-level security
- ⚡ CRUD endpoint
- 🔎 Filtering and sorting
- 📦 Pagination support
- 🌳 Nested relation joining
- 🧩 Query validation
- 📝 Request-body validation
- 💉 Request-body injection/transformation
- 📊 Computed SQL fields
- 🔄 Transaction support
- 🚫 Query restrictions
- 📏 Query depth limits
- 📈 Query size limits
- 🪝 Query hooks: before & after & on-error
- 🚀 Built on top of Drizzle ORM
- 🭄 Scalability

## 🏁 Performance

- Built directly on Drizzle ORM
- No runtime schema generation
- No reflection

Very Fast

## 📑 Table of Contents

- [🎯 Why Bepalo Query?](#-why-bepalo-query)
- [✨ Features](#-features)
- [🏁 Performance](#-performance)
- [🚀 Get Started](#-get-started)
  - [📥 Installation](#-installation)
  - [📦 Quick Start](#-quick-start)
    - [Example Project Initialization](#example-project-initialization)
    - [Setup Environment File `.env`](#setup-environment-file-env)
    - [Create the database and Define the `ACL` type](#create-the-database-and-define-the-acl-type)
    - [Create auth and its middleware](#create-auth-and-its-middleware)
    - [Create a Query route and mount it to server](#create-a-query-route-and-mount-it-to-server)
    - [Define the ACL - Access Control](#define-the-acl---access-control)
    - [RESTClient VSCode Extension for testing APIs](#restclient-vscode-extension-for-testing-apis)
- [🔧 Client Query Builder](#-client-query-builder)
- [🔑 Authentication](#-authentication)
- [🔐 ACL System](#-acl-system)
  - [Roles](#roles)
  - [The `control` structure](#the-control-structure)
- [📚 Query Language](#-query-language)
  - [Pagination](#pagination)
  - [Select Columns](#select-columns)
  - [Filtering](#filtering)
  - [Multiple Filters](#multiple-filters)
  - [Sorting](#sorting)
  - [Relations](#relations)
- [🌐 HTTP Methods](#-http-methods)
  - [GET Handlers](#get-handlers)
  - [POST Handlers](#post-handlers)
  - [PATCH Handlers](#patch-handlers)
  - [DELETE Handlers](#delete-handlers)
  - [OPTIONS and HEAD](#options-and-head)
- [🧮 Computed Fields](#-computed-fields)
- [🚫 Restrict Client Queries](#-restrict-client-queries)
- [🎨 Custom Result Formatting](#-custom-result-formatting)
- [⚠️ Production Recommendations](#️-production-recommendations)
- [📄 License](#-license)
- [🕊️ Thanks and Enjoy](#️-thanks-and-enjoy)
- [💖 Be a Sponsor](#-be-a-sponsor)

[CHANGELOG](./changelog.md)

## 🚀 Get Started

### 📥 Installation

#### bun

```bash
bun add @bepalo/query
```

#### npm

```bash
npm install @bepalo/query
```

#### pnpm

```bash
pnpm add @bepalo/query
```

### 📦 Quick Start

#### Example Project Initialization

Init and Install

```sh
bun init -y

bun i @bepalo/query @libsql/client arktype better-auth drizzle-arktype drizzle-orm zod dotenv

bun i -d  drizzle-kit
```

Make sure to manually add this in tsconfig.json

```json
{
  "types": ["bun"],
  "paths": { "@/*": ["./src/*"] }
}
```

Dont forget to migrate database after finishing code setup

```sh
# Migrate Database
bunx drizzle-kit push

# Start Server
bun --watch ./src/index.ts
```

#### Setup Environment File `.env`

<details>
  <summary>.env</summary>

```env
# SERVER
PORT=4000

## DRIZZLE ORM
DB_FILE_NAME=file:.dev.db

## BETTER AUTH
BETTER_AUTH_URL=http://localhost:4000
BETTER_AUTH_SECRET=<better-auth-secret>
```

</details>

#### Create the database and Define the `ACL` type

**NOTE: Current implementation only support for relations that match table names.**

<details>
  <summary>sandbox/drizzle.config.ts</summary>

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
```

</details>

<details>
  <summary>src/db/schema.ts</summary>

```ts
// src/db/schema.ts
// better-auth generated
import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  numeric,
  unique,
} from "drizzle-orm/sqlite-core";

export const fruit = sqliteTable(
  "fruit",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 30 }).notNull(),
    sweetness: numeric({ mode: "number" }).notNull().default(0.0),
    sourness: numeric({ mode: "number" }).notNull().default(0.0),
    bitterness: numeric({ mode: "number" }).notNull().default(0.0),
    basketId: text("basket_id")
      .notNull()
      .references(() => basket.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [unique("uk_fruit_name").on(t.name)],
);

export const basket = sqliteTable(
  "basket",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 30 }).notNull(),
    capacity: integer("capacity", { mode: "number" }).notNull().default(20),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [unique("uk_basket_name").on(t.name)],
);

export const post = sqliteTable("post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  title: text("title", { length: 50 }).notNull(),
  body: text("body", { length: 512 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRolesEnum = ["user", "admin"] as const;

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  role: text("role", { enum: userRolesEnum }).notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const fruitRelations = relations(fruit, ({ one }) => ({
  basket: one(basket, {
    fields: [fruit.basketId],
    references: [basket.id],
  }),
}));

export const basketRelations = relations(basket, ({ many }) => ({
  fruit: many(fruit),
}));

export const postRelations = relations(post, ({ one }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  session: many(session),
  account: many(account),
  post: many(post),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const tables = {
  fruit,
  basket,
  post,
  user,
  session,
  account,
  verification,
};
```

</details>

<details>
  <summary>src/db/index.ts</summary>

```ts
// src/db/index.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { type ACL as IACL } from "@bepalo/query";
import type { CTXUserSession } from "@/auth/middleware";
import * as schema from "./schema";
export * as schema from "./schema";

const client = createClient({ url: process.env.DB_FILE_NAME! });
export const db = drizzle(client, { schema });

export type UserRoles = "user" | "admin";
export type Database = typeof db;
export type Query = typeof db.query;
export type Schema = typeof schema;

// A good place to define ACL
export type ACL<XContext = {}> = IACL<
  UserRoles,
  CTXUserSession,
  XContext,
  Schema,
  Database
>;

export default db;
```

</details>

#### Create auth and its middleware

<details>
  <summary>src/auth/index.ts</summary>

```ts
// src/auth/index.ts
import { db, schema } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { z } from "zod";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET || "<better-auth-secret>",

  emailAndPassword: {
    enabled: true,
  },

  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: true,
        validator: {
          input: z.enum(["user", "admin"]),
        },
      },
    },
  },
});
```

</details>

<details>
  <summary>src/auth/middleware.ts</summary>

```ts
// src/auth/middleware.ts
import { Status, status, type RequestHandler } from "@bepalo/router";
import { auth } from "@/auth";

export type CTXUserSession = {
  session: typeof auth.$Infer.Session.session;
  user: typeof auth.$Infer.Session.user;
};

export const authenticate = (options?: {
  optional?: boolean;
}): RequestHandler<CTXUserSession> => {
  const optional = options?.optional;
  return async (req, ctx) => {
    // Pass the incoming request headers to Better Auth
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    // Validate session
    if (!optional && !session) {
      return status(Status._401_Unauthorized);
    }
    if (session != null) {
      ctx.session = session.session;
      ctx.user = session.user;
    }
  };
};
```

</details>

#### Create a Query route and mount it to server

<details>
  <summary>src/index.ts</summary>

```ts
// src/index.ts
import { createQueryRoute } from "@bepalo/query";
import { authenticate, type CTXUserSession } from "@/auth/middleware";
import { auth } from "@/auth"; // better-auth
import { db, schema, type UserRoles } from "@/db";
import acl from "@/db/acl";

// returns an object of the request handlers for
//   the http methods HEAD, GET, POST, PATCH, and DELETE
const queryRoute = createQueryRoute<UserRoles, CTXUserSession>({
  idParam: "id",
  acl,
  database: db,
  schema,
  defaults: {
    maxDepth: 2,
    maxLimit: 1000,
  },
  onError: (error) => console.error(error),
  session: {
    parser: authenticate({ optional: true }),
    getRole: (_req, { user }) => user?.role as UserRoles,
  },
});

// better-auth api endpoint
const authUrl = new URL(
  process.env.BETTER_AUTH_URL || "http://localhost:4000/api/auth",
);
const authPath = authUrl.pathname === "/" ? "/api/auth" : authUrl.pathname;
console.log("Better Auth Endpoint:", authPath);

// serve
const server = Bun.serve({
  port: parseInt(process.env.PORT || "4000"),
  routes: {
    [`${authPath}/*`]: auth.handler, // better-auth
    "/query/:id": queryRoute, // bepalo-query
  },
});
console.log(`Backend server listening on ${server.url}`);
```

</details>

Your resources will now be available at `/query/<resource>`

#### Define the ACL - Access Control

The main ACL file

<details>
  <summary>src/db/acl/index.ts</summary>

```ts
// src/db/acl/index.ts
import type { ACL } from "@/db";

import { createInsertSchema, createUpdateSchema } from "drizzle-arktype";
import { tables } from "@/db/schema";

export default {
  users: {
    table: "user",
    maxDepth: 0,
    findFirst: false,
    control: {
      GET: {
        admin: { select: true },
      },
    },
  },

  user: {
    table: "user",
    maxDepth: 0,
    findFirst: true,
    control: {
      GET: {
        mine: {
          select: {
            mode: false,
            columns: new Set(["createdAt", "updatedAt"]),
          },
          with: {
            account: false,
          },
          where: ({ session }, user, { eq }) => eq(user.id, session.userId),
        },
      },
    },
  },

  posts: {
    table: "post",

    maxDepth: 1, // override default if set. null -> no-limits
    maxLimit: 10, // override default if set. null -> no-limits
    countTotal: true, // return the total count of records after query based on acl where filter only
    // findFirst: true, // force findFirst

    // Custom formatter
    // formatResult: (_req, { resourceId, findFirst, result }) =>
    //   Response.json({ [resourceId]: result?.rows }),

    // The control
    control: {
      GET: {
        mine: {
          select: true, // allow selection of all columns
          with: {
            user: {
              select: true,
              forbidQuery: {
                with: true,
                offset: true,
                limit: true,
                orderBy: true,
                where: true,
                // columns: false
              },
              select: {
                mode: false,
                columns: new Set(["createdAt", "updatedAt"]),
              },
            },
          },
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),

          // Alternatively you could omit all columns and use extras only.
          // select: false, // no columns will be selected because {} is empty
          // extras: { count: sql`count(*)`.as("count") },
        },
      },

      POST: {
        mine: {
          select: true,
          // Body Validation using arktype
          validateBody: (b) =>
            createInsertSchema(tables.post).pick("title", "body").assert(b),
          // Body Injection for body transformation. Anything is possible
          injectBody: (b, { session: { userId } }) => ({
            ...b,
            userId,
          }),
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),
        },
      },

      PATCH: {
        mine: {
          select: true,
          // Body Validation using arktype
          validateBody: (b) =>
            createUpdateSchema(tables.post).pick("title", "body").assert(b),
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),
        },
      },

      DELETE: {
        mine: {
          select: true,
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),
        },
      },
    },
  },

  fruits: {
    table: "fruit",
    maxDepth: 1, // override default if set. null -> no-limits
    maxLimit: 10, // override default if set. null -> no-limits
    countTotal: true, // return the total count of records after query based on acl where filter only
    // findFirst: true, // force findFirst
    formatResult: (_req, { resourceId, findFirst, result }) => {
      const response: any = {};
      if (result) {
        if (result.total !== undefined) {
          response.total = result.total;
        }
        if (result.rowsAffected != null) {
          response.rowsAffected = result.rowsAffected;
        }
        if (findFirst) {
          response[resourceId as string] = result.rows;
        } else {
          response.count = result.count ?? result.rows?.length ?? 0;
          response[resourceId] = result.rows;
        }
      }
      return Response.json(response);
    },
    control: {
      GET: {
        all: {
          select: true,
        },
      },

      POST: {
        all: {
          select: true,
        },
      },

      DELETE: {
        all: {
          select: true,
        },
      },
    },
  },

  baskets: {
    table: "basket",
    maxDepth: 1,
    maxLimit: 10,
    control: {
      GET: {
        all: {
          select: {
            mode: false,
            columns: new Set(["createdAt", "updatedAt"]),
          },
          with: {
            fruit: {
              // maxLimit: 2,
              select: {
                // mode: true,
                // columns: new Set(["name"]),
                mode: false,
                columns: new Set(["createdAt", "updatedAt"]),
              },
            },
          },
        },
      },

      POST: {
        all: {
          select: {
            mode: false,
            columns: new Set(["createdAt", "updatedAt"]),
          },
        },
      },

      DELETE: {
        all: {
          select: true,
        },
      },
    },
  },
} satisfies ACL;
```

</details>

#### RESTClient VSCode Extension for testing APIs

<details>
  <summary>.http</summary>

```http
### REST-Client VSCode extension
@hostname=http://localhost:4000
@query={{hostname}}/query
@newPost={{createPost.response.body.$.posts.0}}
@newPostId={{createPost.response.body.$.posts.0.id}}
@basket0Id={{createBaskets.response.body.$.baskets.0.id}}
@basket1Id={{createBaskets.response.body.$.baskets.1.id}}


###################################
## Signup

### Signup Mr. User
POST {{hostname}}/api/auth/sign-up/email
Origin: {{hostname}}
Content-Type: application/json

{
  "name": "Mr. User",
  "email": "user@local.dev",
  "password": "User@1234"
}

### Signup Mr.Admin
POST {{hostname}}/api/auth/sign-up/email
Origin: {{hostname}}
Content-Type: application/json

{
  "name": "Mr. Admin",
  "email": "admin@local.dev",
  "role": "admin",
  "password":
  "Admin@1234"
}

###################################
## Signin / Signout

###  Signout
POST {{hostname}}/api/auth/sign-out
Origin: {{hostname}}

### Signin as Mr. User
POST {{hostname}}/api/auth/sign-in/email
Content-Type: application/json
Origin: {{hostname}}

{
  "email": "user@local.dev",
  "password": "User@1234"
}

### Signin as Mr. Admin
POST {{hostname}}/api/auth/sign-in/email
Content-Type: application/json
Origin: {{hostname}}

{
  "email": "admin@local.dev",
  "password": "Admin@1234"
}

###################################
## Posts

###
# @name createPost
POST {{query}}/posts?countTotal&select=(columns:~T(id,title,body)~)
Content-Type: application/json

{ "title": "first post", "body": "Hello world!" }

###
# @name createPost
POST {{query}}/posts?countTotal&select=(columns:F)
Content-Type: application/rjson

_(
  (title: 'first post 1', body: 'Hello world 1!'),
  (title: 'first post 2', body: 'Hello world 2!'),
  (title: 'first post 3', body: 'Hello world 3!'),
  (title: 'first post 4', body: 'Hello world 4!'),
  (title: 'first post 5', body: 'Hello world 5!'),
  (title: 'first post 6', body: 'Hello world 6!'),
  (title: 'first post 7', body: 'Hello world 7!'),
  (title: 'first post 8', body: 'Hello world 8!'),
  (title: 'first post 9', body: 'Hello world 9!'),
  (title: 'first post 10', body: 'Hello world 10!')
)_

###
PATCH {{query}}/posts?mine&countTotal&select=(where:(id:'{{newPostId}}'),columns:~T(id,title,body)~)
Content-Type: application/json

{ "body": "Bye world!" }

###
DELETE {{query}}/posts?mine&countTotal
###
DELETE {{query}}/posts?mine&countTotal&select=(columns:F)
###
DELETE {{query}}/posts?mine&countTotal&select=(columns:~T(id,title,body)~)
###
DELETE {{query}}/posts?mine&countTotal&select=(where:(id:'{{newPostId}}'),columns:~T(id,title,body)~)

###
GET {{query}}/posts?select=(where:(body.like:'Bye%%',createdAt.gte:{{$timestamp -20 m}}000),columns:~T(id,title,body)~,orderBy:(createdAt:'asc'))

###
GET {{query}}/posts?select=(where:_((body.like:'Bye%%'),(createdAt.gte:{{$timestamp -20 m}}000))_,columns:~T(id,title,body)~,orderBy:(createdAt:'asc'))

###
GET {{query}}/posts?countTotal
###
GET {{query}}/posts?mine|guest
###
GET {{query}}/posts?mine&countTotal&select=(columns:~T(id,title)~)
###
GET {{query}}/posts?mine&countTotal&select=(limit:5,columns:T)
###
GET {{query}}/posts?mine&countTotal&select=(offset:18,columns:T)
###
GET {{query}}/posts?mine&countTotal&select=(offset:18,limit:5,columns:T)
###
GET {{query}}/posts?mine&countTotal&select=(columns:~T(id,title,body)~)
###
GET {{query}}/posts?mine&select=(limit:11,columns:~T(id,title,body)~,with:(user:T))
###
GET {{query}}/posts?mine&select=(columns:~T(id,title,body)~,with:(user:(columns:~T(name)~,with:(posts:(columns:~T(title)~,with:(users:(columns:~T(id)~)))))))
###
GET {{query}}/posts?mine&select=(where:(id.eq:'{{newPostId}}'),columns:~T(id,title,body)~)


###################################
## Baskets

###
GET {{query}}/baskets?select=(columns:~T(name,capacity)~,with:(fruit:(columns:~T(name)~)))

###
# @name createBaskets
POST {{query}}/baskets?select=(columns:~T(id,name,capacity)~)
Content-Type: application/rjson

_(
  ( name:'Basket 1', capacity:5 ),
  ( name:'Basket 2', capacity:10 )
)_

###
DELETE {{query}}/baskets?select=(columns:F)

###################################
## Fruits

###
GET {{query}}/fruits

###
POST {{query}}/fruits
Content-Type: application/rjson

_(
  ( name: 'Apple', sweetness: 7, sourness: 2, basketId: '{{basket0Id}}' ),
  ( name: 'Banana', sweetness: 7, basketId: '{{basket0Id}}' ),
  ( name: 'Mango', sweetness: 9, sourness: 2, basketId: '{{basket1Id}}' )
)_

###
DELETE {{query}}/fruits

###################################
## Test OPTIONS method

###
OPTIONS {{query}}/posts
###
OPTIONS {{query}}/posts?mine
###
OPTIONS {{query}}/fruits?guest

```

</details>

## 🔧 Client Query Builder

Building RJSON manually becomes tedious.

The client library provides a fully typed API.

### Create Client

```ts
// src/lib/query-client.ts -- frontend
import { createQueryClient } from "@bepalo/query/client";
import type { Schema, Database } from "@db"; // import types only from backend

// default baseUrl = location.origin if defined
export const queryClient = createQueryClient<Schema, Database>();

// explicit baseUrl
export const queryClient = createQueryClient<Schema, Database>(
  "http://localhost:4000",
);

// default query-path is /query
export const queryClient = createQueryClient<Schema, Database, "/query/v1">();

export default queryClient;
```

### Build Queries

NOTE: the query builder will return a URLSearchParams instance for the
GET method of the specified table not the resource.
This is because exposing the ACL in the frontend is a bad idea.

```ts
// src/app/page.tsx
import queryClient from "@/lib/query-client";

//...
useEffect(() => {
  queryClient
    .Get<"basket", "baskets">("/query/baskets", {
      // findFirst: true,
      // "mine|guest": true,
      // mine: true,
      // guest: true,
      countTotal: true,
      select: {
        columns: {
          name: true,
        },
        with: {
          fruit: {
            // offset: 1,
            // limit: 1,
            orderBy: { sweetness: -1, name: "asc" },
            where: { "name.like": "%an%" },
            columns: {
              name: true,
              sweetness: true,
            },
          },
        },
      },
    })
    .then(({ baskets, ...res }) => {
      console.log(res);
      console.dir(baskets, { depth: 5 });
    })
    .catch(console.error);
}, []);
//...
```

Everything is inferred directly from Drizzle relations.

Invalid columns become TypeScript errors.

Invalid relations become TypeScript errors.

## 🔑 Authentication

You can plug in your own authentication method through the provided `session` parameter:

- `session.parser` which parses the session from the request into the context
- `session.getRole` which gets the role of the user from the parsed session.

The query engine only cares about the role. It is up to you how to manage the session context.

```ts
session: {
  parser: authenticate({ optional: true }),

  getRole: (req, ctx) =>
    ctx.user?.role as UserRole,
}
```

## 🔐 ACL System

This is what the access control code looks like. This is a showcase ACL file to show what is possble.

```ts
// src/db/acl/post/acl.ts
import type { ACL } from "@db"; // The ACL type we defined with our Schema and Database
import { createInsertSchema, createUpdateSchema } from "drizzle-arktype";
import { tables } from "../schema";

export default {
  posts: {
    table: "post",

    maxDepth: 1, // override default if set. null -> no-limits
    maxLimit: 10, // override default if set. null -> no-limits
    countTotal: true, // return the total count of records after query based on acl where filter only
    // findFirst: true, // force findFirst

    // Custom formatter
    // formatResult: (_req, { resourceId, findFirst, result }) =>
    //   Response.json({ [resourceId]: result?.rows }),

    // The control
    control: {
      GET: {
        mine: {
          select: true, // allow selection of all columns
          with: {
            user: {
              forbidQuery: {
                with: true,
                offset: true,
                limit: true,
                orderBy: true,
                where: true,
                // columns: false
              },
              select: {
                mode: false,
                columns: new Set(["createdAt", "updatedAt"]),
              },
            },
          },
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),

          // Alternatively you could omit all columns and use extras only.
          // select: false, // no columns will be selected because {} is empty
          // extras: { count: sql`count(*)`.as("count") },
        },
      },

      POST: {
        mine: {
          // Body Validation using arktype
          validateBody: (b) =>
            createInsertSchema(tables.post).pick("title", "body")(b),
          // Body Injection for bidy transformation. Anything is possible
          injectBody: (b, { session: { userId } }) => ({
            ...b,
            userId,
          }),
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),
        },
      },

      PATCH: {
        mine: {
          // Body Validation using arktype
          validateBody: (b) =>
            createUpdateSchema(tables.post).pick("title", "body")(b),
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),
        },
      },

      DELETE: {
        mine: {
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),
        },
      },
    },
  },
} satisfies ACL;
```

Every request passes through ACL evaluation before reaching the database.
A resource will only be fetched if it is defined in the acl and its `*.select` field is set.

---

ACL definitions can be separated into files and imported to a common ACL.
This is good for collaboration, scaling, and ease of use.

```ts
import type { ACL } from "@/db";
import userACL from "./user.acl";
import postACL from "./post.acl";

export default {
  ...userACL,
  ...postACL,
} satisfies ACL;
```

The default result formatter:

```ts
formatResult: (_req, { resourceId, findFirst, result }) => {
  const response: any = {};
  if (result) {
    if (result.total !== undefined) {
      response.total = result.total;
    }
    if (result.rowsAffected != null) {
      response.rowsAffected = result.rowsAffected;
    }
    if (findFirst) {
      response[resourceId as string] = result.rows;
    } else {
      response.count = result.count ?? result.rows?.length ?? 0;
      response[resourceId] = result.rows;
    }
  }
  return Response.json(response);
},
```

### Roles

#### guest

Unauthenticated users.

```ts
GET: {
  guest: {
  }
}
```

#### mine

Authenticated ownership access. Don't forget to add row-level security to limit
query to the current authenticated user.

```ts
GET: {
  mine: {
    where: ({ session }, post, { eq }) => eq(post.userId, session.userId); // row-level security
  }
}
```

#### all

Available regardless of authentication.

```ts
GET: {
  all: {
  }
}
```

#### User-defined roles

```ts
type UserRoles = "admin" | "editor" | "moderator";
```

```ts
GET: {
  moderator: {
  }
}
```

### The `control` Structure

A control entry supports the following capabilities:

```ts
GET: {
  guest : {
    forbidQuery?: {...};

    maxLimit?: ...,
    maxDepth?: ...,

    select?: ...;
    extras?: {...};

    where?: (...);
    orderBy?: {...};

    with?: {...};

    validateBody?: (...); // only available in POST and PATCH
    injectBody?: (...); // only available in POST and PATCH

    beforeQuery?: (...);
    afterQuery?: (...);
    onQueryError?: (...);
  }
}
```

#### forbidQuery

Restricts which query capabilities clients may use.

```ts
GET: {
  all: {
    forbidQuery: {
      columns: true,
      where: true,
      orderBy: true,
      with: true,
      limit: true,
      offset: true,
    }
  }
}
```

Attempting to use a forbidden query feature automatically returns:

```http
400 Bad Request
```

Available options:

```ts
forbidQuery: {
  columns?: boolean;
  offset?: boolean;
  limit?: boolean;
  where?: boolean;
  orderBy?: boolean;
  with?: boolean;
}
```

#### select

Controls column-level access.

##### Allow-list Mode

```ts
select: {
  mode: true,

  columns: new Set([
    "id",
    "title"
  ])
}
```

Only listed columns may be queried.

##### Deny-list Mode

```ts
select: {
  mode: false,

  columns: new Set([
    "password",
    "secret"
  ])
}
```

Listed columns are hidden from clients.

##### Full Access

```ts
select: true;
```

Allow all columns.

##### Disable Selection

```ts
select: false;
```

No table columns are returned.

Useful when returning only computed fields.

#### extras

Adds computed SQL fields.

```ts
import { sql } from "drizzle-orm";

GET: {
  all: {
    select: false,

    extras: {
      count: sql`count(*)`.as("count")
    }
  }
}
```

Result:

```json
{
  "count": 42
}
```

#### where

Add row-level security.

```ts
GET: {
  mine: {
    where: ({ session }, post, { eq }) => eq(post.userId, session.userId);
  }
}
```

This condition is AND'ed with any client-provided filters.

```sql
(<acl-filter>)
AND
(<client-filters>)
```

#### orderBy

Valid orderBy values are `"asc"` `"desc"` `1` and `-1`.

```ts
GET: {
  all: {
    orderBy: {
      createdAt: "desc",
    }
  }
}
```

Multiple fields:

```ts
orderBy: {
  updatedAt: "desc",
  createdAt: "asc"
}
```

Supported values:

```ts
type Order = "asc" | "desc" | 1 | -1;
```

#### with

Controls relation loading.

Relations can have their own nested ACL configuration.

```ts
GET: {
  all: {
    with: {
      user: {
        select: {
          mode: true,
          columns: new Set([
            "id",
            "name"
          ])
        }
      }
    }
  }
}
```

You can go deeper. It is drizzle query underneath.

```ts
GET: {
  all: {
    with: {
      user: {
        with: {
          profile: {
            select: true
          }
        }
      }
    }
  }
}
```

#### validateBody

Available only for:

- POST
- PATCH

Used to validate and parse incoming request bodies.

```ts
POST: {
  mine: {
    validateBody: (body) =>
      createInsertSchema(post).pick("title", "content").assert(body);
  }
}
```

Returning validation errors automatically rejects the request.

#### injectBody

Available only for:

- POST
- PATCH

Used to transform request bodies before database operations.

```ts
POST: {
  mine: {
    injectBody: (body, { session }) => ({
      ...body,
      userId: session.userId,
    });
  }
}
```

Client sends:

```json
{
  "title": "Hello"
}
```

Database receives:

```json
{
  "title": "Hello",
  "userId": "123"
}
```

#### beforeQuery

Runs before the database operation executes.

Useful for:

- auditing
- rate limiting
- metrics
- custom authorization
- transaction preparation
- creating dependencies. eg. company-admin user creation before company creation.

```ts
GET: {
  admin: {
    beforeQuery: async (ctx) => {
      // tx.insert(...); // insert into a related table
      /*
       * Eg. You could insert an organization admin when creating an organization with body
       *
       * { "name": "Barber Shop", ..., "admin": { "name": "Natnael", "email": "me@example.com", ... } }
       *
       * The 'admin' entry would be filtered out aat injection phase and the admin data be stored in context.
       * Then the admin would be registered as a user in the before query phase.
       */
    };
  }
}
```

#### afterQuery

Runs after a successful database operation.

Useful for:

- analytics
- cache invalidation
- event publishing
- success notifications
- logging

```ts
GET: {
  admin: {
    afterQuery: async (ctx) => {
      // tx.insert(...); // insert into a related table
      // tx.update(...); // update a related table
      // Notifications
    };
  }
}
```

#### onQueryError

Handles errors produced while executing the database query.

```ts
GET: {
  all: {
    onQueryError: async (error, ctx) => {
      console.error(error);
    };
  }
}
```

Custom responses may be returned.

```ts
onQueryError: (error) =>
  Response.json(
    {
      error: "Database failure",
    },
    {
      status: 500,
    },
  );
```

#### Example

```ts
GET: {
  mine: {
    select: {
      mode: true,
      columns: new Set([
        "id",
        "name"
      ])
    },

    where: ({ session }, post, { eq }) =>
      eq(post.userId, session.userId),

    orderBy: {
      createdAt: "desc"
    },

    with: {
      user: {
        select: {
          mode: false,
          columns: new Set([
            "password",
            "token"
          ])
        },
      }
    },

    beforeQuery: async (ctx) => {
      // tx.insert(...); // insert into a related table
    },

    afterQuery: async (ctx) => {
      // tx.insert(...); // insert into a related table
      // tx.update(...); // update a related table
    },

    onQueryError: async (error) => {
      // log error
      console.error(error);
      // or return a custom error response
      return json({ error: error.message ?? "Database error" }, { status: 500 });
    }
  }
}
```

## 📚 Query Language

Bepalo Query uses RJSON for end-to-end url communication. Please refer to [RJSON library](https://www.npmjs.com/package/@bepalo/rjson) for more information.

### Pagination

```txt
?select=(limit:10)
```

```txt
?select=(limit:10,offset:20)
```

### Select Columns

```txt
?select=(columns:(id:T,title:T))
```

### Filtering

```txt
?select=(where:(title.like:'Hello%'))
```

### Multiple Filters

`AND`

```txt
?select=(where:(title.like:'Hello%',published.eq:T))
```

```SQL
WHERE title LIKE 'Hello%' AND published = true
```

`OR`

```txt
?select=(where:_((title.like:'Hello%'),(published.eq:T))_)
```

```SQL
WHERE title LIKE 'Hello%' OR published = true
```

Sum of products

```txt
?select=(where:_((title.like:'Hello%',published.eq:T),(createdAt.gte:1234567000))_)
```

```SQL
WHERE (title LIKE 'Hello%' AND published = true) OR createdAt >= 1234567000
```

### Sorting

```txt
?select=(orderBy:(updatedAt:asc,createdAt:desc))
```

```SQL
ORDER BY updatedAt ASC, createdAt DESC
```

### Relations

```txt
?select=(with:(user:T))
```

Nested:

```txt
?select=(with:(user:(columns:(id:T,name:T))))
```

Or using RJSON mapped arrays

```txt
?select=(with:(user:(columns:~T(id,name)~)))
```

## 🌐 HTTP Methods

### GET Handlers

Gets records

```ts
GET: {
  mine: {
    select: {
      mode: false,
      columns: new Set(["createdAt","updatedAt"])
    }
    where: ({ session }, post, { eq }) => eq(post.userId, session.userId); // row-level security
  }
  admin: {
    // select: true, // by default all columns will be selected
  }
}
```

### POST Handlers

Create records.

#### Validation

Used to validate the body before it reaches the database query.

```ts
POST: {
  mine: {
    validateBody: (body) =>
      createInsertSchema(post).pick("title", "body")(body);
  }
}
```

#### Body Injection

Used to transform body before it reaches the database query. Anything is possible.

```ts
POST: {
  mine: {
    injectBody: (body, { session }) => ({
      ...body,
      userId: session.userId,
    });
  }
}
```

Client:

```json
{
  "title": "Hello"
}
```

Database receives:

```json
{
  "title": "Hello",
  "userId": "123"
}
```

### PATCH Handlers

```ts
PATCH: {
  mine: {
    validateBody(...),

    where: ({ session }, post, { eq }) =>
      eq(post.userId, session.userId) // row-level security
  }
}
```

### DELETE Handlers

```ts
DELETE: {
  mine: {
    where: ({ session }, post, { eq }) => eq(post.userId, session.userId); // row-level security
  }
}
```

### OPTIONS and HEAD

The HEAD method is just GET method without a body.  
Use OPTIONS to inspect resource availabilities.

```http
OPTIONS /query/posts?mine|guest
```

Response:

```http
Allow: OPTIONS,HEAD,GET,POST
```

## 🧮 Computed Fields

Add extra columns using SQL expressions.

```ts
METHOD: {
  select: false, // no columns will be selected because {} is empty
  extras: {
    count: sql`count(*)`.as("count"), // row-level security
  }
}
```

Result:

```json
{
  "count": 53
}
```

## 🚫 Restrict Client Queries

You can disable any of these query capabilities from the ACL.

```ts
METHOD: {
  forbidQuery: {
    columns: true,
    where: true,
    orderBy: true,
    with: true,
    limit: true,
    offset: true,
  }
}
```

Invalid usage automatically returns:

```http
400 Bad Request
```

## 🎨 Custom Result Formatting

Default:

```json
{
  "count": 10,
  "posts": [...]
}
```

Custom:

```ts
formatResult: (req, ctx) =>
  json({
    rowsAffected: ctx.result.rowsAffected ?? null,
    total: ctx.result.total ?? null,
    customCount: ctx.result.count,
    custom: ctx.result.rows,
  });
```

```json
{
  "rowsAffected": null,
  "total": null,
  "customCount": 0,
  "custom": [...]
}
```

## ⚠️ Production Recommendations

### Always Set Maximum Limits

```ts
defaults: {
  maxLimit: 20;
}
```

### Always Set Maximum Depth

```ts
defaults: {
  maxDepth: 2;
}
```

### Enforce Row-Level Security Server-side

Prefer:

```ts
where: ({ session }, table, { eq }) => eq(table.userId, session.userId);
// this will be AND'ed with the users query 'where' filters
```

### Validate Every Body for POST and PATCH

```ts
validateBody(...)
```

### Hide Sensitive Data

```ts
select: {
  mode: false,

  columns: new Set([
    "password",
    "token",
    "secret"
  ])
}
```

## 📄 License

[MIT](./LICENSE)

## 🕊️ Thanks and Enjoy

If Bepalo Query helps your project, consider starring the repository and sharing it with others.

## 💖 Be a Sponsor

Support development and future improvements.

[![Ko-fi donate](https://img.shields.io/badge/Ko--fi-donate-orange?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/natieshzed)
