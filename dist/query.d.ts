import { type HttpMethod, type RequestHandler } from "@bepalo/router";
import { ArkErrors, Type } from "arktype";
import { SQL, type InferSelectModel, type Operators, type Table } from "drizzle-orm";
export declare class HttpError extends Error {
    status: number;
    constructor(message: string, status: number);
}
export declare const operators: Operators;
export type BASIC_ROLES = "guest" | "mine" | "all";
export type InferTransaction<Database extends {
    transaction: any;
}> = Database extends {
    transaction: infer TransactionFn extends {
        (...args: any[]): any;
    };
} ? Parameters<Parameters<TransactionFn>[0]>[0] : never;
export type InferQuery<Database extends {
    query: any;
}> = Database extends {
    query: infer TQuery;
} ? TQuery : never;
export type ColumnSetting<T extends Table> = {
    mode: boolean | number;
    columns: Set<keyof InferSelectModel<T>>;
};
export type CTXACLCommon<Role> = {
    userRole?: Role;
};
export type CTXTX<Transaction> = {
    tx: Transaction;
};
export type CTXACLResult<Schema extends Record<string, Table | unknown>, K extends keyof Schema> = {
    result?: {
        rows?: (Schema[K] extends Table ? Partial<InferSelectModel<Schema[K]>>[] | (Partial<InferSelectModel<Schema[K]>> & Record<string, Partial<InferSelectModel<Table>>>)[] : unknown[]) | null;
        count?: number;
        total?: number;
        rowsAffected?: number;
    };
};
export type PickTables<Schema extends Record<string, Table | unknown>> = {
    [K in keyof Schema as Schema[K] extends Table ? K : never]: Schema[K];
};
export type InferQueryRelationsWith<QueryParams extends {
    with: any;
}> = QueryParams extends {
    with?: infer With;
} ? With : never;
export type InferQueryRelations<K extends keyof Database["query"], Database extends {
    query: Record<keyof Database["query"], {
        findMany: (...args: any[]) => any;
    }>;
}> = InferQueryRelationsWith<NonNullable<Parameters<Database["query"][K]["findMany"]>[0]>>;
export type ACLWith<Context, Schema extends Record<string, Table>, Database extends {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database>, Query extends InferQuery<Database>, K extends keyof Schema> = {
    forbidQuery?: {
        columns?: boolean;
        offset?: boolean;
        limit?: boolean;
        where?: boolean;
        orderBy?: boolean;
        with?: boolean;
    };
    select?: ColumnSetting<Schema[K]> | boolean;
    extras?: Record<string, SQL.Aliased>;
    where?: {
        (ctx: Context, table: Schema[K], ops: Operators): SQL | undefined;
    };
    orderBy?: Record<string, "asc" | "desc" | 1 | -1>;
    with?: {
        [N in keyof Schema as N extends keyof InferQueryRelations<K, Database> ? N : never]?: Omit<ACLWith<Context, Schema, Database, Transaction, Query, N>, "forbidQuery">;
    };
    validateBody?: <B extends Record<string, unknown>>(body: B, ctx: Context) => Record<string, unknown> | ArkErrors | Promise<Record<string, unknown> | ArkErrors>;
    injectBody?: <B extends Partial<Record<keyof InferSelectModel<Schema[K]> | string, InferSelectModel<Schema[K]> | unknown>>>(body: B, ctx: Context) => Record<string, unknown> | Array<Record<string, unknown>> | Promise<Record<string, unknown> | Array<Record<string, unknown>>>;
    beforeQuery?: (ctx: Context & CTXTX<Transaction>) => void | Promise<void>;
    afterQuery?: (ctx: Context & CTXTX<Transaction>) => void | Promise<void>;
    onQueryError?: (error: HttpError | Error, ctx: Context & CTXTX<Transaction> & {
        dontThrow?: boolean;
    }) => Response | void | Promise<Response | void>;
};
export type ACLEntry<Role extends string, Context, Schema extends Record<string, Table>, Database extends {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database>, Query extends InferQuery<Database>, K extends keyof Schema> = {
    table: K;
    dontPluralize?: boolean;
    findFirst?: boolean;
    includeTotal?: boolean;
    maxLimit?: number | null;
    maxDepth?: number | null;
    formatResult?: RequestHandler<Context>;
    control: {
        HEAD?: Partial<Record<BASIC_ROLES | Role, Omit<ACLWith<Context, Schema, Database, Transaction, Query, K>, "table" | "validateBody" | "injectBody">>>;
        GET?: Partial<Record<BASIC_ROLES | Role, Omit<ACLWith<Context, Schema, Database, Transaction, Query, K>, "table" | "validateBody" | "injectBody">>>;
        POST?: Partial<Record<BASIC_ROLES | Role, Omit<ACLWith<Context, Schema, Database, Transaction, Query, K>, "table">>>;
        PATCH?: Partial<Record<BASIC_ROLES | Role, Omit<ACLWith<Context, Schema, Database, Transaction, Query, K>, "table">>>;
        DELETE?: Partial<Record<BASIC_ROLES | Role, Omit<ACLWith<Context, Schema, Database, Transaction, Query, K>, "table" | "validateBody" | "injectBody">>>;
    };
};
export type ACL<Role extends string, CTXSession extends object, XContext, Schema extends Record<string, Table | any>, Database extends {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database> = InferTransaction<Database>, Query extends InferQuery<Database> = InferQuery<Database>> = {
    [K in keyof PickTables<Schema> as PickTables<Schema>[K] extends Table ? string : never]?: ACLEntry<Role, CTXSession & XContext & CTXACLCommon<Role> & CTXACLResult<Schema, K>, PickTables<Schema>, Database, Transaction, Query, K>;
};
export type SimpleRequestHandler<Context> = {
    (req: Request & {
        params: Record<string, string>;
    }, ctx?: Context): Promise<Response>;
};
export type Routes<Context, SpecificContext extends Partial<Record<HttpMethod, Record<string, any>>> = Record<HttpMethod, never>> = {
    [M in HttpMethod]?: SimpleRequestHandler<Context & SpecificContext[M]>;
};
export declare const TSelectorGet: Type<any, any>;
export type SelectorGet = typeof TSelectorGet.infer;
export declare const TSelectorPost: Type<any, any>;
export type SelectorPost = typeof TSelectorPost.infer;
export declare const TSelectorPatch: Type<any, any>;
export type SelectorPatch = typeof TSelectorPatch.infer;
export declare const TSelectorDelete: Type<any, any>;
export type SelectorDelete = typeof TSelectorDelete.infer;
declare const TOptionsQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
}, {}>;
export type OptionsQuery = typeof TOptionsQuery.infer;
type CTXOptionsQuery = {
    query: OptionsQuery;
};
declare const TGetQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    findFirst?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    includeTotal?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    select?: any;
}, {}>;
export type GetQuery = typeof TGetQuery.infer;
type CTXGetQuery = {
    query: GetQuery;
};
declare const TPostQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    includeTotal?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    select?: any;
}, {}>;
export type PostQuery = typeof TPostQuery.infer;
type CTXPostQuery = {
    query: PostQuery;
};
export declare const TPostBody: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<Record<string, unknown> | Record<string, unknown>[], {}>;
export type PostBody = typeof TPostBody.infer;
export type CTXPostBody = {
    body: PostBody;
};
declare const TPatchQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    includeTotal?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    select?: any;
}, {}>;
export type PatchQuery = typeof TPatchQuery.infer;
type CTXPatchQuery = {
    query: PatchQuery;
};
export declare const TPatchBody: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<Record<string, unknown>, {}>;
export type PatchBody = typeof TPatchBody.infer;
export type CTXPatchBody = {
    body: PatchBody;
};
declare const TDeleteQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    includeTotal?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    select?: any;
}, {}>;
export type DeleteQuery = typeof TDeleteQuery.infer;
type CTXDeleteQuery = {
    query: DeleteQuery;
};
export declare enum SurpassMaxLimit {
    Limit = 0,
    Throw = 1
}
export declare const createQueryRouter: <Role extends string, CTXSession extends object, XContext, _Schema extends Record<string, Table | unknown>, Database extends {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database> = InferTransaction<Database>, Query extends InferQuery<Database> = InferQuery<Database>, Schema extends PickTables<_Schema> = PickTables<_Schema>>({ acl, schema, database, idParam, onSurpassMaxLimit, session, defaults, onError, }: {
    acl?: ACL<Role, CTXSession, XContext, Schema, Database, Transaction, Query>;
    schema: Schema;
    database: Database;
    idParam: string;
    onSurpassMaxLimit?: SurpassMaxLimit;
    session?: {
        parser: RequestHandler<CTXSession & XContext>;
        getRole: (req: Request, ctx: CTXSession & XContext & CTXACLCommon<Role>) => Role;
    };
    defaults?: {
        maxDepth?: number;
        maxLimit?: number;
        dontPluralize?: boolean;
    };
    onError?: {
        (error: HttpError | Error): void;
    };
}) => Routes<CTXSession & XContext & CTXACLCommon<Role> & {
    url: URL;
    resourceId: string;
}, {
    OPTIONS: CTXOptionsQuery;
    HEAD: CTXGetQuery & CTXACLResult<Schema, keyof Schema> & {
        dontPluralize?: boolean;
        findFirst?: boolean;
    };
    GET: CTXGetQuery & CTXACLResult<Schema, keyof Schema> & {
        dontPluralize?: boolean;
        findFirst?: boolean;
    };
    POST: CTXPostQuery & CTXPostBody & CTXACLResult<Schema, keyof Schema> & {
        dontPluralize?: boolean;
    };
    PATCH: CTXPatchQuery & CTXPatchBody & CTXACLResult<Schema, keyof Schema> & {
        dontPluralize?: boolean;
    };
    DELETE: CTXDeleteQuery & CTXACLResult<Schema, keyof Schema> & {
        dontPluralize?: boolean;
    };
}>;
export {};
//# sourceMappingURL=query.d.ts.map