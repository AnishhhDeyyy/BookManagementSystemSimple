import { RequestHandler } from "express";
import {z} from "zod";

export function validateBody(schema: z.ZodType): RequestHandler {
    return (req,_res,next) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            next(result.error);
            return;
        }

        req.body = result.data;
        next();
    }
}