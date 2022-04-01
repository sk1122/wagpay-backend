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
const prisma_1 = __importDefault(require("../../../prisma"));
class UserController extends prisma_1.default {
    constructor() {
        super(...arguments);
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).send(res.locals.user);
        });
        this.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let userId = req.params.id;
            let user;
            try {
                user = yield this.prisma.user.findFirst({
                    where: {
                        id: userId,
                    },
                });
                res.status(200).send(user);
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
        });
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let userData = req.body;
            try {
                let user = yield this.prisma.user.create({
                    data: userData,
                });
                console.log(user);
                res.status(200).send(user);
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userBody = req.body;
            let updatedUser;
            try {
                updatedUser = yield this.prisma.user.update({
                    where: {
                        id: res.locals.user.id,
                    },
                    data: userBody,
                });
                res.status(201).send(updatedUser);
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.query.id;
            try {
                yield this.prisma.user.delete({
                    where: {
                        id: userId,
                    },
                });
                res.status(204).send({
                    data: "user deleted",
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
        });
    }
}
exports.default = UserController;
