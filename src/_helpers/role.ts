import {AccessControl} from 'accesscontrol'


const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant('buyer')
 .readAny('profile')
 .updateOwn('updateUser')
 .createAny('buy')
 
ac.grant('seller')
 .readAny("profile")
 .createOwn()
 .updateOwn("profile")
 .deleteOwn("profile")

 
return ac;
})();