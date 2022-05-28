"use strict";
// import { Request, Response, NextFunction } from "express";
// import IUser from '../interfaces/user';
// import { getRepository } from "typeorm";
// const checkRole = (roles: Array<string>) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//       //Get the user ID from previous midleware
//       const id = res.locals.jwtPayload.userId;
//       //Get user role from the database
//       const userRepository = getRepository(IUser);
//       let user: IUser;
//       try {
//         user = await userRepository.findOneOrFail(id);
//       } catch (id) {
//         res.status(401).send();
//       }
//       //Check if array of authorized roles includes the user's role
//       if (roles.indexOf(user) > -1) next();
//       else res.status(401).send();
//     };
//   };
//   export default checkRole;
//# sourceMappingURL=checkRole.js.map