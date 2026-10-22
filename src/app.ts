import express from "express";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "./config/prisma";
import { errorHandler } from "./middlewares/error.middleware";
import userrouter from "./routes/user.routes";
import bookrouter from "./routes/book.routes";
const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json())

app.use("/api/users",userrouter)
app.use("/api/book",bookrouter)
app.get("/api/health",(_req,_res)=>{
    _res.status(200).json({
        success: true,
        message: "Yeah it is running"
    })
})

app.get("/api/db-health",async(req,res)=>{
    try{
        await prisma.$queryRaw `SELECT 1`;
        res.status(200).json({
              success: true,
              message: "Database connection successful",
        })
    }catch(err){
        console.error("Database health check failed",err);
        res.status(500).json({
            success: false,
            message: "Database helath check failed"
        })
        
    }
})

app.use(errorHandler);
export default app;