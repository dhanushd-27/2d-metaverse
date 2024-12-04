import { Request, Response } from "express";
import {  createAvatarSchema, createElementSchema, createMapSchema, updateElementSchema } from "../types/types";
import client from '@repo/db/client';

export const addElement = async (req: Request, res: Response) => {
  const parsedData = createElementSchema.safeParse(req.body);

  if(!parsedData.success){
    res.status(401).json({
      message: "Invalid Data Input"
    })

    return;
  }

  try {
    const createElementResponse = await client.element.create({
      data: {
        imageUrl: parsedData.data.imageUrl,
        static: parsedData.data.static,
        height: parsedData.data.height,
        width: parsedData.data.width
      }
    })

    res.status(200).json({
      id: createElementResponse.id
    })
  } catch (error) {
    res.status(500).json({
      message: "Could communicate with the database"
    })
  }
}

export const updateElement = async (req: Request, res: Response) => {
  const parseData = updateElementSchema.safeParse(req.body);
  const adminId = req.userId as string;

  if(!parseData.success){
    res.status(400).json({
      message: "Invalid Data Input"
    })
    return;
  }

  try {
    await client.element.update({
      where: {
        id: adminId
      },
      data: {
        imageUrl: parseData.data.imageUrl
      }
    })
  
    res.status(200).json({
      message: "Element Updated Successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: "Couldn't communicate with the database"
    })
  }
}

export const createAvatar = async (req: Request, res: Response) => {
  const parsedData = createAvatarSchema.safeParse(req.body);

  if(!parsedData.success){
    res.status(400).json({
      message: "Invalid data input"
    })

    return
  }

  try {
    await client.avatar.create({
      data: {
        imageUrl: parsedData.data.imageUrl,
        name: parsedData.data.name
      }
    })

    res.status(200).json({
      message: "Avatar created successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: "Couldn't communicate with the database"
    })
  }
}

export const createMap = async(req: Request, res: Response) => {
  const parsedData = createMapSchema.safeParse(req.body);

  if(!parsedData.success){
    res.status(400).json({
      message: "Invalid Data Input"
    });

    return;
  }

  try {
    const createMapResponse = await client.map.create({
      data: {
        name: parsedData.data.name,
        thumbnail: parsedData.data.thumbnail,
        height: parseInt(parsedData.data.dimensions.split('x')[1]),
        width: parseInt(parsedData.data.dimensions.split('x')[0]),
        mapElements: {
          create: parsedData.data.defaultElements.map((e) => ({
            elementId: e.elementId,
            x: e.x,
            y: e.y
          }))
        }
      }
    });

    res.status(200).json({
      id: createMapResponse.id
    })
  } catch (error) {
    res.status(500).json({
      message: "Couldn't communicate with the database"
    });

    return;
  }
}