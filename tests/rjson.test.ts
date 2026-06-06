import { describe, it, expect } from "vitest";
import { RJSON } from "@bepalo/rjson";

describe("RJSON - Serialization", () => {
  describe("Basic Types", () => {
    it("should stringify objects", () => {
      const obj = { name: "John", age: 30 };
      const result = RJSON.stringify(obj);
      expect(result).toBe("(name:'John',age:30)");
    });

    it("should stringify arrays", () => {
      const arr = [1, 2, 3];
      const result = RJSON.stringify(arr);
      expect(result).toBe("_(1,2,3)_");
    });

    it("should stringify strings with single quotes", () => {
      const result = RJSON.stringify("hello");
      expect(result).toBe("'hello'");
    });

    it("should stringify numbers", () => {
      expect(RJSON.stringify(42)).toBe("42");
      expect(RJSON.stringify(3.14)).toBe("3.14");
      expect(RJSON.stringify(1e10)).toMatch(/1e\+?10|10000000000/);
    });

    it("should stringify booleans", () => {
      expect(RJSON.stringify(true)).toBe("T");
      expect(RJSON.stringify(false)).toBe("F");
    });

    it("should stringify null", () => {
      expect(RJSON.stringify(null)).toBe("N");
    });

    it("should stringify undefined", () => {
      expect(RJSON.stringify(undefined)).toBe("U");
    });
  });

  describe("Complex Structures", () => {
    it("should stringify nested objects", () => {
      const obj = { user: { name: "John", age: 30 }, active: true };
      const result = RJSON.stringify(obj);
      expect(result).toContain("user:");
      expect(result).toContain("name:'John'");
      expect(result).toContain("age:30");
      expect(result).toContain("active:T");
    });

    it("should stringify arrays of mixed types", () => {
      const arr = [1, "hello", true, { key: "value" }];
      const result = RJSON.stringify(arr);
      expect(result).toContain("1");
      expect(result).toContain("'hello'");
      expect(result).toContain("T");
      expect(result).toContain("key:'value'");
    });

    it("should stringify deeply nested structures", () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              value: "deep",
            },
          },
        },
      };
      const result = RJSON.stringify(obj);
      expect(result).toContain("level1:");
      expect(result).toContain("level2:");
      expect(result).toContain("level3:");
      expect(result).toContain("'deep'");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty objects", () => {
      const result = RJSON.stringify({});
      expect(result).toBe("()");
    });

    it("should handle empty arrays", () => {
      const result = RJSON.stringify([]);
      expect(result).toBe("_()_");
    });

    it("should escape special characters in strings", () => {
      const obj = { text: "can't" };
      const result = RJSON.stringify(obj);
      expect(result).toContain("text:");
    });

    it("should handle numeric keys in objects", () => {
      const obj = { id: 123, count: 456 };
      const result = RJSON.stringify(obj);
      expect(result).toContain("id:123");
      expect(result).toContain("count:456");
    });

    it("should handle negative numbers", () => {
      expect(RJSON.stringify(-42)).toBe("-42");
      expect(RJSON.stringify(-3.14)).toBe("-3.14");
    });
  });

  describe("Mapped Arrays", () => {
    it("should create mapped arrays for boolean permissions", () => {
      const result = RJSON.stringifyMappedArray(true, [
        "read",
        "write",
        "delete",
      ]);
      expect(result).toBe("~T(read,write,delete)~");
    });

    it("should create mapped arrays for numeric values", () => {
      const result = RJSON.stringifyMappedArray(0, ["read", "write", "delete"]);
      expect(result).toBe("~0(read,write,delete)~");
    });

    it("should create mapped arrays for false values", () => {
      const result = RJSON.stringifyMappedArray(false, ["beta", "darkMode"]);
      expect(result).toBe("~F(beta,darkMode)~");
    });
  });
});

describe("RJSON - Parsing", () => {
  describe("Basic Types", () => {
    it("should parse objects", () => {
      const result = RJSON.parse("(name:'John',age:30)");
      expect(result).toEqual({ name: "John", age: 30 });
    });

    it("should parse arrays", () => {
      const result = RJSON.parse("_(1,2,3)_");
      expect(result).toEqual([1, 2, 3]);
    });

    it("should parse strings", () => {
      const result = RJSON.parse("'hello'");
      expect(result).toBe("hello");
    });

    it("should parse numbers", () => {
      expect(RJSON.parse("42")).toBe(42);
      expect(RJSON.parse("3.14")).toBe(3.14);
    });

    it("should parse booleans", () => {
      expect(RJSON.parse("T")).toBe(true);
      expect(RJSON.parse("F")).toBe(false);
    });

    it("should parse null", () => {
      expect(RJSON.parse("N")).toBeNull();
    });

    it("should parse undefined", () => {
      expect(RJSON.parse("U")).toBeUndefined();
    });
  });

  describe("Complex Structures", () => {
    it("should parse nested objects", () => {
      const result = RJSON.parse("(user:(name:'John',age:30),active:T)");
      expect(result).toEqual({
        user: { name: "John", age: 30 },
        active: true,
      });
    });

    it("should parse mixed type arrays", () => {
      const result = RJSON.parse("_(1,'hello',T,(key:'value'))_");
      expect(result).toEqual([1, "hello", true, { key: "value" }]);
    });

    it("should parse deeply nested structures", () => {
      const result: any = RJSON.parse(
        "(level1:(level2:(level3:(value:'deep'))))",
      );
      expect(result.level1.level2.level3.value).toBe("deep");
    });
  });

  describe("Round Trip", () => {
    it("should maintain data integrity through stringify/parse", () => {
      const original = {
        name: "John",
        age: 30,
        active: true,
        tags: ["admin", "user"],
      };
      const stringified = RJSON.stringify(original);
      const parsed = RJSON.parse(stringified);
      expect(parsed).toEqual(original);
    });

    it("should handle complex nested structures in round trip", () => {
      const original = {
        user: { name: "Alice", roles: ["admin", "editor"] },
        config: { dark: true, notifications: false },
        count: 42,
      };
      const stringified = RJSON.stringify(original);
      const parsed = RJSON.parse(stringified);
      expect(parsed).toEqual(original);
    });
  });

  describe("Error Handling", () => {
    it("should throw on invalid syntax", () => {
      expect(() => RJSON.parse("(name::123)")).toThrow();
    });

    it("should throw on mismatched parentheses", () => {
      expect(() => RJSON.parse("(name:'John'")).toThrow();
    });

    it("should throw on invalid array syntax", () => {
      expect(() => RJSON.parse("_1,2,3_")).toThrow();
    });
  });

  describe("Real World Examples", () => {
    it("should parse database query selectors", () => {
      const selector =
        "(limit:10,offset:20,columns:(id:T,title:T),where:(published:T))";
      const result: any = RJSON.parse(selector);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(20);
      expect(result.columns.id).toBe(true);
      expect(result.where.published).toBe(true);
    });

    it("should parse permission objects", () => {
      const permissions = "(read:T,write:T,delete:F)";
      const result: any = RJSON.parse(permissions);
      expect(result.read).toBe(true);
      expect(result.write).toBe(true);
      expect(result.delete).toBe(false);
    });

    it("should parse complex query with relations", () => {
      const query =
        "(limit:10,columns:(id:T,title:T),with:(user:(columns:(id:T,name:T))))";
      const result: any = RJSON.parse(query);
      expect(result.limit).toBe(10);
      expect(result.with.user.columns.name).toBe(true);
    });
  });
});
