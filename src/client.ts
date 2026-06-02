import { RJSON } from "@bepalo/rjson";
import type { InferSelectModel } from "drizzle-orm";
import type {
  DeleteQuery,
  GetQuery,
  InferQueryRelations,
  PatchQuery,
  PostQuery,
  SelectorDelete,
  SelectorGet,
  SelectorPatch,
  SelectorPost,
} from "./query.ts";

type BepaloQueryWith<
  T extends Record<string, unknown>,
  Database extends { query: any },
  Schema extends Record<string, any>,
  K extends keyof Schema,
> = Omit<T, "columns" | "with"> & {
  columns?: Partial<Record<keyof InferSelectModel<Schema[K]>, boolean>>;
} & {
  [W in keyof T as W extends "with" ? W : never]: {
    [N in keyof Schema as N extends keyof InferQueryRelations<K, Database>
      ? N
      : never]?: BepaloQueryWith<T, Database, Schema, N>;
  };
};

export class BepaloQuery<
  Schema extends Record<string, any>,
  Database extends { query: any },
> {
  constructor() {}

  Get<N extends keyof Schema>(
    options: Omit<GetQuery, "select"> & {
      select?: BepaloQueryWith<SelectorGet, Database, Schema, N>;
    },
  ) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(options)) {
      params.set(k, RJSON.stringify(v));
    }
    return params;
  }

  Post<N extends keyof Schema>(
    options: Omit<PostQuery, "select"> & {
      select?: BepaloQueryWith<SelectorPost, Database, Schema, N>;
    },
  ) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(options)) {
      params.set(k, RJSON.stringify(v));
    }
    return params;
  }

  Patch<N extends keyof Schema>(
    options: Omit<PatchQuery, "select"> & {
      select?: BepaloQueryWith<SelectorPatch, Database, Schema, N>;
    },
  ) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(options)) {
      params.set(k, RJSON.stringify(v));
    }
    return params;
  }

  Delete<N extends keyof Schema>(
    options: Omit<DeleteQuery, "select"> & {
      select?: BepaloQueryWith<SelectorDelete, Database, Schema, N>;
    },
  ) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(options)) {
      params.set(k, RJSON.stringify(v));
    }
    return params;
  }
}

export const createQuery = <
  Schema extends Record<string, any>,
  Database extends { query: any },
>(): BepaloQuery<Schema, Database> => new BepaloQuery();
