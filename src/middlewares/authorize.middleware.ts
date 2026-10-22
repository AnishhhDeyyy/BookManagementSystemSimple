import type { RequestHandler } from "express";

const ROLES = ["USER", "ADMIN"] as const;

type Role = (typeof ROLES)[number];

export const authorizeRoles = (
    ...allowedRoles: Role[]
): RequestHandler => {
    return (req, res, next) => {
        if (!req.auth) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        const userRole = req.auth.role;

        if (!ROLES.includes(userRole as Role)) {
            res.status(403).json({
                success: false,
                message: "Invalid user role",
            });
            return;
        }

        if (!allowedRoles.includes(userRole as Role)) {
            res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
            return;
        }

        next();
    };
};