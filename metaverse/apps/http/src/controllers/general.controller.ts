import { Request, Response } from "express"
import { SigninSchema, SignupSchema } from "../types/types"
import jwt from "jsonwebtoken"
import client from "@repo/db/client"

export const signUp = async (req: Request, res: Response) => {
    const parsedData = SignupSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({
            message: "Input Validation Failed",
            body: req.body
        })
        return
    }

    try {
        
        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: parsedData.data.password,
                role: parsedData.data.role === 'admin' ? "Admin" : "User"
            }
        })

        res.status(200).json({
            userId: user.id
        })
    } catch (error) {
        console.log(error);
        

        res.status(403).json({
            message: "User Already Exists"
        })
    }
}

export const signIn = async (req: Request, res: Response) => {

    const parsedData = SigninSchema.safeParse(req.body);
    
    if(!parsedData.success){
        res.status(400).json({
            message: "Input Validation Failed",
            body: req.body
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
            console.log(parsedData.data);
            
            res.status(404).json({
                message: "User Not Found",
                
            })
            return;
        }

        let isValid = false;
        if(user.password == parsedData.data.password){
            isValid = true;
        }
        
        if(!isValid){
            res.status(403).json({
                message: "Unauthorized User"
            })
            return;
        }

        const token = jwt.sign({
            id: user.id,
            username: parsedData.data.username,
            role: user.role
        }, process.env.JWT_SECRET as string)

        res.status(200).json({
            message: "Sign In Successfull",
            token
        })
    } catch (error) {
        
        res.status(500).json({
            message: "Server is Down"
        })
    }
}

export const getAllElements = async (req: Request, res: Response) => {
    
    const allElements = await client.element.findMany();

    res.json({elements: allElements.map(e => ({
        id: e.id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static
    }))})
}

export const getAllAvatars = async (req: Request, res: Response) => {
    const allAvatars = await client.avatar.findMany();

    res.json({avatars: allAvatars.map(x => ({
        id: x.id,
        imageUrl: x.imageUrl,
        name: x.name
    }))})
}