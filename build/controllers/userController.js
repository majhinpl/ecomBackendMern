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
const userModel_1 = __importDefault(require("../database/models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                res.status(400).json({
                    message: "please provide username, email, password",
                });
                return;
            }
            // Check if email or username already exists
            const [existingUser] = yield userModel_1.default.findAll({
                where: {
                    email: email,
                },
            });
            if (existingUser) {
                res.status(400).json({
                    message: "Email or username already exists",
                });
                return;
            }
            // if email and username are unique, create the user
            yield userModel_1.default.create({
                username,
                email,
                password: bcrypt_1.default.hashSync(password, 9),
            });
            res.status(200).json({
                message: "User register successfully",
            });
        });
    }
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    message: "please provide email, password",
                });
                return;
            }
            // check if user exist or not.
            const [data] = yield userModel_1.default.findAll({
                where: {
                    email: email,
                },
            });
            if (!data) {
                res.status(404).json({
                    message: "user not found!",
                });
                return;
            }
            // check password
            const isMatched = bcrypt_1.default.compareSync(password, data.password);
            if (!isMatched) {
                res.status(403).json({
                    message: "Invalid credentials",
                });
                return;
            }
            // generate token and send to user
            const token = jsonwebtoken_1.default.sign({ id: data.id }, "process.env.JWT_SECRET", {
                expiresIn: "20d",
            });
            res.status(200).json({
                message: "login Successfully",
                data: token,
            });
        });
    }
}
exports.default = AuthController;
