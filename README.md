# 🏆 @bepalo/query

![hero](./assets/hero.png)

[![npm version](https://img.shields.io/npm/v/@bepalo/query.svg)](https://www.npmjs.com/package/@bepalo/query)
[![CI](https://img.shields.io/github/actions/workflow/status/bepalo/query/ci.yaml?label=ci)](https://github.com/bepalo/query/actions/workflows/ci.yaml)
[![tests](https://img.shields.io/github/actions/workflow/status/bepalo/query/testing.yaml?label=tests)](https://github.com/bepalo/query/actions/workflows/testing.yaml)
[![license](https://img.shields.io/npm/l/@bepalo/query.svg)](LICENSE)

<!-- ![Benchmarked](https://img.shields.io/badge/benchmarked-yes-green) -->

[![Vitest](https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](test-result.md)

**A type-safe access-control-driven unified RESTful database query engine for backend using Drizzle ORM.**

Bepalo Query automatically generates secure database-backed REST resources directly from your Drizzle schema and ACL definitions.

Instead of writing CRUD endpoints, validation, authorization, ownership checks, pagination, filtering, relation loading, and result formatting manually, you define access rules once and let the framework generate the API.

## ✨ Features

- 🔐 ACL-driven authorization
- 👤 Ownership-based access control
- 🛡️ Column-level security
- ⚡ Automatic CRUD endpoint generation
- 🔎 Filtering and sorting
- 📦 Pagination support
- 🌳 Nested relation loading
- 🧩 Query validation
- 📝 Request body validation
- 💉 Automatic body injection
- 📊 Computed SQL fields
- 🔄 Transaction support
- 🚫 Query restrictions
- 📏 Query depth limits
- 📈 Query size limits
- 🟦 Fully type-safe query builder
- 🚀 Built on Bun + Drizzle ORM

## 📑 Table of Contents

1. Features
2. Installation
3. Quick Start
4. Creating Resources
5. ACL System
6. Query Language
7. Authentication
8. CRUD Operations
9. Client Query Builder
10. Advanced Features
11. Production Recommendations
12. License

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

## 📦 Quick Start

### Create a Query Router

```ts
import { createQueryRouter, SurpassMaxLimit } from "@bepalo/query";

const queryRouteHandler = createQueryRouter({
  acl,
  schema,
  database: db,

  idParam: "id",

  onSurpassMaxLimit: SurpassMaxLimit.Throw, // default is .Limit

  defaults: {
    maxLimit: 20,
    maxDepth: 2,
  },

  session: {
    parser: authenticate({ optional: true }),
    getRole: (req, ctx) => ctx.user?.role,
  },
});
```

### Mount the Router

```ts
Bun.serve({
  routes: {
    "/query/v2/:id": queryRouteHandler,
  },
});
```

Your resources are now automatically available under:

```txt
/query/v2/<resource>
```

## 🧩 Creating Resources

Define resources using ACL.

```ts
export default {
  posts: {
    table: "post",

    control: {
      GET: {
        guest: {},
      },
    },
  },
};
```

This automatically creates:

```http
GET /query/v2/posts
```

Internally:

```ts
db.query.post.findMany(...)
```

No endpoint implementation required.

### Resource Aliases

Resources do not need to match table names.

```ts
{
  articles: {
    table: "post";
  }
}
```

Creates:

```txt
/query/v2/articles
```

while still querying:

```ts
db.query.post;
```

## 🔐 ACL System

The ACL is the heart of Bepalo Query.

```ts
{
  posts: {
    table: "post",

    control: {
      GET: {},
      POST: {},
      PATCH: {},
      DELETE: {}
    }
  }
}
```

Every request passes through ACL evaluation before reaching the database.

## 👥 Roles

### guest

Unauthenticated users.

```ts
GET: {
  guest: {
  }
}
```

### mine

Authenticated ownership access.

```ts
GET: {
  mine: {
    where: ({ session }, post, { eq }) => eq(post.userId, session.userId);
  }
}
```

### all

Available regardless of authentication.

```ts
GET: {
  all: {
  }
}
```

### Custom Roles

```ts
type UserRoles = "admin" | "editor" | "moderator";
```

```ts
GET: {
  admin: {
  }
}
```

## 🔑 Authentication

Authentication is optional.

```ts
session: {
  parser: authenticate({ optional: true }),

  getRole: (req, ctx) =>
    ctx.user?.role,
}
```

The parser:

- Validates sessions
- Loads user context
- Resolves ACL roles

## 📚 Query Language

Bepalo Query uses RJSON-based selectors.

### Pagination

```http
?select=(limit:10)
```

```http
?select=(limit:10,offset:20)
```

### Select Columns

```http
?select=(
  columns:(
    id:T,
    title:T
  )
)
```

### Filtering

```http
?select=(
  where:(
    title.eq:'Hello'
  )
)
```

### Multiple Filters

```http
?select=(
  where:(
    title.eq:'Hello',
    published.eq:T
  )
)
```

### Sorting

```http
?select=(
  orderBy:(
    createdAt:desc
  )
)
```

### Relations

```http
?select=(
  with:(
    user:T
  )
)
```

Nested:

```http
?select=(
  with:(
    user:(
      columns:(
        id:T,
        name:T
      )
    )
  )
)
```

## 🛡️ Column Security

### Whitelist Mode

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

### Blacklist Mode

```ts
select: {
  mode: false,

  columns: new Set([
    "password",
    "secret"
  ])
}
```

Sensitive fields are automatically removed.

## 📬 POST Requests

Create records safely.

### Validation

```ts
POST: {
  mine: {
    validateBody: (body) =>
      createInsertSchema(post).pick("title", "body")(body);
  }
}
```

### Body Injection

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

## ✏️ PATCH Requests

```ts
PATCH: {
  mine: {
    validateBody(...),

    where: ({ session }, post, { eq }) =>
      eq(post.userId, session.userId)
  }
}
```

Only matching records can be updated.

## 🗑️ DELETE Requests

```ts
DELETE: {
  mine: {
    where: ({ session }, post, { eq }) => eq(post.userId, session.userId);
  }
}
```

Only owned records are deleted.

## 📊 Computed Fields

Add custom SQL expressions.

```ts
extras: {
  count: sql`count(*)`.as("count");
}
```

Result:

```json
{
  "count": 53
}
```

## 🚫 Restrict Client Queries

Disable query capabilities entirely.

```ts
forbidQuery: {
  columns: true,
  where: true,
  orderBy: true,
  with: true,
  limit: true,
  offset: true,
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
    custom: ctx.result,
  });
```

## 🔧 Client Query Builder

Building RJSON manually becomes tedious.

The client library provides a fully typed API.

### Create Client

```ts
import { createQuery } from "@bepalo/query/client";

const q = createQuery<Schema, Database>();
```

### Build Queries

```ts
const query = q.Get<"fruit">({
  select: {
    columns: {
      id: true,
      name: true,
    },
  },
});
```

Use:

```ts
fetch(`/query/v2/fruits?${query}`);
```

### Nested Relations

```ts
const query = q.Get<"fruit">({
  select: {
    with: {
      basket: {
        columns: {
          name: true,
        },

        with: {
          fruit: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  },
});
```

Everything is inferred directly from Drizzle relations.

Invalid columns become TypeScript errors.

Invalid relations become TypeScript errors.

## 🔍 OPTIONS Discovery

Inspect resource capabilities.

```http
OPTIONS /query/v2/posts
```

Response:

```http
Allow: OPTIONS,HEAD,GET,POST
```

Useful for dynamic admin panels and API explorers.

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

### Enforce Ownership Server-Side

Prefer:

```ts
where: ({ session }, table, { eq }) => eq(table.userId, session.userId);
```

instead of trusting client filters.

### Validate Every Write

```ts
validateBody(...)
```

for:

- POST
- PATCH

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

## 🎯 Why Bepalo Query?

Traditional applications require building:

- CRUD endpoints
- Validation
- Authentication
- Authorization
- Ownership checks
- Filtering
- Pagination
- Relation loading
- Error handling

Bepalo Query replaces all of that with a declarative ACL.

Define access rules once.

Generate the entire database API automatically.

## 📄 License

MIT

## 🕊️ Thanks and Enjoy

If Bepalo Query helps your project, consider starring the repository and sharing it with others.

## 💖 Be a Sponsor

Support development and future improvements.

<a href="https://ko-fi.com/natieshzed">
  <img height="32" src="https://img.shields.io/badge/Ko--fi-donate-orange?style=for-the-badge&logo=ko-fi&logoColor=white">
</a>
