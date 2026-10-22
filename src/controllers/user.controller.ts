import { RequestHandler } from "express";
import type { RegisterTypeInput } from "../validators/user.validator";
import type { UpdateUserInput } from "../validators/updateuser.validator";
import { deleteUserByIdService, getAllUserService, getUserById, loginService, registerUserService, updateUserByIdService } from "../services/user.service";
import type { LoginInput } from "../validators/login.validator";

export const registerUser: RequestHandler<{}, {}, RegisterTypeInput> = async (req, res, next) => {

    try {
        const user = await registerUserService(req.body);
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: user
        })
    } catch (error) {
        next(error);
    }

}

export const getByUserId: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        console.log("USER",user);
        
        res.status(200).json({
            success: true,
            message: "User Data Fetched Successfully",
            data: user
        })
    } catch (error) {
        next(error);
    }
}

export const getAllUser: RequestHandler = async (req, res, next) => {
    try {
        // const user = 
        console.log("HELLLLLLLLLLLL>................");
        
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        if (
            !Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100
        ) {
            res.status(400).json({
                success: false,
                message: "Page must be a positive integer and limit must be between 1 and 100",
            });
            return;
        }
        const result = await getAllUserService(page,limit);
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result.user,
            pagination: result.pagination
        })
    } catch (error) {
        next(error);
    }
}

export const updateUserById: RequestHandler<{id: string},{},UpdateUserInput>  = async(req,res,next) => {
    try{
        const user = await updateUserByIdService(req.params.id,req.body);
         res.status(200).json({
            success: true,
            message: "User Data Fetched Successfully",
            data: user
        })
    }catch(error){
        next(error);
    }
}

export const deleteUserById: RequestHandler<{id: string}> = async(req,res,next) => {
     try{
        await deleteUserByIdService(req.params.id);
         res.status(200).json({
            success: true,
            message: "User Data Deleted Successfully",
            // data: user
        })
    }catch(error){
        next(error);
    }
}

export const login: RequestHandler<{},{},LoginInput> = async(req,res,next) => {
    try{
        const user = await loginService(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: user
        });
    }catch(error){
        next(error);
    }
}