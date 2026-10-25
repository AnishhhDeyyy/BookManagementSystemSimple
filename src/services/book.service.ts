import { prisma } from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { createBookInput } from "../validators/book.validator";
import { updateBookInput } from "../validators/updatebook.validator";
import { publishNotification } from "./notification.service";

export async function createBookService(input: createBookInput) {
    
    const book = await prisma.book.create({
        data: {
            description: input.description!,
            author: input.author,
            title: input.title,
            publishedAt: input.publishedAt!
        }
    })
    try{
        await publishNotification(
            "New Book Created",
            `A New Book "${book.title}" by ${book.author} has been added`
        );
    }catch(err){
        console.log("Failed to publish book",err);
        
    }
    return book;
}

export async function getBookByIdService(id: string) {
    const book = await prisma.book.findUnique({
        where:{
            id: id
        },
        select:{
            id: true,
            author: true,
            description: true,
            title: true
        }
    })
    return book;
}

export async function getAllBookService(page: number,limit: number) {
    const skip = (page - 1) * limit;
    const [books,totalBooks] = await Promise.all(
        [
            await prisma.book.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                select:{
                    author: true,
                    description: true,
                    title: true,
                    publishedAt: true
                }
            }),

            await prisma.book.count()
        ]
    )
    return {
        books,
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalBooks,
            totalPages: Math.ceil(totalBooks/limit)
        }
    }
}

export async function getUpdateTheBookService(id: string, input: updateBookInput) {
    const existingBook = await prisma.book.findUnique({
        where:{id : id}
    },
)
    if(!existingBook){
        throw new HttpError(404,"Book is not found");
    }

    const updateBooks = await prisma.book.update({
        where: {id : id},
        data: {...(input.author !== undefined && {author: input.author}),
            ... (input.description !== undefined && {description : input.description}),
            ... (input.title!== undefined && {title : input.title}),        

        },
        select:{
            id: true,
            author: true,
            description: true,
            title: true
        }
    })
    return updateBooks;
}

export async function deleteBookService(id: string) {
    console.log("ID",id);
    
    const isBookExists = await prisma.book.findUnique(
        {
            where: {
                id: id
            }
        }
    )
    if(!isBookExists){
        throw new HttpError(400,"Book is not exists");
    }
    await prisma.book.delete(
        {
            where:{
                id: id
            }
        }
    )
}