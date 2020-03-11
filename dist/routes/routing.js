"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_route_1 = __importDefault(require("./user.route"));
var post_route_1 = __importDefault(require("./post.route"));
var AppRouter = express_1.Router();
AppRouter.use(user_route_1.default);
AppRouter.use(post_route_1.default);
exports.default = AppRouter;
