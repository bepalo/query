import { describe, it, expect, vi } from "vitest";
import { createQueryRoute } from "../src/query.ts";

// Minimal mock schema for testing type inference and properties
const mockSchema = {
  users: {
    _: {
      name: "users",
    },
  },
  posts: {
    _: {
      name: "posts",
    },
  },
} as any;

// Minimal mock database
const mockDatabase = {
  transaction: vi.fn((cb) => {
    return cb({
      query: {
        users: { findMany: vi.fn(), findFirst: vi.fn() },
        posts: { findMany: vi.fn(), findFirst: vi.fn() },
      },
    });
  }),
  query: {
    users: { findMany: vi.fn(), findFirst: vi.fn() },
    posts: { findMany: vi.fn(), findFirst: vi.fn() },
  },
  insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn() })) })),
  update: vi.fn(() => ({
    set: vi.fn(() => ({ where: vi.fn(() => ({ returning: vi.fn() })) })),
  })),
  delete: vi.fn(() => ({ where: vi.fn(() => ({ returning: vi.fn() })) })),
} as any;

describe("createQueryRoute", () => {
  it("should create a router with correct route handlers", () => {
    const routes = createQueryRoute({
      schema: mockSchema,
      database: mockDatabase,
      idParam: "id",
    });

    expect(routes).toBeDefined();

    // Should have standard HTTP methods
    expect(routes.GET).toBeDefined();
    expect(routes.POST).toBeDefined();
    expect(routes.PATCH).toBeDefined();
    expect(routes.DELETE).toBeDefined();
    expect(routes.OPTIONS).toBeDefined();
    expect(routes.HEAD).toBeDefined();

    // Handlers should be functions (from @bepalo/router)
    expect(typeof routes.GET).toBe("function");
    expect(typeof routes.POST).toBe("function");
    expect(typeof routes.PATCH).toBe("function");
    expect(typeof routes.DELETE).toBe("function");
  });

  it("should apply default configurations properly", () => {
    const routes = createQueryRoute({
      schema: mockSchema,
      database: mockDatabase,
      idParam: "id",
      defaults: {
        maxLimit: 50,
        maxDepth: 3,
      },
    });

    expect(routes).toBeDefined();
    // In a real e2e test, we'd fire an HTTP request to verify the maxLimit behavior
  });

  it("should integrate with custom error handlers", () => {
    const onError = vi.fn();
    const routes = createQueryRoute({
      schema: mockSchema,
      database: mockDatabase,
      idParam: "id",
      onError,
    });

    expect(routes).toBeDefined();
  });
});
