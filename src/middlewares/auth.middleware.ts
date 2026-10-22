import { RequestHandler } from "express";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT TOKEN  is not configured");
}

interface AuthPayload extends jwt.JwtPayload {
    userId: string,
    role: string
}

export const authenticate: RequestHandler = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer")) {
            res.status(401).json({
                success: false,
                message: "Access Token is not Valid"
            })
            return;
        }
        const token = authHeader?.split(" ")[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access token is required",
            })
            return;
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string" || typeof decoded.userId !== "string" || typeof decoded.role !== "string") {
            res.status(401).json({
                success: false,
                message: "Invalid access token payload",
            });
            return;
        }
        const payload: AuthPayload = {
            ...decoded,
            userId: decoded.userId,
            role: decoded.role
        }
        req.auth = {
        userId: payload.userId,
        role: payload.role,
        };
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });

    }
}