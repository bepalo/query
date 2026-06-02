import {
  json,
  parseBody,
  status,
  Status,
  type CTXBody,
  type HttpMethod,
  type RequestHandler,
} from "@bepalo/router";
import { ArkErrors, Type, type } from "arktype";
import { RJSON } from "@bepalo/rjson";
import {
  getOperators,
  SQL,
  type InferSelectModel,
  type Operators,
  type Table,
} from "drizzle-orm";

export class HttpError extends Error {
  status: number = 500;
  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
  }
}

export const operators: Operators = getOperators();

export type BASIC_ROLES = "guest" | "mine" | "all";

export type InferTransaction<
  Database extends {
    transaction: any;
  },
> = Database extends {
  transaction: infer TransactionFn extends { (...args: any[]): any };
}
  ? Parameters<Parameters<TransactionFn>[0]>[0]
  : never;
export type InferQuery<Database extends { query: any }> = Database extends {
  query: infer TQuery;
}
  ? TQuery
  : never;

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

export type CTXACLResult<
  Schema extends Record<string, Table | unknown>,
  K extends keyof Schema,
> = {
  result?: {
    rows?:
      | (Schema[K] extends Table
          ?
              | Partial<InferSelectModel<Schema[K]>>[]
              | (Partial<InferSelectModel<Schema[K]>> &
                  Record<string, Partial<InferSelectModel<Table>>>)[]
          : unknown[])
      | null;
    count?: number;
    total?: number;
    rowsAffected?: number;
  };
};

export type PickTables<Schema extends Record<string, Table | unknown>> = {
  [K in keyof Schema as Schema[K] extends Table ? K : never]: Schema[K];
};

export type InferQueryRelationsWith<QueryParams extends { with: any }> =
  QueryParams extends { with?: infer With } ? With : never;

export type InferQueryRelations<
  K extends keyof Database["query"],
  Database extends {
    query: Record<
      keyof Database["query"],
      { findMany: (...args: any[]) => any }
    >;
  },
> = InferQueryRelationsWith<
  NonNullable<Parameters<Database["query"][K]["findMany"]>[0]>
>;

export type ACLWith<
  Context,
  Schema extends Record<string, Table>,
  Database extends { transaction: any; query: any },
  Transaction extends InferTransaction<Database>,
  Query extends InferQuery<Database>,
  K extends keyof Schema,
> = {
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
    [N in keyof Schema as N extends keyof InferQueryRelations<K, Database>
      ? N
      : never]?: Omit<
      ACLWith<Context, Schema, Database, Transaction, Query, N>,
      "forbidQuery"
    >;
  };

  // used to do custom validation and parsing on body
  validateBody?: <B extends Record<string, unknown>>(
    body: B,
    ctx: Context,
  ) =>
    | Record<string, unknown>
    | ArkErrors
    | Promise<Record<string, unknown> | ArkErrors>;

  // used to do transform/edit on body
  injectBody?: <
    B extends Partial<
      Record<
        keyof InferSelectModel<Schema[K]> | string,
        InferSelectModel<Schema[K]> | unknown
      >
    >,
  >(
    body: B,
    ctx: Context,
  ) =>
    | Record<string, unknown>
    | Array<Record<string, unknown>>
    | Promise<Record<string, unknown> | Array<Record<string, unknown>>>;

  // called before querying or inserting or updating in the database
  beforeQuery?: (ctx: Context & CTXTX<Transaction>) => void | Promise<void>;

  // called after querying or inserting or updating in the database
  afterQuery?: (ctx: Context & CTXTX<Transaction>) => void | Promise<void>;

  // called after an error occured while trying to execute query in the database
  onQueryError?: (
    error: HttpError | Error,
    ctx: Context &
      CTXTX<Transaction> & {
        dontThrow?: boolean;
      },
  ) => Response | void | Promise<Response | void>;
};

export type ACLEntry<
  Role extends string,
  Context,
  Schema extends Record<string, Table>,
  Database extends { transaction: any; query: any },
  Transaction extends InferTransaction<Database>,
  Query extends InferQuery<Database>,
  K extends keyof Schema,
> = {
  table: K;
  findFirst?: boolean;
  includeTotal?: boolean;
  maxLimit?: number | null;
  maxDepth?: number | null;
  formatResult?: RequestHandler<Context>;
  control: {
    HEAD?: Partial<
      Record<
        BASIC_ROLES | Role,
        Omit<
          ACLWith<Context, Schema, Database, Transaction, Query, K>,
          "table" | "validateBody" | "injectBody"
        >
      >
    >;
    GET?: Partial<
      Record<
        BASIC_ROLES | Role,
        Omit<
          ACLWith<Context, Schema, Database, Transaction, Query, K>,
          "table" | "validateBody" | "injectBody"
        >
      >
    >;
    POST?: Partial<
      Record<
        BASIC_ROLES | Role,
        Omit<ACLWith<Context, Schema, Database, Transaction, Query, K>, "table">
      >
    >;
    PATCH?: Partial<
      Record<
        BASIC_ROLES | Role,
        Omit<ACLWith<Context, Schema, Database, Transaction, Query, K>, "table">
      >
    >;
    DELETE?: Partial<
      Record<
        BASIC_ROLES | Role,
        Omit<
          ACLWith<Context, Schema, Database, Transaction, Query, K>,
          "table" | "validateBody" | "injectBody"
        >
      >
    >;
  };
};

export type ACL<
  Role extends string,
  CTXSession extends object,
  XContext,
  Schema extends Record<string, Table | any>,
  Database extends { transaction: any; query: any },
  Transaction extends InferTransaction<Database> = InferTransaction<Database>,
  Query extends InferQuery<Database> = InferQuery<Database>,
> = {
  [K in keyof PickTables<Schema> as PickTables<Schema>[K] extends Table
    ? string
    : never]?: ACLEntry<
    Role,
    CTXSession & XContext & CTXACLCommon<Role> & CTXACLResult<Schema, K>,
    PickTables<Schema>,
    Database,
    Transaction,
    Query,
    K
  >;
};

export type SimpleRequestHandler<Context> = {
  (
    req: Request & { params: Record<string, string> },
    ctx?: Context,
  ): Promise<Response>;
};

export type Routes<
  Context,
  SpecificContext extends Partial<Record<HttpMethod, Record<string, any>>> =
    Record<HttpMethod, never>,
> = {
  [M in HttpMethod]?: SimpleRequestHandler<Context & SpecificContext[M]>;
};

const RJSOnScope = type.scope({
  Selector: {
    "offset?": "number",
    "limit?": "number",
    "columns?": "Record<string,boolean> | boolean",
    "where?": "Record<string, unknown> | Record<string, unknown>[]",
    "orderBy?": "Record<string, 'asc' | 'desc' | 1 | -1>",
    "with?": {
      "[string]": "Selector|boolean",
    },
    "+": "reject",
  },
});

export const TSelectorGet: Type<any, any> = RJSOnScope.type("Selector");

export type SelectorGet = typeof TSelectorGet.infer;

export const TSelectorPost: Type<any, any> = RJSOnScope.type(
  "Omit<Selector,'offset'|'limit'|'orderBy'|'where'|'with'>",
);

export type SelectorPost = typeof TSelectorPost.infer;

export const TSelectorPatch: Type<any, any> = RJSOnScope.type(
  "Omit<Selector,'offset'|'limit'|'orderBy'|'with'>",
);

export type SelectorPatch = typeof TSelectorPatch.infer;

export const TSelectorDelete: Type<any, any> = RJSOnScope.type(
  "Omit<Selector,'offset'|'limit'|'orderBy'|'with'>",
);

export type SelectorDelete = typeof TSelectorDelete.infer;

const TOptionsQuery = type(
  type({
    "guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine|guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
  }),
);

export type OptionsQuery = typeof TOptionsQuery.infer;

type CTXOptionsQuery = {
  query: OptionsQuery;
};

const TGetQuery = type(
  type({
    "findFirst?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine|guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "includeTotal?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "select?": type("string")
      .pipe((args: string) => RJSON.parse(args))
      .to(TSelectorGet),
  }),
);

export type GetQuery = typeof TGetQuery.infer;

type CTXGetQuery = {
  query: GetQuery;
};

const TPostQuery = type(
  type({
    "guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine|guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "includeTotal?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "select?": type("string")
      .pipe((args: string) => RJSON.parse(args))
      .to(TSelectorPost),
  }),
);

export type PostQuery = typeof TPostQuery.infer;

type CTXPostQuery = {
  query: PostQuery;
};

export const TPostBody = type(
  "Record<string, unknown>|Record<string, unknown>[]",
);

export type PostBody = typeof TPostBody.infer;

export type CTXPostBody = {
  body: PostBody;
};

const TPatchQuery = type(
  type({
    "guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine|guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "includeTotal?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "select?": type("string")
      .pipe((args: string) => RJSON.parse(args))
      .to(TSelectorPatch),
  }),
);

export type PatchQuery = typeof TPatchQuery.infer;

type CTXPatchQuery = {
  query: PatchQuery;
};

export const TPatchBody = type("Record<string, unknown>");

export type PatchBody = typeof TPatchBody.infer;

export type CTXPatchBody = {
  body: PatchBody;
};

const TDeleteQuery = type(
  type({
    "guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "mine|guest?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "includeTotal?": type("'T'|'F'|''")
      .pipe((args: string) => args.charCodeAt(0) !== 70)
      .to("boolean"),
    "select?": type("string")
      .pipe((args: string) => RJSON.parse(args))
      .to(TSelectorDelete),
  }),
);

export type DeleteQuery = typeof TDeleteQuery.infer;

type CTXDeleteQuery = {
  query: DeleteQuery;
};

export enum SurpassMaxLimit {
  Limit = 0,
  Throw,
}

export const createQueryRoute = <
  Role extends string,
  CTXSession extends object,
  XContext = Record<string, never>,
  _Schema extends Record<string, Table | unknown> = Record<
    string,
    Table | unknown
  >,
  Database extends { transaction: any; query: any } = {
    transaction: any;
    query: any;
  },
  Transaction extends InferTransaction<Database> = InferTransaction<Database>,
  Query extends InferQuery<Database> = InferQuery<Database>,
  Schema extends PickTables<_Schema> = PickTables<_Schema>,
>({
  acl,
  schema,
  database,
  idParam,
  onSurpassMaxLimit = SurpassMaxLimit.Throw,
  session,
  defaults,
  onError,
}: {
  acl?: ACL<Role, CTXSession, XContext, Schema, Database, Transaction, Query>;
  schema: _Schema;
  database: Database;
  idParam: string;
  onSurpassMaxLimit?: SurpassMaxLimit;
  session?: {
    parser: RequestHandler<CTXSession & XContext>;
    getRole: (
      req: Request,
      ctx: CTXSession & XContext & CTXACLCommon<Role>,
    ) => Role;
  };
  defaults?: {
    maxDepth?: number;
    maxLimit?: number;
  };
  onError?: { (error: HttpError | Error): void };
}): Routes<
  CTXSession & XContext & CTXACLCommon<Role> & { url: URL; resourceId: string },
  {
    OPTIONS: CTXOptionsQuery;
    HEAD: CTXGetQuery &
      CTXACLResult<Schema, keyof Schema> & {
        findFirst?: boolean;
      };
    GET: CTXGetQuery &
      CTXACLResult<Schema, keyof Schema> & {
        findFirst?: boolean;
      };
    POST: CTXPostQuery & CTXPostBody & CTXACLResult<Schema, keyof Schema>;
    PATCH: CTXPatchQuery & CTXPatchBody & CTXACLResult<Schema, keyof Schema>;
    DELETE: CTXDeleteQuery & CTXACLResult<Schema, keyof Schema>;
  }
> => {
  const parseSession = session?.parser;
  const getRoleFromSession = session?.getRole;
  const defaultResultFormatter: RequestHandler<
    CTXSession &
      XContext &
      CTXACLCommon<Role> &
      CTXACLResult<Schema, keyof Schema> & {
        resourceId: string;
        findFirst?: boolean;
      }
  > = (_req, ctx) => {
    const resourceId = ctx.resourceId;
    const response: any = {};
    if (ctx.result) {
      if (ctx.result.total !== undefined) {
        response.total = ctx.result.total;
      }
      if (ctx.result.rowsAffected != null) {
        response.rowsAffected = ctx.result.rowsAffected;
      }
      if (ctx.findFirst) {
        response[resourceId as string] = ctx.result.rows;
      } else {
        response.count = ctx.result.count ?? ctx.result.rows?.length ?? 0;
        response[resourceId] = ctx.result.rows;
      }
    }
    return json(response);
  };
  const deepCombine = (
    result: Record<string, any>,
    tableId: string,
    ctx: CTXSession &
      XContext &
      CTXACLCommon<Role> &
      CTXACLResult<Schema, keyof Schema>,
    acl: any,
    query?: any,
    maxLimit?: number | null,
    maxDepth?: number | null,
    depth: number = 0,
  ) => {
    if (
      maxDepth !== null &&
      (maxDepth !== undefined
        ? depth > maxDepth
        : defaults?.maxDepth != null && depth > defaults.maxDepth)
    ) {
      throw new HttpError(
        `Max depth surpassed for ${depth === 0 ? "select" : "join"} '${tableId}'`,
        Status._400_BadRequest,
      );
    }
    const forbidQuery = acl?.forbidQuery;
    if (query?.offset != null) {
      if (forbidQuery?.offset) {
        throw new HttpError(
          "query 'select.offset' forbidden by ACL",
          Status._400_BadRequest,
        );
      }
      result.offset = query.offset;
    }
    if (query?.limit) {
      if (forbidQuery?.limit) {
        throw new HttpError(
          "query 'select.limit' forbidden by ACL",
          Status._400_BadRequest,
        );
      }
      if (
        maxLimit !== null &&
        (maxLimit !== undefined
          ? query.limit > maxLimit
          : defaults?.maxLimit != null && query.limit > defaults.maxLimit)
      ) {
        if (onSurpassMaxLimit === SurpassMaxLimit.Throw) {
          throw new HttpError(
            `Max limit surpassed for ${depth === 0 ? "select" : "join"} ${tableId}`,
            Status._400_BadRequest,
          );
        } else if (maxLimit !== undefined) {
          if (maxLimit !== null) {
            result.limit = maxLimit;
          }
        } else if (defaults?.maxLimit !== undefined) {
          if (defaults.maxLimit !== null) {
            result.limit = defaults.maxLimit;
          }
        }
      } else {
        result.limit = query.limit;
      }
    } else if (maxLimit !== undefined) {
      if (maxLimit !== null) {
        result.limit = maxLimit;
      }
    } else if (defaults?.maxLimit !== undefined) {
      if (defaults.maxLimit !== null) {
        result.limit = defaults.maxLimit;
      }
    }
    if (query?.columns != null) {
      if (forbidQuery?.columns) {
        throw new HttpError(
          "query 'select.columns' forbidden by ACL",
          Status._400_BadRequest,
        );
      }
      if (query.columns === false) {
        result.columns = {};
      } else if (query.columns === true) {
        // const mode = acl.columnMode == null ? true : acl.columnMode;
        if (typeof acl?.select === "boolean") {
          if (!acl.select) {
            result.columns = {};
          }
        } else {
          const mode = acl?.select?.mode ?? true;
          if (acl?.select?.columns) {
            result.columns = Object.fromEntries(
              acl.select.columns.keys().map((k: string) => [k, mode]),
            );
          } else if (mode === false) {
            result.columns = {};
          }
        }
      } else if (acl && (acl.select?.columns || acl.select?.mode)) {
        result.columns = {};
        const mode = acl.select?.mode;
        for (const [key, queryColumn] of Object.entries(query.columns)) {
          const aclColumn = acl.select?.columns.has(key);
          if (!queryColumn) {
            result.columns[key] = false;
          } else if (!mode ? !aclColumn : aclColumn) {
            result.columns[key] = queryColumn;
          } else {
            throw new HttpError(
              `forbidden query field '${key}' of table '${tableId}'`,
              400,
            );
          }
        }
      } else {
        result.columns = { ...query.columns };
      }
    } else if (typeof acl?.select === "boolean") {
      if (!acl.select) {
        result.columns = {};
      }
    } else if (acl?.select?.columns) {
      const mode = acl.select?.mode ?? true;
      result.columns = Object.fromEntries(
        acl.select.columns.keys().map((k: string) => [k, mode]),
      );
    } else if (acl?.select?.mode === false) {
      result.columns = {};
    }
    if (acl?.extras) {
      result.extras = acl.extras;
    }
    if (query?.where) {
      if (forbidQuery?.where) {
        throw new HttpError(
          "query 'select.where' forbidden by ACL",
          Status._400_BadRequest,
        );
      }
      const isArray = Array.isArray(query.where);
      const sWhere = isArray
        ? ([...query.where].map((e) => Object.entries(e)) as [string, any][][])
        : (Object.entries({ ...query.where }) as [string, any][]);
      result.where = (table: any, operators: any) => {
        let w = isArray
          ? operators.or(
              ...sWhere.map((orWhere: [string, any][]) =>
                operators.and(
                  ...orWhere.map(([key, value]) => {
                    let [field, operator] = key.split(".", 2) as [
                      string,
                      string,
                    ];
                    if (!(field in table)) {
                      throw new HttpError(
                        `Invalid column in where condition '${field}' here '${key}'`,
                        Status._400_BadRequest,
                      );
                    }
                    const fieldSel = table[field];
                    if (!operator) operator = "eq";
                    const op = operators[operator];
                    if (!op) {
                      throw new HttpError(
                        `Invalid operator in where condition '${operator}' here '${key}'`,
                        Status._400_BadRequest,
                      );
                    }
                    return op(
                      fieldSel,
                      fieldSel.dataType === "date" ? new Date(value) : value,
                    );
                  }),
                ),
              ),
            )
          : operators.and(
              acl?.where && acl.where(ctx, table, operators),
              ...sWhere.map(([key, value]) => {
                let [field, operator] = (key as string).split(".", 2) as [
                  string,
                  string,
                ];
                if (!(field in table)) {
                  throw new HttpError(
                    `Invalid column in where condition '${field}' here '${key}'`,
                    Status._400_BadRequest,
                  );
                }
                const fieldSel = table[field];
                if (!operator) operator = "eq";
                const op = operators[operator];
                if (!op) {
                  throw new HttpError(
                    `Invalid operator in where condition '${operator}' here '${key}'`,
                    Status._400_BadRequest,
                  );
                }
                return op(
                  fieldSel,
                  fieldSel.dataType === "date" ? new Date(value) : value,
                );
              }),
            );
        if (isArray && acl?.where) {
          w = operators.and(acl.where(ctx, table, operators), w);
        }
        return w;
      };
    } else if (acl?.where) {
      result.where = (table: any, operators: any) =>
        acl.where(ctx, table, operators);
    }
    if (query?.orderBy) {
      if (forbidQuery?.orderBy) {
        throw new HttpError(
          "query 'select.orderBy' forbidden by ACL",
          Status._400_BadRequest,
        );
      }
      const orderBy = Object.entries({ ...query.orderBy });
      result.orderBy = (table: any, operators: any) =>
        orderBy.map(([field, opname]) => {
          const targetField = table[field as keyof typeof table];
          if (!targetField) {
            throw new HttpError(
              `table column '${tableId}'.'${field}' not found`,
              400,
            );
          }
          const op =
            opname === 1 || opname === "asc" ? operators.asc : operators.desc;
          return op(targetField);
        });
    } else if (acl?.orderBy) {
      const orderBy = Object.entries({ ...acl.orderBy });
      result.orderBy = (table: any, operators: any) =>
        orderBy.map(([field, opname]) => {
          const targetField = table[field as keyof typeof table];
          if (!targetField) {
            throw new HttpError(
              `table column '${tableId}'.'${field}' not found`,
              400,
            );
          }
          const op =
            (opname as string).charAt(0) === "1" ||
            (opname as string).charAt(0) === "a"
              ? operators.asc
              : operators.desc;
          return op(targetField);
        });
    }
    if (query?.with) {
      if (forbidQuery?.with) {
        throw new HttpError(
          "query 'select.with' forbidden by ACL",
          Status._400_BadRequest,
        );
      }
      result.with = {};
      for (const [joinedTableId, selector] of Object.entries(
        query.with as Record<string, any>,
      )) {
        if (!selector) {
          continue;
        }
        if (acl?.with && !acl.with[joinedTableId]) {
          throw new HttpError(
            `Join of '${joinedTableId}' forbidden by ACL`,
            Status._400_BadRequest,
          );
        }
        result.with[joinedTableId] = {};
        deepCombine(
          result.with[joinedTableId],
          joinedTableId,
          ctx,
          acl?.with && acl.with[joinedTableId],
          selector,
          maxLimit,
          maxDepth,
          depth + 1,
        );
      }
    }
    return result;
  };
  const parseAuth: RequestHandler<
    CTXSession & XContext & CTXACLCommon<Role>
  > = async (req, ctx) => {
    if (parseSession) {
      const res = await parseSession(req, ctx);
      if (res instanceof Response) {
        return res;
      }
      ctx.userRole = getRoleFromSession && getRoleFromSession(req, ctx);
    }
  };
  const routes: Routes<
    CTXSession &
      XContext &
      CTXACLCommon<Role> & { url: URL; resourceId: string },
    {
      OPTIONS: CTXOptionsQuery;
      HEAD: CTXGetQuery &
        CTXACLResult<Schema, keyof Schema> & {
          findFirst?: boolean;
        };
      GET: CTXGetQuery &
        CTXACLResult<Schema, keyof Schema> & {
          findFirst?: boolean;
        };
      POST: CTXPostQuery & CTXPostBody & CTXACLResult<Schema, keyof Schema>;
      PATCH: CTXPatchQuery & CTXPatchBody & CTXACLResult<Schema, keyof Schema>;
      DELETE: CTXDeleteQuery & CTXACLResult<Schema, keyof Schema>;
    }
  > = {};
  //
  ///// OPTIONS
  //
  routes.OPTIONS = async (req, _ctx): Promise<Response> => {
    try {
      const resourceId = req.params[idParam] as keyof Query as string;
      const url = new URL(req.url);
      const query = TOptionsQuery(
        Object.fromEntries(url.searchParams.entries()),
      );
      if (query instanceof ArkErrors) {
        // throw new HttpError(query.toString(), Status._400_BadRequest);
        return json(
          {
            error: query.toString() || "Something went wrong",
          },
          {
            status: Status._400_BadRequest,
          },
        );
      }
      const ctx = {
        url,
        query,
        resourceId,
      } as NonNullable<typeof _ctx>;
      // PARSE SESSION AND AUTHENTICATE
      {
        const res = await parseAuth(req, ctx);
        if (res instanceof Response) {
          return res;
        }
      }
      const aclEntry:
        | ACLEntry<
            Role,
            CTXSession & XContext & CTXACLCommon<Role>,
            Record<string, Table>,
            Database,
            Transaction,
            Query,
            string
          >
        | undefined =
        acl &&
        (acl[resourceId as keyof typeof acl] as ACLEntry<
          Role,
          CTXSession & XContext & CTXACLCommon<Role>,
          Record<string, Table>,
          Database,
          Transaction,
          Query,
          string
        >);
      if (aclEntry == null) {
        return status(Status._404_NotFound, null);
        // throw new HttpError("Resource not found", Status._404_NotFound);
      }
      const tableId = aclEntry.table;
      const table = schema[tableId as keyof typeof schema] as Table;
      if (table == null) {
        return status(Status._404_NotFound, null);
        // throw new HttpError("Table not found", Status._404_NotFound);
      }
      const tablePermissions = aclEntry.control;
      const userRole = ctx.userRole;
      let allowedMethods;
      if (query["mine|guest"]) {
        allowedMethods = Object.entries(tablePermissions)
          .filter(
            userRole
              ? ([, perm]) =>
                  perm[userRole] || perm.mine || perm.all || perm.guest
              : ([, perm]) => perm.guest,
          )
          .map(([method]) => method);
      } else if (query.guest) {
        allowedMethods = Object.entries(tablePermissions)
          .filter(([, perm]) => perm.guest)
          .map(([method]) => method);
      } else if (query.mine) {
        allowedMethods = Object.entries(tablePermissions)
          .filter(([, perm]) => perm.mine)
          .map(([method]) => method);
      } else if (userRole) {
        allowedMethods = Object.entries(tablePermissions)
          .filter(([, perm]) => perm[userRole] || perm.mine || perm.all)
          .map(([method]) => method);
      } else {
        allowedMethods = Object.entries(tablePermissions)
          .filter(([, perm]) => perm.guest)
          .map(([method]) => method);
      }
      const headers = new Headers();
      if (allowedMethods.length > 0) {
        if (allowedMethods.includes("GET")) {
          headers.append("Allow", `OPTIONS,HEAD,${allowedMethods.join(",")}`);
        } else {
          headers.append("Allow", `OPTIONS,${allowedMethods.join(",")}`);
        }
      } else {
        headers.append("Allow", `OPTIONS`);
      }
      return status(Status._204_NoContent, null, {
        headers,
      });
    } catch (error) {
      return json(
        {
          error: (error as HttpError).message || "Something went wrong",
        },
        {
          status:
            (error as HttpError).status || Status._500_InternalServerError,
        },
      );
    }
  };
  //
  ///// GET
  //
  routes.GET = async (req, _ctx): Promise<Response> => {
    try {
      const resourceId = req.params[idParam] as keyof Query as string;
      const url = new URL(req.url);
      const query = TGetQuery(Object.fromEntries(url.searchParams.entries()));
      if (query instanceof ArkErrors) {
        // throw new HttpError(query.toString(), Status._400_BadRequest);
        return json(
          {
            error: query.toString() || "Something went wrong",
          },
          {
            status: Status._400_BadRequest,
          },
        );
      }
      const ctx = {
        url,
        query,
        resourceId,
      } as NonNullable<typeof _ctx>;
      // PARSE SESSION AND AUTHENTICATE
      {
        const res = await parseAuth(req, ctx);
        if (res instanceof Response) {
          return res;
        }
      }
      const { select } = query;
      const aclEntry:
        | ACLEntry<
            Role,
            CTXSession & XContext & CTXACLCommon<Role>,
            Record<string, Table>,
            Database,
            Transaction,
            Query,
            string
          >
        | undefined =
        acl &&
        (acl[resourceId as keyof typeof acl] as ACLEntry<
          Role,
          CTXSession & XContext & CTXACLCommon<Role>,
          Record<string, Table>,
          Database,
          Transaction,
          Query,
          string
        >);
      if (aclEntry == null) {
        return req.method === "HEAD"
          ? status(Status._404_NotFound, null)
          : json(
              {
                error: "Resource not found",
              },
              {
                status: Status._404_NotFound,
              },
            );
        // throw new HttpError("Resource not found", Status._404_NotFound);
      }
      const aclRule = aclEntry.control.GET;
      if (aclRule == null) {
        return req.method === "HEAD"
          ? status(Status._404_NotFound, null)
          : json(
              {
                error: "ACL rule not defined for the method for the method",
              },
              {
                status: Status._404_NotFound,
              },
            );
        // throw new HttpError("ACL rule not defined for the method", Status._404_NotFound);
      }
      const aclSelector = query["mine|guest"]
        ? ctx.userRole
          ? (aclRule[ctx.userRole] ??
            aclRule.mine ??
            aclRule.all ??
            aclRule.guest)
          : aclRule.guest
        : !query.guest && ctx.userRole
          ? query.mine
            ? aclRule.mine
            : (aclRule[ctx.userRole] ?? aclRule.mine ?? aclRule.all)
          : aclRule.guest;
      if (!aclSelector) {
        return json(
          {
            error: "Resource forbidden",
          },
          {
            status: Status._403_Forbidden,
          },
        );
        // throw new HttpError("Resource forbidden", 403);
      }
      if (
        query.findFirst != null &&
        aclEntry.findFirst != null &&
        query.findFirst !== aclEntry.findFirst
      ) {
        return json(
          {
            error: query.findFirst
              ? "find first forbidden by ACL"
              : "find many forbidden by ACL",
          },
          {
            status: Status._403_Forbidden,
          },
        );
        // throw new HttpError(
        //   query.findFirst
        //     ? "find first forbidden by ACL"
        //     : "find many forbidden by ACL",
        //   403,
        // );
      }
      ctx.findFirst = aclEntry.findFirst ?? query.findFirst;
      const tableId = (aclEntry.table as string) || resourceId;
      const selector: Record<string, unknown> = {};
      deepCombine(
        selector,
        tableId,
        ctx,
        aclSelector,
        select,
        aclEntry.maxLimit,
        aclEntry.maxDepth,
      );
      const formatResult = aclEntry.formatResult ?? defaultResultFormatter;
      try {
        const result = await database.transaction(
          async (tx: Transaction | any) => {
            (ctx as typeof ctx & CTXTX<Transaction>).tx = tx;
            if (aclSelector.beforeQuery) {
              await aclSelector.beforeQuery(
                ctx as typeof ctx & CTXTX<Transaction>,
              );
            }
            const table = schema[tableId as keyof typeof schema];
            const columns = (selector as any).columns;
            const extras = (selector as any).extras;
            const selecting =
              columns === undefined ||
              (typeof columns === "object" &&
                Object.keys(columns).length > 0) ||
              (typeof extras === "object" && Object.keys(extras).length > 0);
            const result: any = {
              rows: null,
            };
            if (selecting) {
              result.rows = ctx.findFirst
                ? await tx.query[tableId].findFirst(selector)
                : await tx.query[tableId].findMany(selector);
            } else {
              const count = await tx.$count(
                table,
                selector.where &&
                  (selector.where as (...args: any[]) => any)(table, operators),
              );
              const offset = (selector as any).offset ?? 0;
              const limit = (selector as any).limit;
              result.count = limit
                ? Math.min(limit, count - offset)
                : count - offset;
            }
            const includeTotal = query.includeTotal ?? aclEntry.includeTotal;
            if (includeTotal) {
              const table = schema[tableId as keyof typeof schema] as Table;
              const total = await tx.$count(
                table,
                aclSelector.where && aclSelector.where(ctx, table, operators),
              );
              result.total = total;
            }
            if (aclSelector.afterQuery) {
              await aclSelector.afterQuery(
                ctx as typeof ctx & CTXTX<Transaction>,
              );
            }
            return result;
          },
        );
        ctx.result = result;
        const res = formatResult(req, ctx);
        return res instanceof Response ? res : status(Status._204_NoContent);
      } catch (error) {
        if (aclSelector.onQueryError) {
          const res = await aclSelector.onQueryError(
            error instanceof Error ? error : new Error(String(error)),
            ctx as typeof ctx & CTXTX<Transaction>,
          );
          if (res instanceof Response) {
            return res;
          }
        }
        throw error;
      }
    } catch (error) {
      onError && onError(error as HttpError | Error);
      return json(
        {
          error: (error as HttpError).message || "Something went wrong",
        },
        {
          status:
            (error as HttpError).status || Status._500_InternalServerError,
        },
      );
    }
  };
  //
  ///// HEAD
  //
  routes.HEAD = routes.GET;
  //
  ///// POST
  //
  routes.POST = async (req, _ctx): Promise<Response> => {
    try {
      const resourceId = req.params[idParam] as keyof Query as string;
      const url = new URL(req.url);
      const query = TPostQuery(Object.fromEntries(url.searchParams.entries()));
      if (query instanceof ArkErrors) {
        // throw new HttpError(query.toString(), Status._400_BadRequest);
        return json(
          {
            error: query.toString() || "Something went wrong",
          },
          {
            status: Status._400_BadRequest,
          },
        );
      }
      const ctx = {
        url,
        query,
        body: undefined,
        resourceId,
      } as NonNullable<typeof _ctx> & CTXBody;
      {
        const res = parseBody({
          accept: ["application/json", "application/x-www-form-urlencoded"],
          maxSize: 4 * 1024 * 1024,
        })(req, ctx as any);
        if (res instanceof Response) {
          return res;
        }
      }
      // PARSE SESSION AND AUTHENTICATE
      {
        const res = await parseAuth(req, ctx);
        if (res instanceof Response) {
          return res;
        }
      }
      const { select } = query;
      const aclEntry:
        | ACLEntry<
            Role,
            CTXSession & XContext & CTXACLCommon<Role>,
            Record<string, Table>,
            Database,
            Transaction,
            Query,
            string
          >
        | undefined =
        acl &&
        (acl[resourceId as keyof typeof acl] as ACLEntry<
          Role,
          CTXSession & XContext & CTXACLCommon<Role>,
          Record<string, Table>,
          Database,
          Transaction,
          Query,
          string
        >);
      if (aclEntry == null) {
        return json(
          {
            error: "Resource not found",
          },
          {
            status: Status._404_NotFound,
          },
        );
        // throw new HttpError("Resource not found", Status._404_NotFound);
      }
      const aclRule = aclEntry.control.POST;
      if (aclRule == null) {
        return json(
          {
            error: "ACL rule not defined for the method",
          },
          {
            status: Status._404_NotFound,
          },
        );
        // throw new HttpError(
        //   "ACL rule not defined for the method",
        //   Status._404_NotFound,
        // );
      }
      const aclSelector = query["mine|guest"]
        ? ctx.userRole
          ? (aclRule[ctx.userRole] ?? aclRule.mine ?? aclRule.all)
          : aclRule.guest
        : !query.guest && ctx.userRole
          ? query.mine
            ? aclRule.mine
            : (aclRule[ctx.userRole] ?? aclRule.mine ?? aclRule.all)
          : aclRule.guest;
      if (!aclSelector) {
        return json(
          {
            error: "Resource forbidden",
          },
          {
            status: Status._403_Forbidden,
          },
        );
        // throw new HttpError("Resource forbidden", 403);
      }
      const tableId = (aclEntry.table as string) || resourceId;
      const selector: Record<string, unknown> = {};
      deepCombine(
        selector,
        tableId,
        ctx,
        aclSelector,
        select,
        aclEntry.maxLimit,
        aclEntry.maxDepth,
      );
      const formatResult = aclEntry.formatResult ?? defaultResultFormatter;
      try {
        const result = await database.transaction(
          async (tx: Transaction | any) => {
            (ctx as typeof ctx & CTXTX<Transaction>).tx = tx;
            let body: Record<string, unknown> | Record<string, unknown>[] =
              ctx.body;
            const validateBody = aclSelector.validateBody;
            const injectBody = aclSelector.injectBody;
            if (validateBody != null) {
              if (Array.isArray(body)) {
                for (let i = 0; i < body.length; i++) {
                  const vb = await validateBody(
                    body[i] as Record<string, unknown>,
                    ctx,
                  );
                  if (vb instanceof ArkErrors) {
                    throw new HttpError(vb.toString(), Status._400_BadRequest);
                    // throw vb;
                  }
                  body[i] = vb;
                }
              } else {
                const vb = await validateBody(body, ctx);
                if (vb instanceof ArkErrors) {
                  throw new HttpError(vb.toString(), Status._400_BadRequest);
                  // throw vb;
                }
                body = vb;
              }
            }
            if (injectBody != null) {
              if (Array.isArray(body)) {
                for (let i = 0; i < body.length; i++) {
                  const vb = await injectBody(
                    body[i] as Record<string, unknown>,
                    ctx,
                  );
                  if (vb != null) body[i] = vb as Record<string, unknown>;
                }
              } else {
                const vb = await injectBody(body, ctx);
                if (vb != null) body = vb as Record<string, unknown>;
              }
            }
            ctx.body = body;
            if (aclSelector.beforeQuery) {
              await aclSelector.beforeQuery(
                ctx as typeof ctx & CTXTX<Transaction>,
              );
            }
            const table = schema[tableId as keyof typeof schema] as Table;
            let columns: Record<string, any> | undefined;
            // get cached columns selector
            if (selector.columnsSelector) {
              columns = selector.columnsSelector;
            } else if (selector.columns) {
              columns = {};
              for (const [key, selectColumn] of Object.entries(
                selector.columns,
              )) {
                if (selectColumn)
                  columns[key as string] = table[key as keyof typeof table];
              }
              selector.columnsSelector = columns;
            }
            const result: any = { rows: null };
            if (columns && Object.keys(columns).length > 0) {
              result.rows = await tx
                .insert(table)
                .values(ctx.body)
                .returning(columns);
              result.count = result.rows.length;
            } else {
              const info = await tx.insert(table).values(ctx.body);
              result.rowsAffected = info.rowsAffected;
            }
            const includeTotal = query.includeTotal ?? aclEntry.includeTotal;
            if (includeTotal) {
              const table = schema[tableId as keyof typeof schema] as Table;
              const total = await tx.$count(
                table,
                aclSelector.where && aclSelector.where(ctx, table, operators),
              );
              result.total = total;
            }
            if (aclSelector.afterQuery) {
              await aclSelector.afterQuery(
                ctx as typeof ctx & CTXTX<Transaction>,
              );
            }
            return result;
          },
        );
        ctx.result = result;
        const res = formatResult(req, ctx as typeof ctx & CTXTX<Transaction>);
        return res instanceof Response ? res : status(Status._204_NoContent);
      } catch (error) {
        if (aclSelector.onQueryError) {
          const res = await aclSelector.onQueryError(
            error instanceof Error ? error : new Error(String(error)),
            ctx as typeof ctx & CTXTX<Transaction>,
          );
          if (res instanceof Response) {
            return res;
          }
        }
        throw error;
      }
    } catch (error) {
      onError && onError(error as HttpError | Error);
      return json(
        {
          error: (error as HttpError).message || "Something went wrong",
        },
        {
          status:
            (error as HttpError).status || Status._500_InternalServerError,
        },
      );
    }
  };
  //
  ///// PATCH
  //
  routes.PATCH = async (req, _ctx): Promise<Response> => {
    try {
      const resourceId = req.params[idParam] as keyof Query as string;
      const url = new URL(req.url);
      const query = TPatchQuery(Object.fromEntries(url.searchParams.entries()));
      if (query instanceof ArkErrors) {
        // throw new HttpError(query.toString(), Status._400_BadRequest);
        return json(
          {
            error: query.toString() || "Something went wrong",
          },
          {
            status: Status._400_BadRequest,
          },
        );
      }
      const ctx = {
        url,
        query,
        body: undefined,
        resourceId,
      } as NonNullable<typeof _ctx> & CTXBody;
      {
        const res = parseBody({
          accept: ["application/json", "application/x-www-form-urlencoded"],
          maxSize: 4 * 1024 * 1024,
        })(req, ctx as any);
        if (res instanceof Response) {
          return res;
        }
      }
      // PARSE SESSION AND AUTHENTICATE
      {
        const res = await parseAuth(req, ctx);
        if (res instanceof Response) {
          return res;
        }
      }
      const { select } = query;
      const aclEntry:
        | ACLEntry<
            Role,
            CTXSession & XContext & CTXACLCommon<Role>,
            Record<string, Table>,
            Database,
            Transaction,
            Query,
            string
          >
        | undefined =
        acl &&
        (acl[resourceId as keyof typeof acl] as ACLEntry<
          Role,
          CTXSession & XContext & CTXACLCommon<Role>,
          Record<string, Table>,
          Database,
          Transaction,
          Query,
          string
        >);
      if (aclEntry == null) {
        return json(
          {
            error: "Resource not found",
          },
          {
            status: Status._404_NotFound,
          },
        );
        // throw new HttpError("Resource not found", Status._404_NotFound);
      }
      const aclRule = aclEntry.control.PATCH;
      if (aclRule == null) {
        return json(
          {
            error: "ACL rule not defined for the method",
          },
          {
            status: Status._404_NotFound,
          },
        );
        // throw new HttpError(
        //   "ACL rule not defined for the method",
        //   Status._404_NotFound,
        // );
      }
      const aclSelector = query["mine|guest"]
        ? ctx.userRole
          ? (aclRule[ctx.userRole] ?? aclRule.mine ?? aclRule.all)
          : aclRule.guest
        : !query.guest && ctx.userRole
          ? query.mine
            ? aclRule.mine
            : (aclRule[ctx.userRole] ?? aclRule.mine ?? aclRule.all)
          : aclRule.guest;
      if (!aclSelector) {
        return json(
          {
            error: "Resource forbidden",
          },
          {
            status: Status._403_Forbidden,
          },
        );
        // throw new HttpError("Resource forbidden", 403);
      }
      const tableId = (aclEntry.table as string) || resourceId;
      const selector: Record<string, unknown> = {};
      deepCombine(
        selector,
        tableId,
        ctx,
        aclSelector,
        select,
        aclEntry.maxLimit,
        aclEntry.maxDepth,
      );
      const formatResult = aclEntry.formatResult ?? defaultResultFormatter;
      try {
        const result = await database.transaction(
          async (tx: Transaction | any) => {
            (ctx as typeof ctx & CTXTX<Transaction>).tx = tx;
            let body: Record<string, unknown> = ctx.body;
            const validateBody = aclSelector.validateBody;
            const injectBody = aclSelector.injectBody;
            if (validateBody != null) {
              const vb = await validateBody(body, ctx);
              if (vb instanceof ArkErrors) {
                throw new HttpError(vb.toString(), Status._400_BadRequest);
                // throw vb;
              }
              body = vb;
            }
            if (injectBody != null) {
              const vb = await injectBody(body, ctx);
              if (vb != null) body = vb as Record<string, unknown>;
            }
            ctx.body = body;
            if (aclSelector.beforeQuery) {
              await aclSelector.beforeQuery(
                ctx as typeof ctx & CTXTX<Transaction>,
              );
            }
            const table = schema[tableId as keyof typeof schema] as Table;
            let columns: Record<string, any> | undefined;
            // get cached columns selector
            if (selector.columnsSelector) {
              columns = selector.columnsSelector;
            } else if (selector.columns) {
              columns = {};
              for (const [key, selectColumn] of Object.entries(
                selector.columns,
              )) {
                if (selectColumn)
                  columns[key as string] = table[key as keyof typeof table];
              }
              selector.columnsSelector = columns;
            }
            const result: any = { rows: null };
            if (columns && Object.keys(columns).length > 0) {
              result.rows = await tx
                .update(table)
                .set(ctx.body)
                .where(
                  selector.where &&
                    (selector.where as (...args: any[]) => any)(
                      table,
                      operators,
                    ),
                )
                .returning(columns);
            } else {
              const info = await tx
                .update(table)
                .set(ctx.body)
                .where(
                  selector.where &&
                    (selector.where as (...args: any[]) => any)(
                      table,
                      operators,
                    ),
                );
              result.rowsAffected = info.rowsAffected;
            }
            const includeTotal = query.includeTotal ?? aclEntry.includeTotal;
            if (includeTotal) {
              const table = schema[tableId as keyof typeof schema] as Table;
              const total = await tx.$count(
                table,
                aclSelector.where && aclSelector.where(ctx, table, operators),
              );
              result.total = total;
            }
            if (aclSelector.afterQuery) {
              await aclSelector.afterQuery(
                ctx as typeof ctx & CTXTX<Transaction>,
              );
            }
            return result;
          },
        );
        ctx.result = result;
        const res = formatResult(req, ctx as typeof ctx & CTXTX<Transaction>);
        return res instanceof Response ? res : status(Status._204_NoContent);
      } catch (error) {
        if (aclSelector.onQueryError) {
          const res = await aclSelector.onQueryError(
            error instanceof Error ? error : new Error(String(error)),
            ctx as typeof ctx & CTXTX<Transaction>,
          );
          if (res instanceof Response) {
            return res;
          }
        }
        throw error;
      }
    } catch (error) {
      onError && onError(error as HttpError | Error);
      return json(
        {
          error: (error as HttpError).message || "Something went wrong",
        },
        {
          status:
            (error as HttpError).status || Status._500_InternalServerError,
        },
      );
    }
  };
  //
  ///// DELETE
  //
  routes.DELETE = async (req, _ctx): Promise<Response> => {
    try {
      const resourceId = req.params[idParam] as keyof Query as string;
      const url = new URL(req.url);
      const query = TDeleteQuery(
        Object.fromEntries(url.searchParams.entries()),
      );
      if (query instanceof ArkErrors) {
        // throw new HttpError(query.toString(), Status._400_BadRequest);
        return json(
          {
            error: query.toString() || "Something went wrong",
          },
          {
            status: Status._400_BadRequest,
          },
        );
      }
      const ctx = {
        url,
        query,
        resourceId,
      } as NonNullable<typeof _ctx> & CTXBody;
      // PARSE SESSION AND AUTHENTICATE
      {
        const res = await parseAuth(req, ctx);
        if (res instanceof Response) {
          return res;
        }
      }
      const { select } = query;
      const aclEntry:
        | ACLEntry<
            Role,
            CTXSession & XContext & CTXACLCommon<Role>,
            Record<string, Table>,
            Database,
            Transaction,
            Query,
            string
          >
        | undefined =
        acl &&
        (acl[resourceId as keyof typeof acl] as ACLEntry<
          Role,
          CTXSession & XContext & CTXACLCommon<Role>,
          Record<string, Table>,
          Database,
          Transaction,
          Query,
          string
        >);
      if (aclEntry == null) {
        return json(
          {
            error: "Resource not found",
          },
          {
            status: Status._404_NotFound,
          },
        );
        // throw new HttpError("Resource not found", Status._404_NotFound);
      }
      const aclRule = aclEntry.control.DELETE;
      if (aclRule == null) {
        return json(
          {
            error: "ACL rule not defined for the method",
          },
          {
            status: Status._404_NotFound,
          },
        );
        // throw new HttpError(
        //   "ACL rule not defined for the method",
        //   Status._404_NotFound,
        // );
      }
      const aclSelector = query["mine|guest"]
        ? ctx.userRole
          ? (aclRule[ctx.userRole] ?? aclRule.mine ?? aclRule.all)
          : aclRule.guest
        : !query.guest && ctx.userRole
          ? query.mine
            ? aclRule.mine
            : (aclRule[ctx.userRole] ?? aclRule.mine ?? aclRule.all)
          : aclRule.guest;
      if (!aclSelector) {
        return json(
          {
            error: "Resource forbidden",
          },
          {
            status: Status._403_Forbidden,
          },
        );
        // throw new HttpError("Resource forbidden", 403);
      }
      const tableId = (aclEntry.table as string) || resourceId;
      const selector: Record<string, unknown> = {};
      deepCombine(
        selector,
        tableId,
        ctx,
        aclSelector,
        select,
        aclEntry.maxLimit,
        aclEntry.maxDepth,
      );
      const formatResult = aclEntry.formatResult ?? defaultResultFormatter;
      try {
        const result = await database.transaction(
          async (tx: Transaction | any) => {
            (ctx as typeof ctx & CTXTX<Transaction>).tx = tx;
            if (aclSelector.beforeQuery) {
              await aclSelector.beforeQuery(
                ctx as typeof ctx & CTXTX<Transaction>,
              );
            }
            const table = schema[tableId as keyof typeof schema] as Table;
            let columns: Record<string, any> | undefined;
            // get cached columns selector
            if (selector.columnsSelector) {
              columns = selector.columnsSelector;
            } else if (selector.columns) {
              columns = {};
              for (const [key, selectColumn] of Object.entries(
                selector.columns,
              )) {
                if (selectColumn)
                  columns[key as string] = table[key as keyof typeof table];
              }
              selector.columnsSelector = columns;
            }
            const result: any = { rows: null };
            if (
              columns == null ||
              (typeof columns == "object" && Object.keys(columns).length > 0)
            ) {
              result.rows = await tx
                .delete(table)
                .where(
                  selector.where &&
                    (selector.where as (...args: any[]) => any)(
                      table,
                      operators,
                    ),
                )
                .returning(columns);
            } else {
              const info = await tx
                .delete(table)
                .where(
                  selector.where &&
                    (selector.where as (...args: any[]) => any)(
                      table,
                      operators,
                    ),
                );
              result.rowsAffected = info.rowsAffected;
            }
            const includeTotal = query.includeTotal ?? aclEntry.includeTotal;
            if (includeTotal) {
              const table = schema[tableId as keyof typeof schema] as Table;
              const total = await tx.$count(
                table,
                aclSelector.where && aclSelector.where(ctx, table, operators),
              );
              result.total = total;
            }
            if (aclSelector.afterQuery) {
              await aclSelector.afterQuery(
                ctx as typeof ctx & CTXTX<Transaction>,
              );
            }
            return result;
          },
        );
        ctx.result = result;
        const res = formatResult(req, ctx as typeof ctx & CTXTX<Transaction>);
        return res instanceof Response ? res : status(Status._204_NoContent);
      } catch (error) {
        if (aclSelector.onQueryError) {
          const res = await aclSelector.onQueryError(
            error instanceof Error ? error : new Error(String(error)),
            ctx as typeof ctx & CTXTX<Transaction>,
          );
          if (res instanceof Response) {
            return res;
          }
        }
        throw error;
      }
    } catch (error) {
      onError && onError(error as HttpError | Error);
      return json(
        {
          error: (error as HttpError).message || "Something went wrong",
        },
        {
          status:
            (error as HttpError).status || Status._500_InternalServerError,
        },
      );
    }
  };
  return routes;
};
