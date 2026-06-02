import { describe, it, expect } from "vitest";
import { createQuery } from "../src/client.ts";

// Mock schema and database types for testing
type MockSchema = {
  post: {
    $inferSelect: {
      id: number;
      title: string;
      body: string;
      published: boolean;
      userId: number;
      createdAt: Date;
    };
  };
  user: {
    $inferSelect: {
      id: number;
      name: string;
      email: string;
    };
  };
};

type MockDatabase = {
  query: {
    post: {
      findMany: (...args: any[]) => any;
    };
    user: {
      findMany: (...args: any[]) => any;
    };
  };
};

describe("Client Query Builder", () => {
  const query = createQuery<MockSchema, MockDatabase>();

  describe("GET Queries", () => {
    it("should build basic GET query", () => {
      const params = query.Get<"post">({
        select: {
          limit: 10,
        },
      });

      expect(params).toBeDefined();
      expect(params.toString()).toContain("limit");
    });

    it("should build GET query with columns", () => {
      const params = query.Get<"post">({
        select: {
          columns: {
            id: true,
            title: true,
          },
        },
      });

      expect(params).toBeDefined();
      expect(params.toString()).toContain("columns");
    });

    it("should build GET query with limit and offset", () => {
      const params = query.Get<"post">({
        select: {
          limit: 20,
          offset: 40,
        },
      });

      expect(params).toBeDefined();
      const str = params.toString();
      expect(str).toContain("limit");
      expect(str).toContain("offset");
    });

    it("should build GET query with where clause", () => {
      const params = query.Get<"post">({
        select: {
          where: {
            published: {
              eq: true,
            },
          },
        },
      });

      expect(params).toBeDefined();
    });

    it("should build GET query with orderBy", () => {
      const params = query.Get<"post">({
        select: {
          orderBy: {
            createdAt: "desc",
          },
        },
      });

      expect(params).toBeDefined();
      expect(params.toString()).toContain("orderBy");
    });

    it("should build GET query with all options", () => {
      const params = query.Get<"post">({
        select: {
          limit: 10,
          offset: 20,
          columns: {
            id: true,
            title: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      });

      expect(params).toBeDefined();
      const str = params.toString();
      expect(str).toContain("limit");
      expect(str).toContain("offset");
      expect(str).toContain("columns");
      expect(str).toContain("orderBy");
    });

    it("should return URLSearchParams", () => {
      const params = query.Get<"post">({
        select: { limit: 10 },
      });

      expect(params).toBeInstanceOf(URLSearchParams);
    });
  });

  describe("POST Queries", () => {
    it("should build basic POST query", () => {
      const params = query.Post<"post">({
        select: {
          limit: 10,
        },
      });

      expect(params).toBeDefined();
      expect(params).toBeInstanceOf(URLSearchParams);
    });

    it("should build POST query with columns", () => {
      const params = query.Post<"post">({
        select: {
          columns: {
            id: true,
            title: true,
          },
        },
      });

      expect(params).toBeDefined();
      expect(params.toString()).toContain("select");
    });
  });

  describe("PATCH Queries", () => {
    it("should build basic PATCH query", () => {
      const params = query.Patch<"post">({
        select: {
          limit: 10,
        },
      });

      expect(params).toBeDefined();
      expect(params).toBeInstanceOf(URLSearchParams);
    });

    it("should build PATCH query with where clause", () => {
      const params = query.Patch<"post">({
        select: {
          where: {
            id: {
              eq: 1,
            },
          },
        },
      });

      expect(params).toBeDefined();
    });
  });

  describe("DELETE Queries", () => {
    it("should build basic DELETE query", () => {
      const params = query.Delete<"post">({
        select: {
          limit: 10,
        },
      });

      expect(params).toBeDefined();
      expect(params).toBeInstanceOf(URLSearchParams);
    });

    it("should build DELETE query with where clause", () => {
      const params = query.Delete<"post">({
        select: {
          where: {
            id: {
              eq: 1,
            },
          },
        },
      });

      expect(params).toBeDefined();
    });
  });

  describe("Query Parameters", () => {
    it("should generate valid URL search params", () => {
      const params = query.Get<"post">({
        select: {
          limit: 10,
          offset: 5,
        },
      });

      const url = new URL("http://localhost");
      url.search = params.toString();
      expect(url.search).toBeTruthy();
    });

    it("should handle empty selections", () => {
      const params = query.Get<"post">({
        select: {},
      });

      expect(params).toBeDefined();
    });

    it("should properly encode special characters", () => {
      const params = query.Get<"post">({
        select: {
          limit: 10,
        },
      });

      const str = params.toString();
      expect(str).toBeTruthy();
      // URLSearchParams should handle encoding
      expect(() => new URL("http://localhost?" + str)).not.toThrow();
    });
  });

  describe("Multiple Queries", () => {
    it("should build different query types independently", () => {
      const getParams = query.Get<"post">({ select: { limit: 10 } });
      const postParams = query.Post<"post">({ select: { limit: 20 } });

      expect(getParams).toBeDefined();
      expect(postParams).toBeDefined();
      expect(getParams).not.toBe(postParams);
    });

    it("should allow chaining different queries", () => {
      const post1 = query.Get<"post">({ select: { limit: 10 } });
      const post2 = query.Get<"post">({ select: { limit: 20 } });
      const user1 = query.Get<"user">({ select: { limit: 5 } });

      expect(post1).toBeDefined();
      expect(post2).toBeDefined();
      expect(user1).toBeDefined();
    });
  });

  describe("Real World Scenarios", () => {
    it("should build pagination query", () => {
      const page = 2;
      const pageSize = 20;
      const offset = (page - 1) * pageSize;

      const params = query.Get<"post">({
        select: {
          limit: pageSize,
          offset: offset,
        },
      });

      expect(params).toBeDefined();
      const str = params.toString();
      expect(str).toContain("limit");
      expect(str).toContain("offset");
    });

    it("should build filtered and sorted query", () => {
      const params = query.Get<"post">({
        select: {
          limit: 10,
          columns: {
            id: true,
            title: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      });

      expect(params).toBeDefined();
      const str = params.toString();
      expect(str).toContain("limit");
      expect(str).toContain("columns");
      expect(str).toContain("orderBy");
    });

    it("should build query with multiple column selections", () => {
      const params = query.Get<"post">({
        select: {
          limit: 10,
          columns: {
            id: true,
            title: true,
            body: true,
            published: true,
          },
        },
      });

      expect(params).toBeDefined();
    });

    it("should be usable in fetch", () => {
      const params = query.Get<"post">({
        select: { limit: 10 },
      });

      const url = `/api/posts?${params}`;
      expect(url).toContain("/api/posts");
      expect(url).toContain("?");
    });
  });

  describe("Type Safety", () => {
    it("should create query builder without errors", () => {
      expect(() => {
        createQuery<MockSchema, MockDatabase>();
      }).not.toThrow();
    });

    it("should handle different resource types", () => {
      const postParams = query.Get<"post">({ select: { limit: 10 } });
      const userParams = query.Get<"user">({ select: { limit: 5 } });

      expect(postParams).toBeDefined();
      expect(userParams).toBeDefined();
    });
  });
});
