import { ArkErrors } from "arktype";
import { type SQL, type InferSelectModel, type Operators } from "drizzle-orm";
export declare enum Status {
    _100_Continue = 100,
    _101_SwitchingProtocols = 101,
    _102_Processing = 102,
    _103_EarlyHints = 103,
    _200_OK = 200,
    _201_Created = 201,
    _202_Accepted = 202,
    _203_NonAuthoritativeInformation = 203,
    _204_NoContent = 204,
    _205_ResetContent = 205,
    _206_PartialContent = 206,
    _207_MultiStatus = 207,
    _208_AlreadyReported = 208,
    _226_IMUsed = 226,
    _300_MultipleChoices = 300,
    _301_MovedPermanently = 301,
    _302_Found = 302,
    _303_SeeOther = 303,
    _304_NotModified = 304,
    _305_UseProxy = 305,
    _307_TemporaryRedirect = 307,
    _308_PermanentRedirect = 308,
    _400_BadRequest = 400,
    _401_Unauthorized = 401,
    _402_PaymentRequired = 402,
    _403_Forbidden = 403,
    _404_NotFound = 404,
    _405_MethodNotAllowed = 405,
    _406_NotAcceptable = 406,
    _407_ProxyAuthenticationRequired = 407,
    _408_RequestTimeout = 408,
    _409_Conflict = 409,
    _410_Gone = 410,
    _411_LengthRequired = 411,
    _412_PreconditionFailed = 412,
    _413_PayloadTooLarge = 413,
    _414_URITooLong = 414,
    _415_UnsupportedMediaType = 415,
    _416_RangeNotSatisfiable = 416,
    _417_ExpectationFailed = 417,
    _418_IMATeapot = 418,
    _421_MisdirectedRequest = 421,
    _422_UnprocessableEntity = 422,
    _423_Locked = 423,
    _424_FailedDependency = 424,
    _425_TooEarly = 425,
    _426_UpgradeRequired = 426,
    _428_PreconditionRequired = 428,
    _429_TooManyRequests = 429,
    _431_RequestHeaderFieldsTooLarge = 431,
    _451_UnavailableForLegalReasons = 451,
    _500_InternalServerError = 500,
    _501_NotImplemented = 501,
    _502_BadGateway = 502,
    _503_ServiceUnavailable = 503,
    _504_GatewayTimeout = 504,
    _505_HTTPVersionNotSupported = 505,
    _506_VariantAlsoNegotiates = 506,
    _507_InsufficientStorage = 507,
    _508_LoopDetected = 508,
    _510_NotExtended = 510,
    _511_NetworkAuthenticationRequired = 511,
    _419_PageExpired = 419,
    _420_EnhanceYourCalm = 420,
    _450_BlockedbyWindowsParentalControls = 450,
    _498_InvalidToken = 498,
    _499_TokenRequired = 499,
    _509_BandwidthLimitExceeded = 509,
    _526_InvalidSSLCertificate = 526,
    _529_Siteisoverloaded = 529,
    _530_Siteisfrozen = 530,
    _598_NetworkReadTimeoutError = 598,
    _599_NetworkConnectTimeoutError = 599
}
/**
 * Standard HTTP methods supported by the router.
 * These methods correspond to HTTP/1.1 request methods.
 *
 * @typedef {"HEAD"|"OPTIONS"|"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} HttpMethod
 *
 * @example
 * const method: HttpMethod = "GET";
 * const method: HttpMethod = "POST";
 */
type HttpMethod = "HEAD" | "OPTIONS" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
/**
 * Request handler type
 * @callback RequestHandler
 * @template Context
 * @param {Request} req - The incoming request
 * @param {Context} ctx - The request context
 * @returns {Response|void|Promise<Response|void>} A Response, or void to continue to next handler
 */
export interface RequestHandler<Context = any> {
    (req: Request, ctx: Context): Response | void | Promise<Response | void>;
}
/**
 * Creates a Response with the specified status code.
 * Defaults to 'text/plain; charset=utf-8' content-type if not provided in init.headers.
 * @param {number} status - The HTTP status code
 * @param {string|null} [content] - The response body content
 * @param {ResponseInit} [init] - Additional response initialization options
 * @returns {Response} A Response object
 * @example
 * status(200, "Success");
 * status(404, "Not Found");
 * status(204, null); // No content response
 */
export declare const status: (status: number, content?: string | null, init?: ResponseInit) => Response;
export type Table = {
    _: any;
    $inferSelect: any;
    $inferInsert: any;
    getSQL: any;
};
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
    mode?: boolean | number;
    columns?: Set<keyof InferSelectModel<T>>;
};
export type CTXACLCommon<Role> = {
    resourceId: string;
    findFirst?: boolean;
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
    [K in keyof Schema as Schema[K] extends Table ? K : never]: Schema[K] extends Table ? Schema[K] : never;
};
export type InferQueryRelationsWith<QueryParams extends {
    with: any;
}> = QueryParams extends {
    with?: infer With;
} ? With : never;
export type InferQueryRelations<K extends keyof Database["query"], Database extends {
    query: Record<keyof Database["query"], {
        findFirst: (...args: any[]) => any;
    }>;
}> = InferQueryRelationsWith<NonNullable<Parameters<Database["query"][K]["findFirst"]>[0]>>;
export type _ACLWith<Context, Schema extends Record<string, Table>, Database extends {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database>, Query extends InferQuery<Database>, K extends keyof Schema, P extends keyof _ACLWith<Context, Schema, Database, Transaction, Query, K, "forbidQuery" | "maxLimit" | "maxDepth" | "select" | "extras" | "where" | "orderBy" | "with" | "validateBody" | "injectBody" | "beforeQuery" | "afterQuery" | "onQueryError">> = {
    forbidQuery?: {
        columns?: boolean;
        offset?: boolean;
        limit?: boolean;
        where?: boolean;
        orderBy?: boolean;
        with?: boolean;
    };
    maxLimit?: number | null;
    maxDepth?: number | null;
    select?: ColumnSetting<Schema[K]> | boolean;
    extras?: Record<string, SQL.Aliased>;
    where?: {
        (ctx: Context, table: Schema[K], ops: Operators): SQL | undefined;
    };
    orderBy?: Record<string, "asc" | "desc" | 1 | -1>;
    with?: {
        [N in keyof Schema as N extends keyof InferQueryRelations<K, Database> ? N : never]?: ACLWith<Context, Schema, Database, Transaction, Query, N, P>;
    };
    validateBody?: <B extends Record<string, unknown>>(body: B, ctx: Context) => Record<string, unknown> | ArkErrors | Promise<Record<string, unknown> | ArkErrors>;
    injectBody?: <B extends Record<string, unknown>>(body: B, ctx: Context) => Record<string, unknown> | Array<Record<string, unknown>> | Promise<Record<string, unknown> | Array<Record<string, unknown>>>;
    beforeQuery?: (ctx: Context & CTXTX<Transaction>) => void | Promise<void>;
    afterQuery?: (ctx: Context & CTXTX<Transaction>) => void | Promise<void>;
    onQueryError?: (error: HttpError | Error, ctx: Context & CTXTX<Transaction> & {
        dontThrow?: boolean;
    }) => Response | void | Promise<Response | void>;
};
export type ACLWith<Context, Schema extends Record<string, Table>, Database extends {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database>, Query extends InferQuery<Database>, K extends keyof Schema, P extends keyof _ACLWith<Context, Schema, Database, Transaction, Query, K, "forbidQuery" | "maxLimit" | "maxDepth" | "select" | "extras" | "where" | "orderBy" | "with" | "validateBody" | "injectBody" | "beforeQuery" | "afterQuery" | "onQueryError">> = Pick<_ACLWith<Context, Schema, Database, Transaction, Query, K, P>, P> & {
    formatResult?: RequestHandler<Context>;
};
export type ACLEntry<Role extends string, Context, Schema extends Record<string, Table>, Database extends {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database>, Query extends InferQuery<Database>, K extends keyof Schema> = {
    table: K;
    findFirst?: boolean;
    countTotal?: boolean;
    maxLimit?: number | null;
    maxDepth?: number | null;
    formatResult?: RequestHandler<Context>;
    control: {
        HEAD?: Partial<Record<BASIC_ROLES | Role, ACLWith<Context, Schema, Database, Transaction, Query, K, "forbidQuery" | "maxLimit" | "maxDepth" | "select" | "where" | "with" | "beforeQuery" | "afterQuery" | "onQueryError">>>;
        GET?: Partial<Record<BASIC_ROLES | Role, ACLWith<Context, Schema, Database, Transaction, Query, K, "forbidQuery" | "maxLimit" | "maxDepth" | "select" | "where" | "with" | "beforeQuery" | "afterQuery" | "onQueryError">>>;
        POST?: Partial<Record<BASIC_ROLES | Role, ACLWith<Context, Schema, Database, Transaction, Query, K, "forbidQuery" | "select" | "where" | "validateBody" | "injectBody" | "beforeQuery" | "afterQuery" | "onQueryError">>>;
        PATCH?: Partial<Record<BASIC_ROLES | Role, ACLWith<Context, Schema, Database, Transaction, Query, K, "forbidQuery" | "select" | "where" | "validateBody" | "injectBody" | "beforeQuery" | "afterQuery" | "onQueryError">>>;
        DELETE?: Partial<Record<BASIC_ROLES | Role, ACLWith<Context, Schema, Database, Transaction, Query, K, "forbidQuery" | "select" | "where" | "beforeQuery" | "afterQuery" | "onQueryError">>>;
    };
};
export type _ACL<Role extends string, CTXSession extends object, XContext, Schema extends Record<string, Table>, Database extends {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database> = InferTransaction<Database>, Query extends InferQuery<Database> = InferQuery<Database>> = {
    [K in keyof Schema as Schema[K] extends Table ? string : never]?: ACLEntry<Role, CTXSession & XContext & CTXACLCommon<Role> & CTXACLResult<Schema, K>, Schema, Database, Transaction, Query, K>;
};
export type ACL<Role extends string, CTXSession extends object, XContext, Schema extends Record<string, Table | unknown>, Database extends {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database> = InferTransaction<Database>, Query extends InferQuery<Database> = InferQuery<Database>> = _ACL<Role, CTXSession, XContext, PickTables<Schema>, Database, Transaction, Query>;
export type Routes = {
    [M in HttpMethod]?: (req: Request & {
        params: Record<string, string>;
    }) => Promise<Response>;
};
export declare const TSelectorGet: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    offset?: number | undefined;
    limit?: number | undefined;
    columns?: boolean | Record<string, boolean> | undefined;
    where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    orderBy?: Record<string, "asc" | "desc" | 1 | -1> | undefined;
    with?: {
        [x: string]: boolean | /*elided*/ any;
    } | undefined;
}, {
    GetSelector: {
        offset?: number | undefined;
        limit?: number | undefined;
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
        orderBy?: Record<string, "asc" | "desc" | 1 | -1> | undefined;
        with?: {
            [x: string]: boolean | /*elided*/ any;
        } | undefined;
    };
    PostSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
    };
    PatchSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    };
    DeleteSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    };
}>;
export type SelectorGet = typeof TSelectorGet.infer;
export declare const TSelectorPost: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    columns?: boolean | Record<string, boolean> | undefined;
}, {
    GetSelector: {
        offset?: number | undefined;
        limit?: number | undefined;
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
        orderBy?: Record<string, "asc" | "desc" | 1 | -1> | undefined;
        with?: {
            [x: string]: boolean | /*elided*/ any;
        } | undefined;
    };
    PostSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
    };
    PatchSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    };
    DeleteSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    };
}>;
export type SelectorPost = typeof TSelectorPost.infer;
export declare const TSelectorPatch: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    columns?: boolean | Record<string, boolean> | undefined;
    where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
}, {
    GetSelector: {
        offset?: number | undefined;
        limit?: number | undefined;
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
        orderBy?: Record<string, "asc" | "desc" | 1 | -1> | undefined;
        with?: {
            [x: string]: boolean | /*elided*/ any;
        } | undefined;
    };
    PostSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
    };
    PatchSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    };
    DeleteSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    };
}>;
export type SelectorPatch = typeof TSelectorPatch.infer;
export declare const TSelectorDelete: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    columns?: boolean | Record<string, boolean> | undefined;
    where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
}, {
    GetSelector: {
        offset?: number | undefined;
        limit?: number | undefined;
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
        orderBy?: Record<string, "asc" | "desc" | 1 | -1> | undefined;
        with?: {
            [x: string]: boolean | /*elided*/ any;
        } | undefined;
    };
    PostSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
    };
    PatchSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    };
    DeleteSelector: {
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    };
}>;
export type SelectorDelete = typeof TSelectorDelete.infer;
declare const TOptionsQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
}, {}>;
export type OptionsQuery = typeof TOptionsQuery.infer;
declare const TGetQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    findFirst?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    countTotal?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    select?: ((In: string) => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<{
        offset?: number | undefined;
        limit?: number | undefined;
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
        orderBy?: Record<string, "asc" | "desc" | 1 | -1> | undefined;
        with?: {
            [x: string]: boolean | /*elided*/ any;
        } | undefined;
    }>) | undefined;
}, {}>;
export type GetQuery = typeof TGetQuery.infer;
declare const TPostQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    countTotal?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    select?: ((In: string) => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<{
        columns?: boolean | Record<string, boolean> | undefined;
    }>) | undefined;
}, {}>;
export type PostQuery = typeof TPostQuery.infer;
export declare const TPostBody: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<Record<string, unknown> | Record<string, unknown>[], {}>;
export type PostBody = typeof TPostBody.infer;
export type CTXPostBody = {
    body: PostBody;
};
declare const TPatchQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    countTotal?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    select?: ((In: string) => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<{
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    }>) | undefined;
}, {}>;
export type PatchQuery = typeof TPatchQuery.infer;
export declare const TPatchBody: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<Record<string, unknown>, {}>;
export type PatchBody = typeof TPatchBody.infer;
export type CTXPatchBody = {
    body: PatchBody;
};
declare const TDeleteQuery: import("arktype/internal/variants/object.ts", { with: { "resolution-mode": "import" } }).ObjectType<{
    guest?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    mine?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    "mine|guest"?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    countTotal?: ((In: "" | "T" | "F") => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<false> | import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<true>) | undefined;
    select?: ((In: string) => import("arktype/internal/attributes.ts", { with: { "resolution-mode": "import" } }).To<{
        columns?: boolean | Record<string, boolean> | undefined;
        where?: Record<string, unknown> | Record<string, unknown>[] | undefined;
    }>) | undefined;
}, {}>;
export type DeleteQuery = typeof TDeleteQuery.infer;
export declare enum SurpassMaxLimit {
    Limit = 0,
    Throw = 1
}
/**
 * Context object containing parsed request body.
 * @type {Object} CTXBody
 * @property {ParsedBody} body - Parsed request body data
 */
export type CTXBody = {
    body: any;
};
/**
 * Supported media types for request body parsing.
 * @type {"application/x-www-form-urlencoded"|"application/json"|"text/plain"} SupportedBodyMediaTypes
 */
export type SupportedBodyMediaTypes = "application/x-www-form-urlencoded" | "application/json" | "application/rjson";
/**
 * Creates middleware that parses the request body based on Content-Type.
 * Supports url-encoded forms, JSON, and plain text.
 * @param {Object} [options] - Configuration options for body parsing
 * @param {SupportedBodyMediaTypes|SupportedBodyMediaTypes[]} [options.accept] - Media types to accept (defaults to all supported)
 * @param {number} [options.maxSize] - Maximum body size in bytes (defaults to 1MB)
 * @param {number} [options.once] - Do not parse if parsed already. checks `ctx.body`
 * @param {number} [options.clone] - Clone request before parsing it. Useful for forwarding.
 * @returns {Function} A middleware function that adds parsed body to context.body
 * @throws {Response} Returns a 415 response if content-type is not accepted
 * @throws {Response} Returns a 413 response if body exceeds maxSize
 * @throws {Response} Returns a 400 response if body is malformed
 */
export declare const parseBody: <XContext = Record<string, never>>(options?: {
    accept?: SupportedBodyMediaTypes | SupportedBodyMediaTypes[];
    maxSize?: number;
    once?: boolean;
    clone?: boolean;
}) => RequestHandler<XContext & CTXBody>;
export declare const createQueryRoute: <Role extends string, CTXSession extends object, XContext = Record<string, never>, _Schema extends Record<string, Table | unknown> = Record<string, Table | unknown>, Database extends {
    transaction: any;
    query: any;
} = {
    transaction: any;
    query: any;
}, Transaction extends InferTransaction<Database> = InferTransaction<Database>, Query extends InferQuery<Database> = InferQuery<Database>, Schema extends PickTables<_Schema> = PickTables<_Schema>>({ acl, schema, database, idParam, onSurpassMaxLimit, session, defaults, onError, }: {
    acl?: ACL<Role, CTXSession, XContext, Schema, Database, Transaction, Query>;
    schema: _Schema;
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
    };
    onError?: {
        (error: HttpError | Error): void;
    };
}) => Routes;
export {};
//# sourceMappingURL=query.d.ts.map