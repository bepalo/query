import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { DeleteQuery, GetQuery, InferQueryRelations, PatchQuery, PickTables, PostQuery, SelectorDelete, SelectorGet, SelectorPatch, SelectorPost, Table } from "./query.ts";
type InferSelect<T extends Table | unknown> = T extends Table ? InferSelectModel<T> : never;
export type InferSelectModels<Schema extends Record<string, Table | unknown>> = {
    [K in keyof Schema as Schema[K] extends Table ? K : never]: InferSelect<Schema[K]>;
};
type InferInsert<T extends Table | unknown> = T extends Table ? InferInsertModel<T> : never;
export type InferInsertModels<Schema extends Record<string, Table | unknown>> = {
    [K in keyof Schema as Schema[K] extends Table ? K : never]: InferInsert<Schema[K]>;
};
export type InferResponseType<resourceId extends string, Schema extends Record<string, Table | unknown>, tableId extends keyof Schema> = {
    total?: number;
    rowsAffected?: number;
} & (({
    count: number;
} & {
    [R in resourceId]: Schema[tableId][] | null;
}) | {
    [R in resourceId]: Schema[tableId] | null;
});
export type InferResponseTypeFirst<resourceId extends string, Schema extends Record<string, Table | unknown>, tableId extends keyof Schema> = {
    total?: number;
    rowsAffected?: number;
} & {
    [R in resourceId]: Schema[tableId] | null;
};
export type InferResponseTypeMany<resourceId extends string, Schema extends Record<string, Table | unknown>, tableId extends keyof Schema> = {
    total?: number;
    rowsAffected?: number;
} & ({
    count: number;
} & {
    [R in resourceId]: Schema[tableId][] | null;
});
type BepaloQueryWith<T extends Record<string, unknown>, Database extends {
    query: any;
}, Schema extends Record<string, any>, K extends keyof Schema> = Omit<T, "columns" | "with"> & {
    columns?: Partial<Record<keyof InferSelectModel<Schema[K]>, boolean>>;
} & {
    [W in keyof T as W extends "with" ? W : never]: {
        [N in keyof Schema as N extends keyof InferQueryRelations<K, Database> ? N : never]?: BepaloQueryWith<T, Database, Schema, N>;
    };
};
export declare const encodeURIComponentRJSON: (uri: string) => string;
export declare class BepaloQueryBuilder<Schema extends Record<string, Table | unknown>, Database extends {
    query: any;
}, _Tables extends Record<string, Table> = PickTables<Schema>> {
    constructor();
    Get<N extends keyof _Tables>(options?: Omit<GetQuery, "select"> & {
        select?: BepaloQueryWith<SelectorGet, Database, _Tables, N>;
    }): Map<string, string>;
    Post<N extends keyof _Tables>(options?: Omit<PostQuery, "select"> & {
        select?: BepaloQueryWith<SelectorPost, Database, _Tables, N>;
    }): Map<string, string>;
    Patch<N extends keyof _Tables>(options?: Omit<PatchQuery, "select"> & {
        select?: BepaloQueryWith<SelectorPatch, Database, _Tables, N>;
    }): Map<string, string>;
    Delete<N extends keyof _Tables>(options?: Omit<DeleteQuery, "select"> & {
        select?: BepaloQueryWith<SelectorDelete, Database, _Tables, N>;
    }): Map<string, string>;
}
type QueryURL<QueryPath extends string, resourceId extends string> = `${string | ""}${QueryPath}/${resourceId}${"?" | "#" | ""}${string}`;
export declare const createQueryBuilder: <Schema extends Record<string, any>, Database extends {
    query: any;
}, _Tables extends Record<string, Table> = PickTables<Schema>>() => BepaloQueryBuilder<Schema, Database, _Tables>;
export declare class BepaloQueryClient<Schema extends Record<string, Table | unknown>, Database extends {
    query: any;
}, QueryPath extends string = "/query", _Tables extends Record<string, Table> = PickTables<Schema>> {
    queryBuilder: BepaloQueryBuilder<Schema, Database, _Tables>;
    baseUrl: string;
    constructor(baseUrl?: string);
    private _fetch;
    private _appendSearchAndGetURL;
    Get<N extends keyof _Tables, resourceId extends string, ReturnType = InferResponseType<resourceId, _Tables, N>>(url: QueryURL<QueryPath, resourceId>, options?: Parameters<typeof this.queryBuilder.Get<N>>[0], init?: RequestInit): Promise<ReturnType>;
    GetFirst<N extends keyof _Tables, resourceId extends string, ReturnType = InferResponseTypeFirst<resourceId, _Tables, N>>(url: QueryURL<QueryPath, resourceId>, options?: Omit<Parameters<typeof this.queryBuilder.Get<N>>[0], "findFirst">, init?: RequestInit): Promise<ReturnType>;
    GetMany<N extends keyof _Tables, resourceId extends string, ReturnType = InferResponseTypeMany<resourceId, _Tables, N>>(url: QueryURL<QueryPath, resourceId>, options?: Omit<Parameters<typeof this.queryBuilder.Get<N>>[0], "findFirst">, init?: RequestInit): Promise<ReturnType>;
    Post<N extends keyof _Tables, resourceId extends string, ReturnType = InferResponseTypeMany<resourceId, _Tables, N>>(url: QueryURL<QueryPath, resourceId>, options?: Parameters<typeof this.queryBuilder.Post<N>>[0], init?: RequestInit): Promise<ReturnType>;
    Patch<N extends keyof _Tables, resourceId extends string, ReturnType = InferResponseTypeMany<resourceId, _Tables, N>>(url: `${string | ""}${QueryPath}/${resourceId}${`#${string}` | ""}${`?${string}` | ""}`, options?: Parameters<typeof this.queryBuilder.Patch<N>>[0], init?: RequestInit): Promise<ReturnType>;
    Delete<N extends keyof _Tables, resourceId extends string, ReturnType = InferResponseTypeMany<resourceId, _Tables, N>>(url: QueryURL<QueryPath, resourceId>, options?: Parameters<typeof this.queryBuilder.Delete<N>>[0], init?: RequestInit): Promise<ReturnType>;
}
export declare const createQueryClient: <Schema extends Record<string, Table | unknown>, Database extends {
    query: any;
}, QueryPath extends string = "/query">(baseUrl?: string) => BepaloQueryClient<Schema, Database, QueryPath>;
export {};
//# sourceMappingURL=client.d.ts.map