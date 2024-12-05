import { Request, Response } from "express";
import { updateMetadataSchema } from "../types/types";
import client from '@repo/db/client';

export const updateMetadata = async (req: Request, res: Response) => {

  // parseData
  const parsedData = updateMetadataSchema.safeParse(req.body);
  const userId: string = req.userId as string;

  if(!parsedData.success){
    res.status(422).json({
      message: "Unsupported Entity"
    })

    return;
  }

  try {
    // check whether avatar id exists or not
    const isValid = await client.avatar.findUnique({
      where: {
        id: parsedData.data.avatarId
      }
    })
  
    if(!isValid){
      res.status(400).json({
        message: "Avatar Id Doesn't exist"
      })

      return
    }
  
    // update content if avatar id exists
    const updateAvatarId = await client.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarId: parsedData.data.avatarId
      }
    })
    
    res.status(200).json({
      message: "Avatar Updated Successfully",
      data: updateAvatarId
    })

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    })
  }
}

export const getMetadataOfUsers = async (req: Request, res: Response) => {
  const ids = req.query.ids as string;
  // slice and split to convert a string to array of elements
  // "[1,2,3,44]" -> ["1", "2", "3", "44"]
  const idsArr = ids.slice(1, ids.length - 1).split(',');

  try {
    const metadata = await client.user.findMany({
      where: {
        id: {
          in: idsArr
        }
      }, select: {
        id: true,
        avatar: true
      }
    })
  
    res.status(200).json({
      /* Summary:
        {} inside the arrow function body means you need a return statement.
        () around the object means the object is returned implicitly (no return needed).
      */
      avatars: metadata.map((m) => ({
        id: m.id,
        imageUrl: m.avatar?.imageUrl
      }))
    })
  } catch (error) {
    res.status(400).json({
      message: "Cannot fetch User metadata",
    });
    return;
  }
}