"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuery = exports.BepaloQuery = void 0;
const rjson_1 = require("@bepalo/rjson");
class BepaloQuery {
    constructor() { }
    Get(options) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(options)) {
            params.set(k, rjson_1.RJSON.stringify(v));
        }
        return params;
    }
    Post(options) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(options)) {
            params.set(k, rjson_1.RJSON.stringify(v));
        }
        return params;
    }
    Patch(options) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(options)) {
            params.set(k, rjson_1.RJSON.stringify(v));
        }
        return params;
    }
    Delete(options) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(options)) {
            params.set(k, rjson_1.RJSON.stringify(v));
        }
        return params;
    }
}
exports.BepaloQuery = BepaloQuery;
const createQuery = () => new BepaloQuery();
exports.createQuery = createQuery;
//# sourceMappingURL=client.js.map