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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gertUserById = exports.getUserByEmail = exports.decodeJWTToken = exports.generateUserToken = exports.signUpUser = void 0;
const node_crypto_1 = require("node:crypto");
const db_1 = require("../lib/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = String(process.env.JWT_Secre);
const generateHash = (salt, password) => {
    const hashedPassword = (0, node_crypto_1.createHmac)('sha256', salt)
        .update(password)
        .digest('hex');
    return hashedPassword;
};
// User Signup
const signUpUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.signUpUser = signUpUser;
//Gnerating JWT Token for User
const generateUserToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield (0, exports.getUserByEmail)(email);
    if (!user)
        throw new Error('User not found');
    const userSalt = user.salt;
    const hashedPassword = generateHash(userSalt, password);
    if (hashedPassword !== user.password)
        throw new Error('Invalid Password');
    // Generating Token
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '10s',
    });
    return token;
});
exports.generateUserToken = generateUserToken;
const decodeJWTToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.decodeJWTToken = decodeJWTToken;
const getUserByEmail = (email) => {
    return db_1.prismaClient.user.findUnique({
        where: { email },
    });
};
exports.getUserByEmail = getUserByEmail;
const gertUserById = (id) => {
    return db_1.prismaClient.user.findUnique({
        where: { id },
    });
};
exports.gertUserById = gertUserById;
