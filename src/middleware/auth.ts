import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export interface AuthRequest extends Request{
    user? : {
        userId : number
    }
}

const jwt_secret : any = process.env.JWT_SECRET

export function requireAuth(req : AuthRequest, res : Response, next : NextFunction){
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({ message: "Access token required" })
    }

    jwt.verify(token, jwt_secret, (err: any, user:any)=>{
        if(err){
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = user
        next()
    })

}