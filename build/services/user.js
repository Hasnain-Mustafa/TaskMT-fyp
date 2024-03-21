"use strict";
//---User Service---//
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
exports.findUserById = exports.createUser = void 0;
const node_crypto_1 = require("node:crypto");
const db_1 = require("../lib/db");
const generateHash = (salt, password) => {
    const hashedPassword = (0, node_crypto_1.createHmac)('sha256', salt)
        .update(password)
        .digest('hex');
    return hashedPassword;
};
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, isManager } = payload;
    const salt = (0, node_crypto_1.randomBytes)(32).toString('hex');
    const hashedPassword = generateHash(salt, password);
    return db_1.prismaClient.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            isManager,
            salt,
        },
    });
});
exports.createUser = createUser;
const findUserById = (id) => {
    return db_1.prismaClient.user.findUnique({
        where: { id },
    });
};
exports.findUserById = findUserById;
