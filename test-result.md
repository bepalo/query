# Test Report

| 🕙 Start time | ⌛ Duration |
| --- | ---: |
| 6/4/2026, 3:24:42 PM | 1.882 s |

| | ✅ Passed | ❌ Failed | ⏩ Skipped | 🚧 Todo | ⚪ Total |
| --- | ---: | ---: | ---: | ---: | ---: |
|Test Suites|36|0|0|0|36|
|Tests|116|0|0|0|116|

## ✅ <a id="file0" href="#file0">tests/client.test.ts</a>

24 passed, 0 failed, 0 skipped, 0 todo, done in 16.326407000000017 s

```
✅ Client Query Builder › GET Queries
   ✅ should build basic GET query
   ✅ should build GET query with columns
   ✅ should build GET query with limit and offset
   ✅ should build GET query with where clause
   ✅ should build GET query with orderBy
   ✅ should build GET query with all options
   ✅ should return URLSearchParams
✅ Client Query Builder › POST Queries
   ✅ should build basic POST query
   ✅ should build POST query with columns
✅ Client Query Builder › PATCH Queries
   ✅ should build basic PATCH query
   ✅ should build PATCH query with where clause
✅ Client Query Builder › DELETE Queries
   ✅ should build basic DELETE query
   ✅ should build DELETE query with where clause
✅ Client Query Builder › Query Parameters
   ✅ should generate valid URL search params
   ✅ should handle empty selections
   ✅ should properly encode special characters
✅ Client Query Builder › Multiple Queries
   ✅ should build different query types independently
   ✅ should allow chaining different queries
✅ Client Query Builder › Real World Scenarios
   ✅ should build pagination query
   ✅ should build filtered and sorted query
   ✅ should build query with multiple column selections
   ✅ should be usable in fetch
✅ Client Query Builder › Type Safety
   ✅ should create query builder without errors
   ✅ should handle different resource types
✅ Client Query Builder
```

## ✅ <a id="file1" href="#file1">tests/create-query-route.test.ts</a>

3 passed, 0 failed, 0 skipped, 0 todo, done in 6.253281999999672 s

```
✅ createQueryRoute
   ✅ should create a router with correct route handlers
   ✅ should apply default configurations properly
   ✅ should integrate with custom error handlers
```

## ✅ <a id="file2" href="#file2">tests/http-error.test.ts</a>

6 passed, 0 failed, 0 skipped, 0 todo, done in 9.965693999999985 s

```
✅ HttpError
   ✅ should set message and status
   ✅ should default status to 500 when given 0 (falsy)
   ✅ should be an instance of Error
   ✅ should have a stack trace
   ✅ should be throwable and catchable by type
   ✅ should preserve status for common HTTP codes
```

## ✅ <a id="file3" href="#file3">tests/integration.test.ts</a>

6 passed, 0 failed, 0 skipped, 0 todo, done in 25.94682499999999 s

```
✅ Integration — createQueryRoute full lifecycle
   ✅ should process a GET request and return JSON
   ✅ should enforce ACL block on GET
   ✅ should process a POST request and create a resource
   ✅ should process a PATCH request and update a resource
   ✅ should process a DELETE request
   ✅ should respect maxLimit configuration
```

## ✅ <a id="file4" href="#file4">tests/query-validation.test.ts</a>

41 passed, 0 failed, 0 skipped, 0 todo, done in 22.388962999999876 s

```
✅ TSelectorGet — GET query selector validation
   ✅ should accept a valid full selector
   ✅ should accept an empty selector
   ✅ should accept limit only
   ✅ should accept offset only
   ✅ should accept columns as boolean (true = all)
   ✅ should accept columns as boolean (false = none)
   ✅ should accept columns as object
   ✅ should accept where as an object
   ✅ should accept where as an array (OR conditions)
   ✅ should accept orderBy with string directions
   ✅ should accept orderBy with numeric directions
   ✅ should accept with (relations) as boolean
   ✅ should accept with (relations) as nested selector
   ✅ should reject unknown top-level keys
   ✅ should handle RJSON round-trip for complex queries
✅ TSelectorPost — POST query selector validation
   ✅ should accept columns
   ✅ should accept empty selector
   ✅ should reject offset (POST doesn't paginate)
   ✅ should reject limit (POST doesn't paginate)
   ✅ should reject orderBy (POST doesn't sort)
   ✅ should reject where (POST doesn't filter)
   ✅ should reject with (POST doesn't join)
✅ TSelectorPatch — PATCH query selector validation
   ✅ should accept columns
   ✅ should accept where (PATCH filters rows to update)
   ✅ should reject offset
   ✅ should reject limit
   ✅ should reject orderBy
   ✅ should reject with
✅ TSelectorDelete — DELETE query selector validation
   ✅ should accept where (DELETE filters rows to delete)
   ✅ should accept columns (for returning)
   ✅ should reject offset
   ✅ should reject limit
✅ TPostBody — POST body validation
   ✅ should accept a plain object
   ✅ should accept an array of objects
   ✅ should reject a string
   ✅ should reject a number
   ✅ should reject null
✅ TPatchBody — PATCH body validation
   ✅ should accept a plain object
   ✅ should reject a string
✅ Operator Syntax Validation
   ✅ should validate 'like' operator pattern
   ✅ should validate array operations like _()_
```

## ✅ <a id="file5" href="#file5">tests/rjson.test.ts</a>

36 passed, 0 failed, 0 skipped, 0 todo, done in 21.05959699999994 s

```
✅ RJSON - Serialization › Basic Types
   ✅ should stringify objects
   ✅ should stringify arrays
   ✅ should stringify strings with single quotes
   ✅ should stringify numbers
   ✅ should stringify booleans
   ✅ should stringify null
   ✅ should stringify undefined
✅ RJSON - Serialization › Complex Structures
   ✅ should stringify nested objects
   ✅ should stringify arrays of mixed types
   ✅ should stringify deeply nested structures
✅ RJSON - Serialization › Edge Cases
   ✅ should handle empty objects
   ✅ should handle empty arrays
   ✅ should escape special characters in strings
   ✅ should handle numeric keys in objects
   ✅ should handle negative numbers
✅ RJSON - Serialization › Mapped Arrays
   ✅ should create mapped arrays for boolean permissions
   ✅ should create mapped arrays for numeric values
   ✅ should create mapped arrays for false values
✅ RJSON - Serialization
✅ RJSON - Parsing › Basic Types
   ✅ should parse objects
   ✅ should parse arrays
   ✅ should parse strings
   ✅ should parse numbers
   ✅ should parse booleans
   ✅ should parse null
   ✅ should parse undefined
✅ RJSON - Parsing › Complex Structures
   ✅ should parse nested objects
   ✅ should parse mixed type arrays
   ✅ should parse deeply nested structures
✅ RJSON - Parsing › Round Trip
   ✅ should maintain data integrity through stringify/parse
   ✅ should handle complex nested structures in round trip
✅ RJSON - Parsing › Error Handling
   ✅ should throw on invalid syntax
   ✅ should throw on mismatched parentheses
   ✅ should throw on invalid array syntax
✅ RJSON - Parsing › Real World Examples
   ✅ should parse database query selectors
   ✅ should parse permission objects
   ✅ should parse complex query with relations
✅ RJSON - Parsing
```
