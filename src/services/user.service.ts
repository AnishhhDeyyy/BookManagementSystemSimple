import { prisma } from "../config/prisma";
import { LoginInput } from "../validators/login.validator";
import { UpdateUserInput } from "../validators/updateuser.validator";
import { RegisterTypeInput } from "../validators/user.validator";
import { HttpError } from "../utils/http-error";
import { generateAccessToken } from "../utils/jwt";
import bcrypt from "bcrypt"
import { jwt } from "zod";
export async function registerUserService(input: RegisterTypeInput) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: input.email
        }
    });
    if (existingUser) {
        throw new HttpError(409, "Email is already registered");
    }
    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            phone: input.phone,
            role: input.role
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true
        }
    })
    return user;
}

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true
        }
    },
    );
    if (!user) {
        throw new HttpError(404, "User not found");
    }
    return user;

}
export async function getAllUserService(page: number, limit: number) {
    console.log("GETTETETE.............");

    const skip = (page - 1) * limit;
    const [user, totalUsers] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true
            }
        }),
        prisma.user.count()
    ])

    return {
        user,
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit)
        }
    }

}
export async function updateUserByIdService(id: string, input: UpdateUserInput) {

    const checkIsUserExist = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    if (!checkIsUserExist) {
        throw new HttpError(404, "User not found");
    }
    const user = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            ...(input.name !== undefined && { name: input.name }),
            ...(input.email !== undefined && { email: input.email })
        },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true
        }
    })
    return user;
}

export async function deleteUserByIdService(id: string) {

    const checkIsUserExist = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    if (!checkIsUserExist) {
        throw new HttpError(404, "User not found");
    }
    const result = await prisma.user.deleteMany({
        where: {
            id: id
        }
    })

    if (result.count === 0) {
        throw new HttpError(404, "User not found");
    }
}

export async function loginService(input: LoginInput) {
    const user = await prisma.user.findUnique({
        where:{
            email: input.email
        }
    })
    const password = user?.password;
    if(!user){
        throw new HttpError(401, "Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
    )
    if(!isPasswordValid){
        throw new HttpError(401, "Invalid email or password");
    }
    const userId = user.id;
    const role = user.role;
    const accessToken = generateAccessToken({userId,role});
    return {
       id: user.id,
       email: user.email,
       name: user.name,
       phone: user.phone,
       role: user.role,
       accessToken: generateAccessToken({
           userId: user.id,
           role: user.role
       })

    };
}