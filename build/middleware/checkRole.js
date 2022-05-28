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
const { roles } = require('../_helpers/role');
const checkRole = function (action, resource) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let { role } = req.body;
            const permission = roles.can(role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You dont have enough permision to perform this action"
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = checkRole;
//# sourceMappingURL=checkRole.js.map