import { RequestHandler } from "express";
import { createBookInput } from "../validators/book.validator";
import { prisma } from "../config/prisma";
import { createBookService, deleteBookService, getAllBookService, getBookByIdService, getUpdateTheBookService } from "../services/book.service";
import { updateBookInput } from "../validators/updatebook.validator";

export const createBook: RequestHandler<{},{},createBookInput> = async(req,res,next) => {
    try{
        const book = await createBookService(req.body);
        res.status(201).json({
            success: true,
            message: "Book Created Successfully",
            data: book
        })
    }catch(err){
        next(err);
    }
}

export const getBookById: RequestHandler<{id: string}> = async(req,res,next) => {
    try{
        const book = await getBookByIdService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Book Details Fetched Successfully",
            data: book
        })

    }catch(err){
        next(err);
    }
}

export const getBookAll: RequestHandler = async(req,res,next) => {
    try{
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const books = await getAllBookService(page,limit);
        return res.status(200).json({
            success: true,
            message: "All Book Details Fetched Successfully",
            data: books
        })
    }catch(error){
        next(error);
    }
}

export const updateTheBook : RequestHandler<{id: string}, {}, updateBookInput> = async(req,res,next) => {
    try{
        const updatedBook = await getUpdateTheBookService(req.params.id,req.body);
        return res.status(200).json({
            success: true,
            message: "Book Updated Successfully",
            data: updatedBook
        })
    }catch(error){
        next(error);
    }
}

export const deleteTheBook : RequestHandler<{id: string}> = async(req,res,next) => {
    try{
        await deleteBookService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Book Deleted Successfully",
        
        })
    }catch(error){
        next(error);
    }
}