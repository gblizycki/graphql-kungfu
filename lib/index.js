"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tools_1 = require("graphql-tools");
var graphql_upload_1 = require("graphql-upload");
var stream = __importStar(require("stream"));
var apollo_server_core_1 = require("apollo-server-core");
var apollo_server_env_1 = require("apollo-server-env");
var graphql_playground_middleware_lambda_1 = __importDefault(require("graphql-playground-middleware-lambda"));
var graphql_deduplicator_1 = require("graphql-deduplicator");
var graphql_middleware_1 = require("graphql-middleware");
var defaultOptions = {
    uploads: {
        maxFieldSize: 1000000,
        maxFileSize: 2000000,
        maxFiles: 4
    },
    endpoint: '/graphql',
    deduplicator: true
};
var GraphQLServerLambda = (function () {
    function GraphQLServerLambda(props) {
        var _this = this;
        this.graphqlHandler = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
            var apolloContext, _a, e_1, formatResponse, contentType, query, request, response, _b, graphqlResponse, responseInit, error_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        if (!(typeof this.context === 'function')) return [3, 2];
                        return [4, this.context({ event: event, context: context })];
                    case 1:
                        _a = _c.sent();
                        return [3, 3];
                    case 2:
                        _a = this.context;
                        _c.label = 3;
                    case 3:
                        apolloContext = _a;
                        return [3, 5];
                    case 4:
                        e_1 = _c.sent();
                        console.error(e_1);
                        throw e_1;
                    case 5:
                        formatResponse = function (event) {
                            return function (response) {
                                var _a;
                                var args = [];
                                for (var _i = 1; _i < arguments.length; _i++) {
                                    args[_i - 1] = arguments[_i];
                                }
                                if (_this.options.deduplicator &&
                                    event.headers &&
                                    event.headers['X-GraphQL-Deduplicate'] &&
                                    response.data &&
                                    !response.data.__schema) {
                                    response.data = graphql_deduplicator_1.deflate(response.data);
                                }
                                return _this.options.formatResponse
                                    ? (_a = _this.options).formatResponse.apply(_a, [response].concat(args)) : response;
                            };
                        };
                        contentType = event.headers['content-type'] || event.headers['Content-Type'];
                        if (!(event.body && contentType.startsWith('application/json'))) return [3, 6];
                        query = JSON.parse(event.body);
                        return [3, 9];
                    case 6:
                        if (!(event.body && contentType.startsWith('multipart/form-data'))) return [3, 8];
                        request = new stream.Readable();
                        response = new stream.Writable();
                        request.push(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'ascii'));
                        request.push(null);
                        request.headers = event.headers;
                        request.headers['content-type'] = contentType;
                        return [4, graphql_upload_1.processRequest(request, response, this.options.uploads)];
                    case 7:
                        query = _c.sent();
                        return [3, 9];
                    case 8:
                        query = event.queryStringParameters;
                        _c.label = 9;
                    case 9:
                        _c.trys.push([9, 11, , 12]);
                        return [4, apollo_server_core_1.runHttpQuery([event, context], {
                                method: event.httpMethod,
                                options: {
                                    schema: this.executableSchema,
                                    context: apolloContext,
                                    formatError: this.options.formatError,
                                    formatResponse: formatResponse(event),
                                    debug: this.options.debug,
                                    tracing: this.options.tracing
                                },
                                query: query,
                                request: {
                                    url: event.path,
                                    method: event.httpMethod,
                                    headers: new apollo_server_env_1.Headers(event.headers)
                                }
                            })];
                    case 10:
                        _b = _c.sent(), graphqlResponse = _b.graphqlResponse, responseInit = _b.responseInit;
                        return [2, {
                                body: graphqlResponse,
                                statusCode: 200,
                                headers: responseInit.headers
                            }];
                    case 11:
                        error_1 = _c.sent();
                        if ('HttpQueryError' !== error_1.name) {
                            return [2, error_1];
                        }
                        return [2, {
                                body: error_1.message,
                                statusCode: error_1.statusCode,
                                headers: error_1.headers
                            }];
                    case 12: return [2];
                }
            });
        }); };
        this.playgroundHandler = function (event, lambdaContext, callback) {
            graphql_playground_middleware_lambda_1.default({
                endpoint: _this.options.endpoint
            })(event, lambdaContext, callback);
        };
        this.options = __assign({}, defaultOptions, props.options),
            this.context = props.context;
        if (props.schema) {
            this.executableSchema = props.schema;
        }
        else if (props.typeDefs && props.resolvers) {
            var typeDefs = props.typeDefs, resolvers = props.resolvers;
            this.executableSchema = graphql_tools_1.makeExecutableSchema({
                typeDefs: typeDefs,
                resolvers: resolvers
            });
        }
        if (props.middlewares) {
            var schema = graphql_middleware_1.applyMiddleware.apply(void 0, [this.executableSchema].concat(props.middlewares)).schema;
            this.executableSchema = schema;
        }
    }
    return GraphQLServerLambda;
}());
exports.GraphQLServerLambda = GraphQLServerLambda;
//# sourceMappingURL=index.js.map