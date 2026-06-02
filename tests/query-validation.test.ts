import { describe, it, expect } from "vitest";
import {
  TSelectorGet,
  TSelectorPost,
  TSelectorPatch,
  TSelectorDelete,
  TPostBody,
  TPatchBody,
} from "../src/query.ts";
import { RJSON } from "@bepalo/rjson";

/**
 * Tests for the arktype-based query validators that gate every request.
 * These are the actual validators used inside createQueryRoute.
 */

describe("TSelectorGet — GET query selector validation", () => {
  it("should accept a valid full selector", () => {
    const input = RJSON.parse(
      "(limit:10,offset:20,columns:(id:T,title:T),where:(published:T),orderBy:(created:'desc'))",
    );
    const result = TSelectorGet(input);
    expect(result).not.toBeInstanceOf(Error);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(20);
    expect(result.columns.id).toBe(true);
    expect(result.where.published).toBe(true);
    expect(result.orderBy.created).toBe("desc");
  });

  it("should accept an empty selector", () => {
    const result = TSelectorGet({});
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should accept limit only", () => {
    const result = TSelectorGet({ limit: 50 });
    expect(result).not.toBeInstanceOf(Error);
    expect(result.limit).toBe(50);
  });

  it("should accept offset only", () => {
    const result = TSelectorGet({ offset: 100 });
    expect(result).not.toBeInstanceOf(Error);
    expect(result.offset).toBe(100);
  });

  it("should accept columns as boolean (true = all)", () => {
    const result = TSelectorGet({ columns: true });
    expect(result).not.toBeInstanceOf(Error);
    expect(result.columns).toBe(true);
  });

  it("should accept columns as boolean (false = none)", () => {
    const result = TSelectorGet({ columns: false });
    expect(result).not.toBeInstanceOf(Error);
    expect(result.columns).toBe(false);
  });

  it("should accept columns as object", () => {
    const result = TSelectorGet({
      columns: { id: true, title: true, secret: false },
    });
    expect(result).not.toBeInstanceOf(Error);
    expect(result.columns.id).toBe(true);
    expect(result.columns.secret).toBe(false);
  });

  it("should accept where as an object", () => {
    const result = TSelectorGet({
      where: { status: "active", published: true },
    });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should accept where as an array (OR conditions)", () => {
    const result = TSelectorGet({
      where: [{ status: "active" }, { status: "pending" }],
    });
    expect(result).not.toBeInstanceOf(Error);
    expect(Array.isArray(result.where)).toBe(true);
  });

  it("should accept orderBy with string directions", () => {
    const result = TSelectorGet({
      orderBy: { created: "asc", title: "desc" },
    });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should accept orderBy with numeric directions", () => {
    const result = TSelectorGet({
      orderBy: { created: 1, title: -1 },
    });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should accept with (relations) as boolean", () => {
    const result = TSelectorGet({
      with: { user: true, comments: true },
    });
    expect(result).not.toBeInstanceOf(Error);
    expect(result.with.user).toBe(true);
  });

  it("should accept with (relations) as nested selector", () => {
    const result = TSelectorGet({
      with: {
        user: {
          columns: { id: true, name: true },
          limit: 1,
        },
      },
    });
    expect(result).not.toBeInstanceOf(Error);
    expect(result.with.user.columns.id).toBe(true);
    expect(result.with.user.limit).toBe(1);
  });

  it("should reject unknown top-level keys", () => {
    const result = TSelectorGet({ garbage: "value" } as any);
    // The schema uses "+": "reject" so extra keys should fail
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should handle RJSON round-trip for complex queries", () => {
    const original = {
      limit: 20,
      offset: 40,
      columns: { id: true, title: true },
      where: { published: true },
      orderBy: { created: "desc" as const },
      with: {
        user: { columns: { name: true } },
      },
    };
    const serialized = RJSON.stringify(original);
    const parsed = RJSON.parse(serialized);
    const result = TSelectorGet(parsed);
    expect(result).not.toBeInstanceOf(Error);
    expect(result.limit).toBe(20);
    expect(result.with.user.columns.name).toBe(true);
  });
});

describe("TSelectorPost — POST query selector validation", () => {
  it("should accept columns", () => {
    const result = TSelectorPost({
      columns: { id: true, title: true },
    });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should accept empty selector", () => {
    const result = TSelectorPost({});
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should reject offset (POST doesn't paginate)", () => {
    const result = TSelectorPost({ offset: 10 } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject limit (POST doesn't paginate)", () => {
    const result = TSelectorPost({ limit: 10 } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject orderBy (POST doesn't sort)", () => {
    const result = TSelectorPost({ orderBy: { id: "asc" } } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject where (POST doesn't filter)", () => {
    const result = TSelectorPost({ where: { id: 1 } } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject with (POST doesn't join)", () => {
    const result = TSelectorPost({ with: { user: true } } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });
});

describe("TSelectorPatch — PATCH query selector validation", () => {
  it("should accept columns", () => {
    const result = TSelectorPatch({
      columns: { id: true },
    });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should accept where (PATCH filters rows to update)", () => {
    const result = TSelectorPatch({
      where: { id: 1 },
    });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should reject offset", () => {
    const result = TSelectorPatch({ offset: 10 } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject limit", () => {
    const result = TSelectorPatch({ limit: 10 } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject orderBy", () => {
    const result = TSelectorPatch({ orderBy: { id: "asc" } } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject with", () => {
    const result = TSelectorPatch({ with: { user: true } } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });
});

describe("TSelectorDelete — DELETE query selector validation", () => {
  it("should accept where (DELETE filters rows to delete)", () => {
    const result = TSelectorDelete({
      where: { id: 1 },
    });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should accept columns (for returning)", () => {
    const result = TSelectorDelete({
      columns: { id: true },
    });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should reject offset", () => {
    const result = TSelectorDelete({ offset: 10 } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject limit", () => {
    const result = TSelectorDelete({ limit: 10 } as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });
});

describe("TPostBody — POST body validation", () => {
  it("should accept a plain object", () => {
    const result = TPostBody({ title: "Hello", body: "World" });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should accept an array of objects", () => {
    const result = TPostBody([{ title: "Post 1" }, { title: "Post 2" }]);
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should reject a string", () => {
    const result = TPostBody("not a body" as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject a number", () => {
    const result = TPostBody(42 as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });

  it("should reject null", () => {
    const result = TPostBody(null as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });
});

describe("TPatchBody — PATCH body validation", () => {
  it("should accept a plain object", () => {
    const result = TPatchBody({ title: "Updated" });
    expect(result).not.toBeInstanceOf(Error);
  });

  it("should reject a string", () => {
    const result = TPatchBody("not a body" as any);
    expect(result.problems || result.message || result.summary).toBeTruthy();
  });
});

describe("Operator Syntax Validation", () => {
  it("should validate 'like' operator pattern", () => {
    // This tests if string operators are correctly passed through by the query parser
    const where = RJSON.parse("(where:(name:(like:'John%')))");
    // The parser handles functions as objects with key 'like'
    expect(where.where.name).toBeDefined();
    expect(where.where.name.like).toBe("John%");
  });

  it("should validate array operations like _()_", () => {
    const where = RJSON.parse("(where:(status:_('active','pending')_))");
    expect(Array.isArray(where.where.status)).toBe(true);
    expect(where.where.status).toContain("active");
    expect(where.where.status).toContain("pending");
  });
});
