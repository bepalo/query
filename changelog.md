# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.8] - 2026-06-06

### Added

- **Relative URL support in client**: `BepaloQueryClient` now accepts a `baseUrl` parameter (defaults to `location.origin` in browsers) and resolves relative paths correctly.
- **Custom URL encoding**: Added `encodeURIComponentRJSON` to encode only URL‑breaking characters (`&=#%+?`), leaving RJSON syntax (`()`, `:`, `,`, `[]`, `{}`) intact for compact queries.
- **`GetFirst` and `GetMany` methods** in client with proper response types (`InferResponseTypeFirst` and `InferResponseTypeMany`).
- **`countTotal` query parameter** (replaces `includeTotal`) to return total record count based on ACL `where` filter.
- **`onSurpassMaxLimit` enum** to control behaviour when client `limit` exceeds `maxLimit` – can throw an error or silently cap the limit.
- **`resourceId` and `depth` in error messages** for better debugging.
- **`formatResult` now available on `ACLWith`** (per‑role) as well as on `ACLEntry` (global).
- **RJSON body support for PATCH requests** (previously only POST).
- **Client `QueryURL` template literal type** to validate URL structure at compile time.

### Changed

- **Client now returns `Promise` from all methods** (fully async) and uses `Map<string,string>` instead of `URLSearchParams` for parameter building.
- **Client `createQueryClient` accepts optional `baseUrl`** (defaults to `location.origin`); the client validates the base URL on construction.
- **Server `deepCombine` now receives `aclEntry` and `maxDepth` parameters**, improving limit propagation through joins.
- **Column selection logic** now correctly handles `columns: false` (returns no columns) and `columns: true` (all columns) with ACL modes (allow‑list / deny‑list).
- **Role selection for GET, POST, PATCH, DELETE** now uses a clearer fallback chain: `userRole` > `mine` > `all` > `guest`.
- **Error responses** consistently return JSON with `error` field and appropriate HTTP status codes.
- **`parseBody` middleware** now supports `application/rjson` and returns JSON errors for unsupported media types, payload too large, or malformed payload.
- **`includeTotal` renamed to `countTotal`** across all query types and ACL definitions.

### Fixed

- **PATCH body not being parsed** – missing `await` added; now correctly parses JSON, URL‑encoded, and RJSON bodies.
- **`columns: false` caused an empty object** (truthy) leading to invalid SQL; now correctly sets `result.columns = false`.
- **Client URL construction for relative paths** – now uses `new URL(_url, baseUrl)` instead of assuming absolute URL.
- **Depth limits now propagate correctly** through recursive `with` joins.
- **`maxLimit` now respects client’s requested `limit`** and caps it instead of always using the cap value.
- **Unreachable code in `maxLimit` resolution** simplified.
- **Type definitions for `InferResponseTypeFirst`** (used by `GetFirst`) were corrected.

### Breaking

- **`acl.select` is now required** in every ACL rule. Previously, omitting `select` allowed all columns; now it returns a `400 Bad Request`. Add `select: true` to restore old behaviour.
- **`includeTotal` query parameter removed**; use `countTotal` instead.
- **Client no longer exports `createQuery`**; use `createQueryClient` and `createQueryBuilder`.
- **`BepaloQuery` class renamed to `BepaloQueryBuilder`** and `BepaloQueryClient` separated.
- **`parseBody` no longer accepts `text/plain`**; only `application/json`, `application/x-www-form-urlencoded`, and `application/rjson`.
- **`formatResult` now receives `ctx` with `resourceId`, `findFirst`, `result`** (instead of separate arguments).

## [1.1.6] - 2025-11-15

### Added

- Initial release of Bepalo Query.
- Type‑safe ACL system with support for `guest`, `mine`, `all`, and custom roles.
- Automatic CRUD endpoint generation from Drizzle schema.
- Query language with pagination (`offset`, `limit`), column selection (`columns`), filtering (`where` with operators like `eq`, `like`, `gt`), sorting (`orderBy`), and nested relations (`with`).
- Body validation and injection using ArkType.
- Row‑level security via `where` callbacks.
- Computed fields (`extras`) using SQL expressions.
- `beforeQuery`, `afterQuery`, `onQueryError` hooks.
- Client query builder (`BepaloQuery`) returning `URLSearchParams`.
- Support for `application/json` and `application/x-www-form-urlencoded` bodies.
- `includeTotal` query parameter to return total record count.
- `maxLimit` and `maxDepth` defaults and per‑resource overrides.
- `forbidQuery` to disable client‑side capabilities (columns, where, orderBy, with, limit, offset).
- `formatResult` for custom response shapes.
- OPTIONS and HEAD method support.
- Full TypeScript type inference from Drizzle relations.

[2.3.8]: https://github.com/bepalo/query/compare/v1.1.6...v2.3.8
[1.1.6]: https://github.com/bepalo/query/releases/tag/v1.1.6
