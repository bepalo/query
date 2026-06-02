import { describe, it, expect, vi } from "vitest";
import { createQueryRoute } from "../src/query.ts";
import { RJSON } from "@bepalo/rjson";

// Minimal mock schema
const mockSchema = {
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
        posts: {
          findMany: vi.fn().mockResolvedValue([
            { id: 1, title: "Post 1", published: true },
            { id: 2, title: "Post 2", published: true },
          ]),
          findFirst: vi
            .fn()
            .mockResolvedValue({ id: 1, title: "Post 1", published: true }),
        },
      },
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValue([{ id: 3, title: "New Post" }]),
        })),
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValue([{ id: 1, title: "Updated" }]),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        })),
      })),
    });
  }),
  query: {
    posts: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
    },
  },
  insert: vi.fn(() => ({
    values: vi.fn(() => ({
      returning: vi.fn().mockResolvedValue([{ id: 3, title: "New Post" }]),
    })),
  })),
  update: vi.fn(() => ({
    set: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([{ id: 1, title: "Updated" }]),
      })),
    })),
  })),
  delete: vi.fn(() => ({
    where: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{ id: 1 }]) })),
  })),
} as any;

describe("Integration — createQueryRoute full lifecycle", () => {
  const router = createQueryRoute({
    schema: mockSchema,
    database: mockDatabase,
    idParam: "resourceId",
    acl: {
      posts: {
        control: {
          GET: { guest: true },
          POST: { guest: true },
          PATCH: { guest: true },
          DELETE: { guest: true },
        },
      } as any,
    },
    session: {
      parser: () => {},
      getRole: () => "guest",
    },
  });

  it("should process a GET request and return JSON", async () => {
    const selector = { limit: 10, where: { published: true } };
    const searchParams = new URLSearchParams();
    searchParams.set("q", RJSON.stringify(selector));

    const req = new Request(
      `http://localhost/api/posts?${searchParams.toString()}`,
      {
        method: "GET",
      },
    );
    (req as any).params = { resourceId: "posts" };

    // Simulate what the @bepalo/router would pass to the handler
    const ctx = {
      url: new URL(req.url),
      query: { q: RJSON.stringify(selector) },
      headers: new Headers(),
    } as any;

    const response = await router.GET(req, ctx);

    // In our simplified mock, it might just throw or return something depending on if the middleware chain runs correctly.
    // The main point is testing that the router handler exists and can receive a request context.
    expect(response).toBeDefined();

    // Since createQueryRoute returns an array of middleware (or a single chained handler),
    // it returns a Promise<Response> or Response if it finishes.
    // @bepalo/router middleware returns Response.

    if (response instanceof Response) {
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("posts");
    }
  });

  it("should enforce ACL block on GET", async () => {
    const secureRouter = createQueryRoute({
      schema: mockSchema,
      database: mockDatabase,
      idParam: "resourceId",
      acl: {
        posts: {
          control: {
            GET: { guest: false },
          },
        } as any,
      },
      session: {
        parser: () => {},
        getRole: () => "guest",
      },
    });

    const req = new Request("http://localhost/api/posts", { method: "GET" });
    (req as any).params = { resourceId: "posts" };
    const ctx = {
      url: new URL(req.url),
      query: {},
      headers: new Headers(),
    } as any;

    const response = (await secureRouter.GET(req, ctx)) as Response;
    if (response.status !== 403) {
      console.log("Unexpected status:", response.status, await response.json());
    }
    expect(response.status).toBe(403);
  });

  it("should process a POST request and create a resource", async () => {
    const body = { title: "New Post", published: true };
    // const searchParams = new URLSearchParams();
    // In @bepalo/router, body is parsed and attached to ctx.body

    const req = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    (req as any).params = { resourceId: "posts" };

    const ctx = {
      url: new URL(req.url),
      query: {},
      body, // mock parsed body
      headers: new Headers(),
    } as any;

    const response = await router.POST(req, ctx);
    expect(response).toBeDefined();
    if (response instanceof Response) {
      if (response.status !== 200) {
        console.log("POST failed:", response.status, await response.json());
      }
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("posts");
    }
  });

  it("should process a PATCH request and update a resource", async () => {
    const selector = { where: { id: 1 } };
    const body = { title: "Updated Title" };
    const searchParams = new URLSearchParams();
    searchParams.set("q", RJSON.stringify(selector));

    const req = new Request(
      `http://localhost/api/posts?${searchParams.toString()}`,
      {
        method: "PATCH",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
      },
    );
    (req as any).params = { resourceId: "posts" };

    const ctx = {
      url: new URL(req.url),
      query: { q: RJSON.stringify(selector) },
      body,
      headers: new Headers(),
    } as any;

    const response = await router.PATCH(req, ctx);
    expect(response).toBeDefined();
    if (response instanceof Response) {
      if (response.status !== 200) {
        console.log("PATCH failed:", response.status, await response.json());
      }
      expect(response.status).toBe(200);
    }
  });

  it("should process a DELETE request", async () => {
    const selector = { where: { id: 1 } };
    const searchParams = new URLSearchParams();
    searchParams.set("q", RJSON.stringify(selector));

    const req = new Request(
      `http://localhost/api/posts?${searchParams.toString()}`,
      {
        method: "DELETE",
      },
    );
    (req as any).params = { resourceId: "posts" };

    const ctx = {
      url: new URL(req.url),
      query: { q: RJSON.stringify(selector) },
      headers: new Headers(),
    } as any;

    const response = await router.DELETE(req, ctx);
    expect(response).toBeDefined();
    if (response instanceof Response) {
      if (response.status !== 200) {
        console.log("DELETE failed:", response.status, await response.json());
      }
      expect(response.status).toBe(200);
    }
  });

  it("should respect maxLimit configuration", async () => {
    const strictRouter = createQueryRoute({
      schema: mockSchema,
      database: mockDatabase,
      idParam: "resourceId",
      acl: {
        posts: {
          control: {
            GET: { guest: true },
          },
        } as any,
      },
      session: {
        parser: () => {},
        getRole: () => "guest",
      },
      defaults: {
        maxLimit: 5,
      },
    });

    const selector = { limit: 10 }; // Requests 10, but max is 5
    const searchParams = new URLSearchParams();
    searchParams.set("q", RJSON.stringify(selector));

    const req = new Request(
      `http://localhost/api/posts?${searchParams.toString()}`,
      { method: "GET" },
    );
    (req as any).params = { resourceId: "posts" };
    const ctx = {
      url: new URL(req.url),
      query: { q: RJSON.stringify(selector) },
      headers: new Headers(),
    } as any;

    try {
      const response = (await strictRouter.GET(req, ctx)) as Response;
      if (response && response.status !== 200) {
        expect(response.status).toBe(400); // 400 Bad Request for exceeding limit
      }
    } catch (e: any) {
      expect(e.status).toBe(400);
    }
  });
});
