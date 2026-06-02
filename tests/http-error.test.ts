import { describe, it, expect } from "vitest";
import { HttpError } from "../src/query.ts";

describe("HttpError", () => {
  it("should set message and status", () => {
    const err = new HttpError("Bad request", 400);
    expect(err.message).toBe("Bad request");
    expect(err.status).toBe(400);
  });

  it("should default status to 500 when given 0 (falsy)", () => {
    const err = new HttpError("oops", 0);
    expect(err.status).toBe(500);
  });

  it("should be an instance of Error", () => {
    const err = new HttpError("fail", 404);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(HttpError);
  });

  it("should have a stack trace", () => {
    const err = new HttpError("fail", 500);
    expect(err.stack).toBeDefined();
  });

  it("should be throwable and catchable by type", () => {
    expect(() => {
      throw new HttpError("forbidden", 403);
    }).toThrowError("forbidden");

    try {
      throw new HttpError("not found", 404);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpError);
      expect((e as HttpError).status).toBe(404);
    }
  });

  it("should preserve status for common HTTP codes", () => {
    const cases = [
      [400, "Bad Request"],
      [401, "Unauthorized"],
      [403, "Forbidden"],
      [404, "Not Found"],
      [500, "Internal Server Error"],
    ] as const;

    for (const [code, msg] of cases) {
      const err = new HttpError(msg, code);
      expect(err.status).toBe(code);
      expect(err.message).toBe(msg);
    }
  });
});
