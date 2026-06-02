"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryRouter = exports.SurpassMaxLimit = exports.TPatchBody = exports.TPostBody = exports.TSelectorDelete = exports.TSelectorPatch = exports.TSelectorPost = exports.TSelectorGet = exports.operators = exports.HttpError = void 0;
const router_1 = require("@bepalo/router");
const arktype_1 = require("arktype");
const rjson_1 = require("@bepalo/rjson");
const drizzle_orm_1 = require("drizzle-orm");
class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.status = 500;
        this.status = status || 500;
    }
}
exports.HttpError = HttpError;
exports.operators = (0, drizzle_orm_1.getOperators)();
const RJSOnScope = arktype_1.type.scope({
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
exports.TSelectorGet = RJSOnScope.type("Selector");
exports.TSelectorPost = RJSOnScope.type("Omit<Selector,'offset'|'limit'|'orderBy'|'where'|'with'>");
exports.TSelectorPatch = RJSOnScope.type("Omit<Selector,'offset'|'limit'|'orderBy'|'with'>");
exports.TSelectorDelete = RJSOnScope.type("Omit<Selector,'offset'|'limit'|'orderBy'|'with'>");
const TOptionsQuery = (0, arktype_1.type)((0, arktype_1.type)({
    "guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine|guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
}));
const TGetQuery = (0, arktype_1.type)((0, arktype_1.type)({
    "findFirst?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine|guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "includeTotal?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "select?": (0, arktype_1.type)("string")
        .pipe((args) => rjson_1.RJSON.parse(args))
        .to(exports.TSelectorGet),
}));
const TPostQuery = (0, arktype_1.type)((0, arktype_1.type)({
    "guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine|guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "includeTotal?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "select?": (0, arktype_1.type)("string")
        .pipe((args) => rjson_1.RJSON.parse(args))
        .to(exports.TSelectorPost),
}));
exports.TPostBody = (0, arktype_1.type)("Record<string, unknown>|Record<string, unknown>[]");
const TPatchQuery = (0, arktype_1.type)((0, arktype_1.type)({
    "guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine|guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "includeTotal?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "select?": (0, arktype_1.type)("string")
        .pipe((args) => rjson_1.RJSON.parse(args))
        .to(exports.TSelectorPatch),
}));
exports.TPatchBody = (0, arktype_1.type)("Record<string, unknown>");
const TDeleteQuery = (0, arktype_1.type)((0, arktype_1.type)({
    "guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "mine|guest?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "includeTotal?": (0, arktype_1.type)("'T'|'F'|''")
        .pipe((args) => args.charCodeAt(0) !== 70)
        .to("boolean"),
    "select?": (0, arktype_1.type)("string")
        .pipe((args) => rjson_1.RJSON.parse(args))
        .to(exports.TSelectorDelete),
}));
var SurpassMaxLimit;
(function (SurpassMaxLimit) {
    SurpassMaxLimit[SurpassMaxLimit["Limit"] = 0] = "Limit";
    SurpassMaxLimit[SurpassMaxLimit["Throw"] = 1] = "Throw";
})(SurpassMaxLimit || (exports.SurpassMaxLimit = SurpassMaxLimit = {}));
const createQueryRouter = ({ acl, schema, database, idParam, onSurpassMaxLimit = SurpassMaxLimit.Throw, session, defaults, onError, }) => {
    const parseSession = session === null || session === void 0 ? void 0 : session.parser;
    const getRoleFromSession = session === null || session === void 0 ? void 0 : session.getRole;
    const defaultResultFormatter = (_req, ctx) => {
        var _a, _b, _c;
        const resourceId = ctx.resourceId;
        const response = {};
        if (ctx.result) {
            if (ctx.result.total !== undefined) {
                response.total = ctx.result.total;
            }
            if (ctx.result.rowsAffected != null) {
                response.rowsAffected = ctx.result.rowsAffected;
            }
            if (ctx.findFirst) {
                response[resourceId] = ctx.result.rows;
            }
            else {
                response.count = (_c = (_a = ctx.result.count) !== null && _a !== void 0 ? _a : (_b = ctx.result.rows) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                response[ctx.dontPluralize ? resourceId : `${resourceId}s`] =
                    ctx.result.rows;
            }
        }
        return (0, router_1.json)(response);
    };
    const deepCombine = (result, tableId, ctx, acl, query, maxLimit, maxDepth, depth = 0) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (maxDepth !== null &&
            (maxDepth !== undefined
                ? depth > maxDepth
                : (defaults === null || defaults === void 0 ? void 0 : defaults.maxDepth) != null && depth > defaults.maxDepth)) {
            throw new HttpError(`Max depth surpassed for ${depth === 0 ? "select" : "join"} '${tableId}'`, router_1.Status._400_BadRequest);
        }
        const forbidQuery = acl === null || acl === void 0 ? void 0 : acl.forbidQuery;
        if ((query === null || query === void 0 ? void 0 : query.offset) != null) {
            if (forbidQuery === null || forbidQuery === void 0 ? void 0 : forbidQuery.offset) {
                throw new HttpError("query 'select.offset' forbidden by ACL", router_1.Status._400_BadRequest);
            }
            result.offset = query.offset;
        }
        if (query === null || query === void 0 ? void 0 : query.limit) {
            if (forbidQuery === null || forbidQuery === void 0 ? void 0 : forbidQuery.limit) {
                throw new HttpError("query 'select.limit' forbidden by ACL", router_1.Status._400_BadRequest);
            }
            if (maxLimit !== null &&
                (maxLimit !== undefined
                    ? query.limit > maxLimit
                    : (defaults === null || defaults === void 0 ? void 0 : defaults.maxLimit) != null && query.limit > defaults.maxLimit)) {
                if (onSurpassMaxLimit === SurpassMaxLimit.Throw) {
                    throw new HttpError(`Max limit surpassed for ${depth === 0 ? "select" : "join"} ${tableId}`, router_1.Status._400_BadRequest);
                }
                else if (maxLimit !== undefined) {
                    if (maxLimit !== null) {
                        result.limit = maxLimit;
                    }
                }
                else if ((defaults === null || defaults === void 0 ? void 0 : defaults.maxLimit) !== undefined) {
                    if (defaults.maxLimit !== null) {
                        result.limit = defaults.maxLimit;
                    }
                }
            }
            else {
                result.limit = query.limit;
            }
        }
        else if (maxLimit !== undefined) {
            if (maxLimit !== null) {
                result.limit = maxLimit;
            }
        }
        else if ((defaults === null || defaults === void 0 ? void 0 : defaults.maxLimit) !== undefined) {
            if (defaults.maxLimit !== null) {
                result.limit = defaults.maxLimit;
            }
        }
        if ((query === null || query === void 0 ? void 0 : query.columns) != null) {
            if (forbidQuery === null || forbidQuery === void 0 ? void 0 : forbidQuery.columns) {
                throw new HttpError("query 'select.columns' forbidden by ACL", router_1.Status._400_BadRequest);
            }
            if (query.columns === false) {
                result.columns = {};
            }
            else if (query.columns === true) {
                // const mode = acl.columnMode == null ? true : acl.columnMode;
                if (typeof (acl === null || acl === void 0 ? void 0 : acl.select) === "boolean") {
                    if (!acl.select) {
                        result.columns = {};
                    }
                }
                else {
                    const mode = (_b = (_a = acl === null || acl === void 0 ? void 0 : acl.select) === null || _a === void 0 ? void 0 : _a.mode) !== null && _b !== void 0 ? _b : true;
                    if ((_c = acl === null || acl === void 0 ? void 0 : acl.select) === null || _c === void 0 ? void 0 : _c.columns) {
                        result.columns = Object.fromEntries(acl.select.columns.keys().map((k) => [k, mode]));
                    }
                    else if (mode === false) {
                        result.columns = {};
                    }
                }
            }
            else if (acl && (((_d = acl.select) === null || _d === void 0 ? void 0 : _d.columns) || ((_e = acl.select) === null || _e === void 0 ? void 0 : _e.mode))) {
                result.columns = {};
                const mode = (_f = acl.select) === null || _f === void 0 ? void 0 : _f.mode;
                for (const [key, queryColumn] of Object.entries(query.columns)) {
                    const aclColumn = (_g = acl.select) === null || _g === void 0 ? void 0 : _g.columns.has(key);
                    if (!queryColumn) {
                        result.columns[key] = false;
                    }
                    else if (!mode ? !aclColumn : aclColumn) {
                        result.columns[key] = queryColumn;
                    }
                    else {
                        throw new HttpError(`forbidden query field '${key}' of table '${tableId}'`, 400);
                    }
                }
            }
            else {
                result.columns = Object.assign({}, query.columns);
            }
        }
        else if (typeof (acl === null || acl === void 0 ? void 0 : acl.select) === "boolean") {
            if (!acl.select) {
                result.columns = {};
            }
        }
        else if ((_h = acl === null || acl === void 0 ? void 0 : acl.select) === null || _h === void 0 ? void 0 : _h.columns) {
            const mode = (_k = (_j = acl.select) === null || _j === void 0 ? void 0 : _j.mode) !== null && _k !== void 0 ? _k : true;
            result.columns = Object.fromEntries(acl.select.columns.keys().map((k) => [k, mode]));
        }
        else if (((_l = acl === null || acl === void 0 ? void 0 : acl.select) === null || _l === void 0 ? void 0 : _l.mode) === false) {
            result.columns = {};
        }
        if (acl === null || acl === void 0 ? void 0 : acl.extras) {
            result.extras = acl.extras;
        }
        if (query === null || query === void 0 ? void 0 : query.where) {
            if (forbidQuery === null || forbidQuery === void 0 ? void 0 : forbidQuery.where) {
                throw new HttpError("query 'select.where' forbidden by ACL", router_1.Status._400_BadRequest);
            }
            const isArray = Array.isArray(query.where);
            const sWhere = isArray
                ? [...query.where].map((e) => Object.entries(e))
                : Object.entries(Object.assign({}, query.where));
            result.where = (table, operators) => {
                let w = isArray
                    ? operators.or(...sWhere.map((orWhere) => operators.and(...orWhere.map(([key, value]) => {
                        let [field, operator] = key.split(".", 2);
                        if (!(field in table)) {
                            throw new HttpError(`Invalid column in where condition '${field}' here '${key}'`, router_1.Status._400_BadRequest);
                        }
                        const fieldSel = table[field];
                        if (!operator)
                            operator = "eq";
                        const op = operators[operator];
                        if (!op) {
                            throw new HttpError(`Invalid operator in where condition '${operator}' here '${key}'`, router_1.Status._400_BadRequest);
                        }
                        return op(fieldSel, fieldSel.dataType === "date" ? new Date(value) : value);
                    }))))
                    : operators.and((acl === null || acl === void 0 ? void 0 : acl.where) && acl.where(ctx, table, operators), ...sWhere.map(([key, value]) => {
                        let [field, operator] = key.split(".", 2);
                        if (!(field in table)) {
                            throw new HttpError(`Invalid column in where condition '${field}' here '${key}'`, router_1.Status._400_BadRequest);
                        }
                        const fieldSel = table[field];
                        if (!operator)
                            operator = "eq";
                        const op = operators[operator];
                        if (!op) {
                            throw new HttpError(`Invalid operator in where condition '${operator}' here '${key}'`, router_1.Status._400_BadRequest);
                        }
                        return op(fieldSel, fieldSel.dataType === "date" ? new Date(value) : value);
                    }));
                if (isArray && (acl === null || acl === void 0 ? void 0 : acl.where)) {
                    w = operators.and(acl.where(ctx, table, operators), w);
                }
                return w;
            };
        }
        else if (acl === null || acl === void 0 ? void 0 : acl.where) {
            result.where = (table, operators) => acl.where(ctx, table, operators);
        }
        if (query === null || query === void 0 ? void 0 : query.orderBy) {
            if (forbidQuery === null || forbidQuery === void 0 ? void 0 : forbidQuery.orderBy) {
                throw new HttpError("query 'select.orderBy' forbidden by ACL", router_1.Status._400_BadRequest);
            }
            const orderBy = Object.entries(Object.assign({}, query.orderBy));
            result.orderBy = (table, operators) => orderBy.map(([field, opname]) => {
                const targetField = table[field];
                if (!targetField) {
                    throw new HttpError(`table column '${tableId}'.'${field}' not found`, 400);
                }
                const op = opname === 1 || opname === "asc" ? operators.asc : operators.desc;
                return op(targetField);
            });
        }
        else if (acl === null || acl === void 0 ? void 0 : acl.orderBy) {
            const orderBy = Object.entries(Object.assign({}, acl.orderBy));
            result.orderBy = (table, operators) => orderBy.map(([field, opname]) => {
                const targetField = table[field];
                if (!targetField) {
                    throw new HttpError(`table column '${tableId}'.'${field}' not found`, 400);
                }
                const op = opname.charAt(0) === "1" ||
                    opname.charAt(0) === "a"
                    ? operators.asc
                    : operators.desc;
                return op(targetField);
            });
        }
        if (query === null || query === void 0 ? void 0 : query.with) {
            if (forbidQuery === null || forbidQuery === void 0 ? void 0 : forbidQuery.with) {
                throw new HttpError("query 'select.with' forbidden by ACL", router_1.Status._400_BadRequest);
            }
            result.with = {};
            for (const [joinedTableId, selector] of Object.entries(query.with)) {
                if (!selector) {
                    continue;
                }
                if ((acl === null || acl === void 0 ? void 0 : acl.with) && !acl.with[joinedTableId]) {
                    throw new HttpError(`Join of '${joinedTableId}' forbidden by ACL`, router_1.Status._400_BadRequest);
                }
                result.with[joinedTableId] = {};
                deepCombine(result.with[joinedTableId], joinedTableId, ctx, (acl === null || acl === void 0 ? void 0 : acl.with) && acl.with[joinedTableId], selector, maxLimit, maxDepth, depth + 1);
            }
        }
        return result;
    };
    const parseAuth = (req, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (parseSession) {
            const res = yield parseSession(req, ctx);
            if (res instanceof Response) {
                return res;
            }
            ctx.userRole = getRoleFromSession && getRoleFromSession(req, ctx);
        }
    });
    const routes = {};
    //
    ///// OPTIONS
    //
    routes.OPTIONS = (req, _ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const resourceId = req.params[idParam];
            const url = new URL(req.url);
            const query = TOptionsQuery(Object.fromEntries(url.searchParams.entries()));
            if (query instanceof arktype_1.ArkErrors) {
                // throw new HttpError(query.toString(), Status._400_BadRequest);
                return (0, router_1.json)({
                    error: query.toString() || "Something went wrong",
                }, {
                    status: router_1.Status._400_BadRequest,
                });
            }
            const ctx = {
                url,
                query,
                resourceId,
            };
            // PARSE SESSION AND AUTHENTICATE
            {
                const res = yield parseAuth(req, ctx);
                if (res instanceof Response) {
                    return res;
                }
            }
            const aclEntry = acl &&
                acl[resourceId];
            if (aclEntry == null) {
                return (0, router_1.status)(router_1.Status._404_NotFound, null);
                // throw new HttpError("Resource not found", Status._404_NotFound);
            }
            const tableId = aclEntry.table;
            const table = schema[tableId];
            if (table == null) {
                return (0, router_1.status)(router_1.Status._404_NotFound, null);
                // throw new HttpError("Table not found", Status._404_NotFound);
            }
            const tablePermissions = aclEntry.control;
            const userRole = ctx.userRole;
            let allowedMethods;
            if (query["mine|guest"]) {
                allowedMethods = Object.entries(tablePermissions)
                    .filter(userRole
                    ? ([, perm]) => perm[userRole] || perm.mine || perm.all || perm.guest
                    : ([, perm]) => perm.guest)
                    .map(([method]) => method);
            }
            else if (query.guest) {
                allowedMethods = Object.entries(tablePermissions)
                    .filter(([, perm]) => perm.guest)
                    .map(([method]) => method);
            }
            else if (query.mine) {
                allowedMethods = Object.entries(tablePermissions)
                    .filter(([, perm]) => perm.mine)
                    .map(([method]) => method);
            }
            else if (userRole) {
                allowedMethods = Object.entries(tablePermissions)
                    .filter(([, perm]) => perm[userRole] || perm.mine || perm.all)
                    .map(([method]) => method);
            }
            else {
                allowedMethods = Object.entries(tablePermissions)
                    .filter(([, perm]) => perm.guest)
                    .map(([method]) => method);
            }
            const headers = new Headers();
            if (allowedMethods.length > 0) {
                if (allowedMethods.includes("GET")) {
                    headers.append("Allow", `OPTIONS,HEAD,${allowedMethods.join(",")}`);
                }
                else {
                    headers.append("Allow", `OPTIONS,${allowedMethods.join(",")}`);
                }
            }
            else {
                headers.append("Allow", `OPTIONS`);
            }
            return (0, router_1.status)(router_1.Status._204_NoContent, null, {
                headers,
            });
        }
        catch (error) {
            return (0, router_1.json)({
                error: error.message || "Something went wrong",
            }, {
                status: error.status || router_1.Status._500_InternalServerError,
            });
        }
    });
    //
    ///// GET
    //
    routes.GET = (req, _ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            const resourceId = req.params[idParam];
            const url = new URL(req.url);
            const query = TGetQuery(Object.fromEntries(url.searchParams.entries()));
            if (query instanceof arktype_1.ArkErrors) {
                // throw new HttpError(query.toString(), Status._400_BadRequest);
                return (0, router_1.json)({
                    error: query.toString() || "Something went wrong",
                }, {
                    status: router_1.Status._400_BadRequest,
                });
            }
            const ctx = {
                url,
                query,
                resourceId,
            };
            // PARSE SESSION AND AUTHENTICATE
            {
                const res = yield parseAuth(req, ctx);
                if (res instanceof Response) {
                    return res;
                }
            }
            const { select } = query;
            const aclEntry = acl &&
                acl[resourceId];
            if (aclEntry == null) {
                return req.method === "HEAD"
                    ? (0, router_1.status)(router_1.Status._404_NotFound, null)
                    : (0, router_1.json)({
                        error: "Resource not found",
                    }, {
                        status: router_1.Status._404_NotFound,
                    });
                // throw new HttpError("Resource not found", Status._404_NotFound);
            }
            const aclRule = aclEntry.control.GET;
            if (aclRule == null) {
                return req.method === "HEAD"
                    ? (0, router_1.status)(router_1.Status._404_NotFound, null)
                    : (0, router_1.json)({
                        error: "ACL rule not defined for the method for the method",
                    }, {
                        status: router_1.Status._404_NotFound,
                    });
                // throw new HttpError("ACL rule not defined for the method", Status._404_NotFound);
            }
            const aclSelector = query["mine|guest"]
                ? ctx.userRole
                    ? ((_c = (_b = (_a = aclRule[ctx.userRole]) !== null && _a !== void 0 ? _a : aclRule.mine) !== null && _b !== void 0 ? _b : aclRule.all) !== null && _c !== void 0 ? _c : aclRule.guest)
                    : aclRule.guest
                : !query.guest && ctx.userRole
                    ? query.mine
                        ? aclRule.mine
                        : ((_e = (_d = aclRule[ctx.userRole]) !== null && _d !== void 0 ? _d : aclRule.mine) !== null && _e !== void 0 ? _e : aclRule.all)
                    : aclRule.guest;
            if (!aclSelector) {
                return (0, router_1.json)({
                    error: "Resource forbidden",
                }, {
                    status: router_1.Status._403_Forbidden,
                });
                // throw new HttpError("Resource forbidden", 403);
            }
            if (query.findFirst != null &&
                aclEntry.findFirst != null &&
                query.findFirst !== aclEntry.findFirst) {
                return (0, router_1.json)({
                    error: query.findFirst
                        ? "find first forbidden by ACL"
                        : "find many forbidden by ACL",
                }, {
                    status: router_1.Status._403_Forbidden,
                });
                // throw new HttpError(
                //   query.findFirst
                //     ? "find first forbidden by ACL"
                //     : "find many forbidden by ACL",
                //   403,
                // );
            }
            ctx.dontPluralize = (_f = aclEntry.dontPluralize) !== null && _f !== void 0 ? _f : defaults === null || defaults === void 0 ? void 0 : defaults.dontPluralize;
            ctx.findFirst = (_g = aclEntry.findFirst) !== null && _g !== void 0 ? _g : query.findFirst;
            const tableId = aclEntry.table || resourceId;
            const selector = {};
            deepCombine(selector, tableId, ctx, aclSelector, select, aclEntry.maxLimit, aclEntry.maxDepth);
            const formatResult = (_h = aclEntry.formatResult) !== null && _h !== void 0 ? _h : defaultResultFormatter;
            try {
                const result = yield database.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a, _b;
                    ctx.tx = tx;
                    if (aclSelector.beforeQuery) {
                        yield aclSelector.beforeQuery(ctx);
                    }
                    const table = schema[tableId];
                    const columns = selector.columns;
                    const extras = selector.extras;
                    const selecting = columns === undefined ||
                        (typeof columns === "object" &&
                            Object.keys(columns).length > 0) ||
                        (typeof extras === "object" && Object.keys(extras).length > 0);
                    const result = {
                        rows: null,
                    };
                    if (selecting) {
                        result.rows = ctx.findFirst
                            ? yield tx.query[tableId].findFirst(selector)
                            : yield tx.query[tableId].findMany(selector);
                    }
                    else {
                        const count = yield tx.$count(table, selector.where &&
                            selector.where(table, exports.operators));
                        const offset = (_a = selector.offset) !== null && _a !== void 0 ? _a : 0;
                        const limit = selector.limit;
                        result.count = limit
                            ? Math.min(limit, count - offset)
                            : count - offset;
                    }
                    const includeTotal = (_b = query.includeTotal) !== null && _b !== void 0 ? _b : aclEntry.includeTotal;
                    if (includeTotal) {
                        const table = schema[tableId];
                        const total = yield tx.$count(table, aclSelector.where && aclSelector.where(ctx, table, exports.operators));
                        result.total = total;
                    }
                    if (aclSelector.afterQuery) {
                        yield aclSelector.afterQuery(ctx);
                    }
                    return result;
                }));
                ctx.result = result;
                const res = formatResult(req, ctx);
                return res instanceof Response ? res : (0, router_1.status)(router_1.Status._204_NoContent);
            }
            catch (error) {
                if (aclSelector.onQueryError) {
                    const res = yield aclSelector.onQueryError(error instanceof Error ? error : new Error(String(error)), ctx);
                    if (res instanceof Response) {
                        return res;
                    }
                }
                throw error;
            }
        }
        catch (error) {
            onError && onError(error);
            return (0, router_1.json)({
                error: error.message || "Something went wrong",
            }, {
                status: error.status || router_1.Status._500_InternalServerError,
            });
        }
    });
    //
    ///// HEAD
    //
    routes.HEAD = routes.GET;
    //
    ///// POST
    //
    routes.POST = (req, _ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const resourceId = req.params[idParam];
            const url = new URL(req.url);
            const query = TPostQuery(Object.fromEntries(url.searchParams.entries()));
            if (query instanceof arktype_1.ArkErrors) {
                // throw new HttpError(query.toString(), Status._400_BadRequest);
                return (0, router_1.json)({
                    error: query.toString() || "Something went wrong",
                }, {
                    status: router_1.Status._400_BadRequest,
                });
            }
            const ctx = {
                url,
                query,
                body: undefined,
                resourceId,
            };
            {
                const res = (0, router_1.parseBody)({
                    accept: ["application/json", "application/x-www-form-urlencoded"],
                    maxSize: 4 * 1024 * 1024,
                })(req, ctx);
                if (res instanceof Response) {
                    return res;
                }
            }
            // PARSE SESSION AND AUTHENTICATE
            {
                const res = yield parseAuth(req, ctx);
                if (res instanceof Response) {
                    return res;
                }
            }
            const { select } = query;
            const aclEntry = acl &&
                acl[resourceId];
            if (aclEntry == null) {
                return (0, router_1.json)({
                    error: "Resource not found",
                }, {
                    status: router_1.Status._404_NotFound,
                });
                // throw new HttpError("Resource not found", Status._404_NotFound);
            }
            const aclRule = aclEntry.control.POST;
            if (aclRule == null) {
                return (0, router_1.json)({
                    error: "ACL rule not defined for the method",
                }, {
                    status: router_1.Status._404_NotFound,
                });
                // throw new HttpError(
                //   "ACL rule not defined for the method",
                //   Status._404_NotFound,
                // );
            }
            const aclSelector = query["mine|guest"]
                ? ctx.userRole
                    ? ((_b = (_a = aclRule[ctx.userRole]) !== null && _a !== void 0 ? _a : aclRule.mine) !== null && _b !== void 0 ? _b : aclRule.all)
                    : aclRule.guest
                : !query.guest && ctx.userRole
                    ? query.mine
                        ? aclRule.mine
                        : ((_d = (_c = aclRule[ctx.userRole]) !== null && _c !== void 0 ? _c : aclRule.mine) !== null && _d !== void 0 ? _d : aclRule.all)
                    : aclRule.guest;
            if (!aclSelector) {
                return (0, router_1.json)({
                    error: "Resource forbidden",
                }, {
                    status: router_1.Status._403_Forbidden,
                });
                // throw new HttpError("Resource forbidden", 403);
            }
            ctx.dontPluralize = (_e = aclEntry.dontPluralize) !== null && _e !== void 0 ? _e : defaults === null || defaults === void 0 ? void 0 : defaults.dontPluralize;
            const tableId = aclEntry.table || resourceId;
            const selector = {};
            deepCombine(selector, tableId, ctx, aclSelector, select, aclEntry.maxLimit, aclEntry.maxDepth);
            const formatResult = (_f = aclEntry.formatResult) !== null && _f !== void 0 ? _f : defaultResultFormatter;
            try {
                const result = yield database.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    ctx.tx = tx;
                    let body = ctx.body;
                    const validateBody = aclSelector.validateBody;
                    const injectBody = aclSelector.injectBody;
                    if (validateBody != null) {
                        if (Array.isArray(body)) {
                            for (let i = 0; i < body.length; i++) {
                                const vb = yield validateBody(body[i], ctx);
                                if (vb instanceof arktype_1.ArkErrors) {
                                    throw new HttpError(vb.toString(), router_1.Status._400_BadRequest);
                                    // throw vb;
                                }
                                body[i] = vb;
                            }
                        }
                        else {
                            const vb = yield validateBody(body, ctx);
                            if (vb instanceof arktype_1.ArkErrors) {
                                throw new HttpError(vb.toString(), router_1.Status._400_BadRequest);
                                // throw vb;
                            }
                            body = vb;
                        }
                    }
                    if (injectBody != null) {
                        if (Array.isArray(body)) {
                            for (let i = 0; i < body.length; i++) {
                                const vb = yield injectBody(body[i], ctx);
                                if (vb != null)
                                    body[i] = vb;
                            }
                        }
                        else {
                            const vb = yield injectBody(body, ctx);
                            if (vb != null)
                                body = vb;
                        }
                    }
                    ctx.body = body;
                    if (aclSelector.beforeQuery) {
                        yield aclSelector.beforeQuery(ctx);
                    }
                    const table = schema[tableId];
                    let columns;
                    // get cached columns selector
                    if (selector.columnsSelector) {
                        columns = selector.columnsSelector;
                    }
                    else if (selector.columns) {
                        columns = {};
                        for (const [key, selectColumn] of Object.entries(selector.columns)) {
                            if (selectColumn)
                                columns[key] = table[key];
                        }
                        selector.columnsSelector = columns;
                    }
                    const result = { rows: null };
                    if (columns && Object.keys(columns).length > 0) {
                        result.rows = yield tx
                            .insert(table)
                            .values(ctx.body)
                            .returning(columns);
                        result.count = result.rows.length;
                    }
                    else {
                        const info = yield tx.insert(table).values(ctx.body);
                        result.rowsAffected = info.rowsAffected;
                    }
                    const includeTotal = (_a = query.includeTotal) !== null && _a !== void 0 ? _a : aclEntry.includeTotal;
                    if (includeTotal) {
                        const table = schema[tableId];
                        const total = yield tx.$count(table, aclSelector.where && aclSelector.where(ctx, table, exports.operators));
                        result.total = total;
                    }
                    if (aclSelector.afterQuery) {
                        yield aclSelector.afterQuery(ctx);
                    }
                    return result;
                }));
                ctx.result = result;
                const res = formatResult(req, ctx);
                return res instanceof Response ? res : (0, router_1.status)(router_1.Status._204_NoContent);
            }
            catch (error) {
                if (aclSelector.onQueryError) {
                    const res = yield aclSelector.onQueryError(error instanceof Error ? error : new Error(String(error)), ctx);
                    if (res instanceof Response) {
                        return res;
                    }
                }
                throw error;
            }
        }
        catch (error) {
            onError && onError(error);
            return (0, router_1.json)({
                error: error.message || "Something went wrong",
            }, {
                status: error.status || router_1.Status._500_InternalServerError,
            });
        }
    });
    //
    ///// PATCH
    //
    routes.PATCH = (req, _ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const resourceId = req.params[idParam];
            const url = new URL(req.url);
            const query = TPatchQuery(Object.fromEntries(url.searchParams.entries()));
            if (query instanceof arktype_1.ArkErrors) {
                // throw new HttpError(query.toString(), Status._400_BadRequest);
                return (0, router_1.json)({
                    error: query.toString() || "Something went wrong",
                }, {
                    status: router_1.Status._400_BadRequest,
                });
            }
            const ctx = {
                url,
                query,
                body: undefined,
                resourceId,
            };
            {
                const res = (0, router_1.parseBody)({
                    accept: ["application/json", "application/x-www-form-urlencoded"],
                    maxSize: 4 * 1024 * 1024,
                })(req, ctx);
                if (res instanceof Response) {
                    return res;
                }
            }
            // PARSE SESSION AND AUTHENTICATE
            {
                const res = yield parseAuth(req, ctx);
                if (res instanceof Response) {
                    return res;
                }
            }
            const { select } = query;
            const aclEntry = acl &&
                acl[resourceId];
            if (aclEntry == null) {
                return (0, router_1.json)({
                    error: "Resource not found",
                }, {
                    status: router_1.Status._404_NotFound,
                });
                // throw new HttpError("Resource not found", Status._404_NotFound);
            }
            const aclRule = aclEntry.control.PATCH;
            if (aclRule == null) {
                return (0, router_1.json)({
                    error: "ACL rule not defined for the method",
                }, {
                    status: router_1.Status._404_NotFound,
                });
                // throw new HttpError(
                //   "ACL rule not defined for the method",
                //   Status._404_NotFound,
                // );
            }
            const aclSelector = query["mine|guest"]
                ? ctx.userRole
                    ? ((_b = (_a = aclRule[ctx.userRole]) !== null && _a !== void 0 ? _a : aclRule.mine) !== null && _b !== void 0 ? _b : aclRule.all)
                    : aclRule.guest
                : !query.guest && ctx.userRole
                    ? query.mine
                        ? aclRule.mine
                        : ((_d = (_c = aclRule[ctx.userRole]) !== null && _c !== void 0 ? _c : aclRule.mine) !== null && _d !== void 0 ? _d : aclRule.all)
                    : aclRule.guest;
            if (!aclSelector) {
                return (0, router_1.json)({
                    error: "Resource forbidden",
                }, {
                    status: router_1.Status._403_Forbidden,
                });
                // throw new HttpError("Resource forbidden", 403);
            }
            ctx.dontPluralize = (_e = aclEntry.dontPluralize) !== null && _e !== void 0 ? _e : defaults === null || defaults === void 0 ? void 0 : defaults.dontPluralize;
            const tableId = aclEntry.table || resourceId;
            const selector = {};
            deepCombine(selector, tableId, ctx, aclSelector, select, aclEntry.maxLimit, aclEntry.maxDepth);
            const formatResult = (_f = aclEntry.formatResult) !== null && _f !== void 0 ? _f : defaultResultFormatter;
            try {
                const result = yield database.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    ctx.tx = tx;
                    let body = ctx.body;
                    const validateBody = aclSelector.validateBody;
                    const injectBody = aclSelector.injectBody;
                    if (validateBody != null) {
                        const vb = yield validateBody(body, ctx);
                        if (vb instanceof arktype_1.ArkErrors) {
                            throw new HttpError(vb.toString(), router_1.Status._400_BadRequest);
                            // throw vb;
                        }
                        body = vb;
                    }
                    if (injectBody != null) {
                        const vb = yield injectBody(body, ctx);
                        if (vb != null)
                            body = vb;
                    }
                    ctx.body = body;
                    if (aclSelector.beforeQuery) {
                        yield aclSelector.beforeQuery(ctx);
                    }
                    const table = schema[tableId];
                    let columns;
                    // get cached columns selector
                    if (selector.columnsSelector) {
                        columns = selector.columnsSelector;
                    }
                    else if (selector.columns) {
                        columns = {};
                        for (const [key, selectColumn] of Object.entries(selector.columns)) {
                            if (selectColumn)
                                columns[key] = table[key];
                        }
                        selector.columnsSelector = columns;
                    }
                    const result = { rows: null };
                    if (columns && Object.keys(columns).length > 0) {
                        result.rows = yield tx
                            .update(table)
                            .set(ctx.body)
                            .where(selector.where &&
                            selector.where(table, exports.operators))
                            .returning(columns);
                    }
                    else {
                        const info = yield tx
                            .update(table)
                            .set(ctx.body)
                            .where(selector.where &&
                            selector.where(table, exports.operators));
                        result.rowsAffected = info.rowsAffected;
                    }
                    const includeTotal = (_a = query.includeTotal) !== null && _a !== void 0 ? _a : aclEntry.includeTotal;
                    if (includeTotal) {
                        const table = schema[tableId];
                        const total = yield tx.$count(table, aclSelector.where && aclSelector.where(ctx, table, exports.operators));
                        result.total = total;
                    }
                    if (aclSelector.afterQuery) {
                        yield aclSelector.afterQuery(ctx);
                    }
                    return result;
                }));
                ctx.result = result;
                const res = formatResult(req, ctx);
                return res instanceof Response ? res : (0, router_1.status)(router_1.Status._204_NoContent);
            }
            catch (error) {
                if (aclSelector.onQueryError) {
                    const res = yield aclSelector.onQueryError(error instanceof Error ? error : new Error(String(error)), ctx);
                    if (res instanceof Response) {
                        return res;
                    }
                }
                throw error;
            }
        }
        catch (error) {
            onError && onError(error);
            return (0, router_1.json)({
                error: error.message || "Something went wrong",
            }, {
                status: error.status || router_1.Status._500_InternalServerError,
            });
        }
    });
    //
    ///// DELETE
    //
    routes.DELETE = (req, _ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const resourceId = req.params[idParam];
            const url = new URL(req.url);
            const query = TDeleteQuery(Object.fromEntries(url.searchParams.entries()));
            if (query instanceof arktype_1.ArkErrors) {
                // throw new HttpError(query.toString(), Status._400_BadRequest);
                return (0, router_1.json)({
                    error: query.toString() || "Something went wrong",
                }, {
                    status: router_1.Status._400_BadRequest,
                });
            }
            const ctx = {
                url,
                query,
                resourceId,
            };
            // PARSE SESSION AND AUTHENTICATE
            {
                const res = yield parseAuth(req, ctx);
                if (res instanceof Response) {
                    return res;
                }
            }
            const { select } = query;
            const aclEntry = acl &&
                acl[resourceId];
            if (aclEntry == null) {
                return (0, router_1.json)({
                    error: "Resource not found",
                }, {
                    status: router_1.Status._404_NotFound,
                });
                // throw new HttpError("Resource not found", Status._404_NotFound);
            }
            const aclRule = aclEntry.control.DELETE;
            if (aclRule == null) {
                return (0, router_1.json)({
                    error: "ACL rule not defined for the method",
                }, {
                    status: router_1.Status._404_NotFound,
                });
                // throw new HttpError(
                //   "ACL rule not defined for the method",
                //   Status._404_NotFound,
                // );
            }
            const aclSelector = query["mine|guest"]
                ? ctx.userRole
                    ? ((_b = (_a = aclRule[ctx.userRole]) !== null && _a !== void 0 ? _a : aclRule.mine) !== null && _b !== void 0 ? _b : aclRule.all)
                    : aclRule.guest
                : !query.guest && ctx.userRole
                    ? query.mine
                        ? aclRule.mine
                        : ((_d = (_c = aclRule[ctx.userRole]) !== null && _c !== void 0 ? _c : aclRule.mine) !== null && _d !== void 0 ? _d : aclRule.all)
                    : aclRule.guest;
            if (!aclSelector) {
                return (0, router_1.json)({
                    error: "Resource forbidden",
                }, {
                    status: router_1.Status._403_Forbidden,
                });
                // throw new HttpError("Resource forbidden", 403);
            }
            ctx.dontPluralize = (_e = aclEntry.dontPluralize) !== null && _e !== void 0 ? _e : defaults === null || defaults === void 0 ? void 0 : defaults.dontPluralize;
            const tableId = aclEntry.table || resourceId;
            const selector = {};
            deepCombine(selector, tableId, ctx, aclSelector, select, aclEntry.maxLimit, aclEntry.maxDepth);
            const formatResult = (_f = aclEntry.formatResult) !== null && _f !== void 0 ? _f : defaultResultFormatter;
            try {
                const result = yield database.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    ctx.tx = tx;
                    if (aclSelector.beforeQuery) {
                        yield aclSelector.beforeQuery(ctx);
                    }
                    const table = schema[tableId];
                    let columns;
                    // get cached columns selector
                    if (selector.columnsSelector) {
                        columns = selector.columnsSelector;
                    }
                    else if (selector.columns) {
                        columns = {};
                        for (const [key, selectColumn] of Object.entries(selector.columns)) {
                            if (selectColumn)
                                columns[key] = table[key];
                        }
                        selector.columnsSelector = columns;
                    }
                    const result = { rows: null };
                    if (columns == null ||
                        (typeof columns == "object" && Object.keys(columns).length > 0)) {
                        result.rows = yield tx
                            .delete(table)
                            .where(selector.where &&
                            selector.where(table, exports.operators))
                            .returning(columns);
                    }
                    else {
                        const info = yield tx
                            .delete(table)
                            .where(selector.where &&
                            selector.where(table, exports.operators));
                        result.rowsAffected = info.rowsAffected;
                    }
                    const includeTotal = (_a = query.includeTotal) !== null && _a !== void 0 ? _a : aclEntry.includeTotal;
                    if (includeTotal) {
                        const table = schema[tableId];
                        const total = yield tx.$count(table, aclSelector.where && aclSelector.where(ctx, table, exports.operators));
                        result.total = total;
                    }
                    if (aclSelector.afterQuery) {
                        yield aclSelector.afterQuery(ctx);
                    }
                    return result;
                }));
                ctx.result = result;
                const res = formatResult(req, ctx);
                return res instanceof Response ? res : (0, router_1.status)(router_1.Status._204_NoContent);
            }
            catch (error) {
                if (aclSelector.onQueryError) {
                    const res = yield aclSelector.onQueryError(error instanceof Error ? error : new Error(String(error)), ctx);
                    if (res instanceof Response) {
                        return res;
                    }
                }
                throw error;
            }
        }
        catch (error) {
            onError && onError(error);
            return (0, router_1.json)({
                error: error.message || "Something went wrong",
            }, {
                status: error.status || router_1.Status._500_InternalServerError,
            });
        }
    });
    return routes;
};
exports.createQueryRouter = createQueryRouter;
//# sourceMappingURL=query.js.map