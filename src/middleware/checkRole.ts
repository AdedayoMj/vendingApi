

import { Request, Response, NextFunction } from "express";
const {roles} = require('../_helpers/role')

const checkRole = function(action: string | number, resource: any){
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let { role} = req.body;
            const permission = roles.can(role)[action](resource)
            if(!permission.granted){
                return res.status(401).json({
                    error: "You dont have enough permision to perform this action"
                })
            }
            next()
            
        } catch (error) {
            next(error)
            
        }

    }
    
}

export default checkRole;
