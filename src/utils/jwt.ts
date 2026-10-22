import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "15m";

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not configured")
}

function parseJwtDuration(value: string): number {
    const match = /^([1-9]\d*)(s|m|h|d|w|y)$/.exec(value);
    if (!match) {
        throw new Error("JWT_EXPIRES_IN must be a duration such as 15m or 1h");
    }

    const amount = Number(match[1]);
    const unitToSeconds = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 24 * 60 * 60,
        w: 7 * 24 * 60 * 60,
        y: 365 * 24 * 60 * 60,
    };

    return amount * unitToSeconds[match[2] as keyof typeof unitToSeconds];
}

const JWT_EXPIRES_IN_SECONDS = parseJwtDuration(JWT_EXPIRES_IN);

export interface JwtPayload {
    userId: string,
    role: string
}

export const generateAccessToken = (payload: JwtPayload): string => {
   return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN_SECONDS
   });
}