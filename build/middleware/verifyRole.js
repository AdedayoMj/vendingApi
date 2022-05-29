"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const verifyRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        var _a;
        let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const decoded = (0, jwt_decode_1.default)(token);
        let { role } = decoded;
        if (!role)
            return res.status(401).json({
                message: 'Role not provided'
            });
        const rolesArray = [...allowedRoles];
        const result = [role].map((role) => rolesArray.includes(role)).find((val) => val === true);
        if (!result)
            return res.status(401).json({
                message: "Unauthorized access"
            });
        next();
    };
};
exports.default = verifyRoles;
//# sourceMappingURL=verifyRole.js.map