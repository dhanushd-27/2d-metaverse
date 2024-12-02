import { Request, Response } from "express"
import { SigninSchema, SignupSchema } from "../types/types"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import client from '@repo/db/client'

export const signUp = async (req: Request, res: Response) => {
    const parsedData = SignupSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({
            message: "Input Validation Failer"
        })
        return
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 5)

    try {
        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.role === 'admin' ? "Admin" : "User"
            }
        })

        res.status(200).json({
            userId: user.id
        })
    } catch (error) {
        res.status(400).json({
            message: "User Already Exists"
        })
    }
}

export const signIn = async (req: Request, res: Response) => {

    const parsedData = SigninSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({
            message: "Input Validation Failer"
        })
        return
    }

    try {
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })

        if(!user){
            res.status(400).json({
                message: "User Not Found"
            })
            return;
        }

        const isValid = await bcrypt.compare(parsedData.data.password, user.password);

        if(!isValid){
            res.status(403).json({
                message: "Unauthorized User"
            })
            return;
        }

        const token = jwt.sign({
            id: user.id,
            username: parsedData.data.username
        }, process.env.JWT_SECRET as string)

        res.status(200).json({
            message: "Sign Up Successfull",
            token
        })
    } catch (error) {
        
        res.status(500).json({
            message: "Server is Down"
        })
    }
}