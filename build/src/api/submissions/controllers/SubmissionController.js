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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../../prisma"));
function isNumeric(str) {
    if (typeof str != "string")
        return false; // we only process strings!  
    // @ts-ignore
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}
class SubmissionController extends prisma_1.default {
    constructor() {
        super(...arguments);
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = {};
            Object.keys(req.query).map(value => { if (isNumeric(req.query[value]) && value !== 'cursor')
                data[value] = Number(req.query[value]); });
            var page_ids = [];
            var submissions = [];
            try {
                page_ids = yield this.prisma.pages.findMany({
                    take: 20,
                    skip: 1,
                    cursor: {
                        id: Number(req.query.cursor)
                    },
                    select: {
                        submissions: {
                            include: {
                                page: {
                                    select: {
                                        slug: true,
                                        id: true,
                                        title: true
                                    }
                                },
                                products: {
                                    select: {
                                        name: true,
                                        discounted_price: true
                                    }
                                }
                            }
                        }
                    },
                    where: {
                        userId: res.locals.user.id
                    }
                });
                if (!page_ids)
                    throw "Go Down Bitches";
                submissions = page_ids.map(value => value.submissions).flat();
            }
            catch (e) {
                console.log(e, "dsa");
                page_ids = yield this.prisma.pages.findMany({
                    take: 20,
                    select: {
                        submissions: {
                            include: {
                                page: {
                                    select: {
                                        slug: true,
                                        id: true,
                                        title: true
                                    }
                                },
                                products: {
                                    select: {
                                        name: true,
                                        discounted_price: true
                                    }
                                }
                            }
                        }
                    },
                    where: {
                        userId: res.locals.user.id
                    }
                });
                if (!page_ids) {
                    res.status(400).send({
                        error: "Submissions not found",
                        status: 400
                    });
                    return;
                }
                console.log(page_ids, "page_ids");
                try {
                    submissions = page_ids.map(value => value.submissions).flat();
                }
                catch (e) {
                    console.log(e, "Dasdsadsasad");
                    res.status(400).send({
                        error: e,
                        status: 400
                    });
                    return;
                }
            }
            const return_data = {
                cursor: submissions[submissions.length - 1].id,
                data: [submissions]
            };
            res.status(200).send(return_data);
        });
        this.getTotalEarned = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const total_earned = yield this.prisma.submission.aggregate({
                _sum: {
                    total_prices: true
                },
                where: {
                    page: {
                        userId: res.locals.user.id
                    }
                }
            });
            if (!total_earned) {
                res.status(400).send({
                    error: "Can't calculate",
                    status: 400
                });
                return;
            }
            res.status(200).send(total_earned);
        });
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let submissionData = req.body;
            var submission;
            try {
                submission = yield this.prisma.submission.create({
                    data: Object.assign({}, submissionData)
                });
            }
            catch (e) {
                console.log(e);
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(201).send(submission);
        });
        this.batch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const pageData = req.body;
            var submissions;
            try {
                submissions = yield this.prisma.submission.createMany({
                    data: pageData
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(201).send(submissions);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { id } = _a, submissionData = __rest(_a, ["id"]);
            var submission;
            try {
                submission = yield this.prisma.submission.update({
                    where: {
                        id: id
                    },
                    data: submissionData
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(200).send(submission);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            var submission;
            try {
                submission = yield this.prisma.submission.delete({
                    where: {
                        id: Number(id)
                    }
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(204).send(submission);
        });
    }
}
exports.default = SubmissionController;
