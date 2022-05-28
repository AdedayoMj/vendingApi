"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accesscontrol_1 = require("accesscontrol");
const ac = new accesscontrol_1.AccessControl();
exports.roles = (function () {
    ac.grant('buyer')
        .readAny('profile')
        .updateOwn('updateUser')
        .createAny('buy');
    ac.grant('seller')
        .readAny("profile")
        .createOwn()
        .updateOwn("profile")
        .deleteOwn("profile");
    return ac;
})();
//# sourceMappingURL=role.js.map