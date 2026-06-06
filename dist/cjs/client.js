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
exports.createQueryClient = exports.BepaloQueryClient = exports.createQueryBuilder = exports.BepaloQueryBuilder = exports.encodeURIComponentRJSON = void 0;
const rjson_1 = require("@bepalo/rjson");
const URI_CC0 = "&".charCodeAt(0);
const URI_CC1 = "=".charCodeAt(0);
const URI_CC2 = "#".charCodeAt(0);
const URI_CC3 = "%".charCodeAt(0);
const URI_CC4 = "+".charCodeAt(0);
const URI_CC5 = "?".charCodeAt(0);
const uriCodes = new Array(64).fill("");
uriCodes[URI_CC0] = "%26";
uriCodes[URI_CC1] = "%3D";
uriCodes[URI_CC2] = "%23";
uriCodes[URI_CC3] = "%25";
uriCodes[URI_CC4] = "%2B";
uriCodes[URI_CC5] = "%3F";
Object.freeze(uriCodes);
const encodeURIComponentRJSON = (uri) => {
    var _a;
    if (uri === "")
        return uri;
    let parts = undefined;
    let left = 0;
    let right = 0;
    // first match to initialize 'parts'
    for (; !parts && right < uri.length; right++) {
        const charCode = uri.charCodeAt(right);
        switch (charCode) {
            case URI_CC0:
            case URI_CC1:
            case URI_CC2:
            case URI_CC3:
            case URI_CC4:
            case URI_CC5:
                parts = [];
                parts.push(uri.slice(left, right));
                parts.push((_a = uriCodes[charCode]) !== null && _a !== void 0 ? _a : "");
                left = right + 1;
                break;
        }
    }
    // second match: parts is already allocated.
    // no need to check every iteration.
    if (parts) {
        for (; right < uri.length; right++) {
            const charCode = uri.charCodeAt(right);
            switch (charCode) {
                case URI_CC0:
                case URI_CC1:
                case URI_CC2:
                case URI_CC3:
                case URI_CC4:
                case URI_CC5:
                    parts.push(uri.slice(left, right));
                    parts.push(uriCodes[charCode]);
                    left = right + 1;
                    break;
            }
        }
    }
    if (!parts) {
        return uri;
    }
    if (left < uri.length) {
        parts.push(uri.slice(left));
    }
    return parts.join("");
    // return uri.replace(/[&=#%+?]/g, (m) => uriCodes[m.charCodeAt(0)] ?? m);
};
exports.encodeURIComponentRJSON = encodeURIComponentRJSON;
class BepaloQueryBuilder {
    constructor() { }
    Get(options) {
        const params = new Map();
        if (options) {
            for (const [k, v] of Object.entries(options)) {
                params.set(k, (0, exports.encodeURIComponentRJSON)(rjson_1.RJSON.stringify(v)));
            }
        }
        return params;
    }
    Post(options) {
        const params = new Map();
        if (options) {
            for (const [k, v] of Object.entries(options)) {
                params.set(k, (0, exports.encodeURIComponentRJSON)(rjson_1.RJSON.stringify(v)));
            }
        }
        return params;
    }
    Patch(options) {
        const params = new Map();
        if (options) {
            for (const [k, v] of Object.entries(options)) {
                params.set(k, (0, exports.encodeURIComponentRJSON)(rjson_1.RJSON.stringify(v)));
            }
        }
        return params;
    }
    Delete(options) {
        const params = new Map();
        if (options) {
            for (const [k, v] of Object.entries(options)) {
                params.set(k, (0, exports.encodeURIComponentRJSON)(rjson_1.RJSON.stringify(v)));
            }
        }
        return params;
    }
}
exports.BepaloQueryBuilder = BepaloQueryBuilder;
const createQueryBuilder = () => new BepaloQueryBuilder();
exports.createQueryBuilder = createQueryBuilder;
class BepaloQueryClient {
    constructor(baseUrl = typeof location !== "undefined" ? location.origin : "") {
        this.queryBuilder = (0, exports.createQueryBuilder)();
        try {
            new URL("/", baseUrl);
        }
        catch (_a) {
            throw new Error(`[QueryClient] Invalid baseUrl '${baseUrl}'`);
        }
        this.baseUrl = baseUrl;
    }
    _fetch(url, init) {
        return fetch(url, init).then((response) => __awaiter(this, void 0, void 0, function* () {
            if (response.ok) {
                const res = yield response.json();
                return res;
            }
            else {
                const res = yield response.json();
                throw new Error(`(${response.status}: ${response.statusText}) ${(res === null || res === void 0 ? void 0 : res.error) || "Query Server Error"}`);
            }
        }));
    }
    _appendSearchAndGetURL(_url, params) {
        const queryParams = [];
        for (const [k, v] of params) {
            queryParams.push(`${k}=${v}`);
        }
        const url = new URL(_url, this.baseUrl);
        const query = queryParams.join("&");
        const search = `${url.search ? url.search + "&" : "?"}${query}`;
        const murl = `${url.origin}${url.pathname}${search}${url.hash}`;
        return murl;
    }
    /////////////////////////////////////////////////////////////////////////k
    Get(url, options, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.queryBuilder.Get(options);
            const murl = this._appendSearchAndGetURL(url, params);
            return yield this._fetch(murl, Object.assign(Object.assign({}, init), { method: "get" }));
        });
    }
    GetFirst(url, options, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.queryBuilder.Get(Object.assign(Object.assign({}, options), { findFirst: true }));
            const murl = this._appendSearchAndGetURL(url, params);
            return yield this._fetch(murl, Object.assign(Object.assign({}, init), { method: "get" }));
        });
    }
    GetMany(url, options, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.queryBuilder.Get(options);
            const murl = this._appendSearchAndGetURL(url, params);
            return yield this._fetch(murl, Object.assign(Object.assign({}, init), { method: "get" }));
        });
    }
    Post(url, options, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.queryBuilder.Post(options);
            const murl = this._appendSearchAndGetURL(url, params);
            return yield this._fetch(murl, Object.assign(Object.assign({}, init), { method: "post" }));
        });
    }
    Patch(url, options, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.queryBuilder.Patch(options);
            const murl = this._appendSearchAndGetURL(url, params);
            return yield this._fetch(murl, Object.assign(Object.assign({}, init), { method: "patch" }));
        });
    }
    Delete(url, options, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.queryBuilder.Delete(options);
            const murl = this._appendSearchAndGetURL(url, params);
            return yield this._fetch(murl, Object.assign(Object.assign({}, init), { method: "delete" }));
        });
    }
}
exports.BepaloQueryClient = BepaloQueryClient;
const createQueryClient = (baseUrl = typeof location !== "undefined" ? location.origin : "") => new BepaloQueryClient(baseUrl);
exports.createQueryClient = createQueryClient;
//# sourceMappingURL=client.js.map