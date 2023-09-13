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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetcher = void 0;
const axios_1 = __importDefault(require("axios"));
function fetcherImpl(args) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {};
        if (args.body !== undefined && args.contentType != null) {
            headers["Content-Type"] = args.contentType;
        }
        if (args.headers != null) {
            for (const [key, value] of Object.entries(args.headers)) {
                if (value != null) {
                    headers[key] = value;
                }
            }
        }
        try {
            const response = yield (0, axios_1.default)({
                url: args.url,
                params: args.queryParameters,
                method: args.method,
                headers,
                data: args.body,
                validateStatus: () => true,
                transformResponse: (response) => response,
                timeout: args.timeoutMs,
                transitional: {
                    clarifyTimeoutError: true,
                },
                withCredentials: args.withCredentials,
                adapter: args.adapter,
                onUploadProgress: args.onUploadProgress,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                responseType: (_a = args.responseType) !== null && _a !== void 0 ? _a : "json",
            });
            let body;
            if (args.responseType === "blob") {
                body = response.data;
            }
            else if (response.data != null && response.data.length > 0) {
                try {
                    body = (_b = JSON.parse(response.data)) !== null && _b !== void 0 ? _b : undefined;
                }
                catch (_c) {
                    return {
                        ok: false,
                        error: {
                            reason: "non-json",
                            statusCode: response.status,
                            rawBody: response.data,
                        },
                    };
                }
            }
            if (response.status >= 200 && response.status < 400) {
                return {
                    ok: true,
                    body: body,
                };
            }
            else {
                return {
                    ok: false,
                    error: {
                        reason: "status-code",
                        statusCode: response.status,
                        body,
                    },
                };
            }
        }
        catch (error) {
            if (error.code === "ETIMEDOUT") {
                return {
                    ok: false,
                    error: {
                        reason: "timeout",
                    },
                };
            }
            return {
                ok: false,
                error: {
                    reason: "unknown",
                    errorMessage: error.message,
                },
            };
        }
    });
}
exports.fetcher = fetcherImpl;
