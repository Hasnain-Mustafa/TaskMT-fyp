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
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./graphql/index"));
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const userService_1 = require("./services/userService");
const cronJob_1 = require("./services/cronJob");
const PORT = Number(process.env.PORT) || 3000;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        app.use('/graphql', (0, express4_1.expressMiddleware)(yield (0, index_1.default)(), {
            context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                const token = req.headers['authorization'];
                try {
                    if (token) {
                        const user = (0, userService_1.decodeJWTToken)(token);
                        return { user };
                    }
                }
                catch (error) {
                    console.log(error);
                }
                return {}; // Return an empty object if no user is found or there's an error
            }),
        }));
        (0, cronJob_1.startCronJobs)();
        app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
    });
}
startServer();
