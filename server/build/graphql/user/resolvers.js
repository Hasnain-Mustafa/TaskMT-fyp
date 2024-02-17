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
exports.resolvers = void 0;
const userService_1 = require("../../services/userService");
const queries = {
    generateUserToken: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield (0, userService_1.generateUserToken)(payload);
        return token;
    }),
    getCurrentLoggedInUser: (_, parameters, context) => __awaiter(void 0, void 0, void 0, function* () {
        if (context && context.user) {
            const id = context.user.id;
            const user = (0, userService_1.gertUserById)(id);
            return user;
        }
    }),
};
const mutations = {
    signUpUser: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, userService_1.signUpUser)(payload);
        return res.id;
    }),
};
exports.resolvers = { queries, mutations };
