import { Request, Response, NextFunction } from "express";
import jwt_decode from "jwt-decode";


const verifyRoles = (...allowedRoles: any[]) => {

    return async (req: any, res: Response, next: NextFunction) => {
        let token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt_decode(token);
        let { role }: any = decoded;

        if (!role) return res.status(401).json({
            message: 'Role not provided'
        });

        const rolesArray = [...allowedRoles]


        const result = [role].map((role: any) => rolesArray.includes(role)).find((val: boolean) => val === true)

        if (!result) return res.status(401).json({
            message: "Unauthorized access"
        })

        next()
    }


}

export default verifyRoles