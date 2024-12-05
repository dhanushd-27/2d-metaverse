import { Request, Response } from "express";
import { addElementSchema, createSpaceSchema, deleteElementSchema } from "../types/types";
import client from '@repo/db/client';

// make changes bhai - done, Learnt about transaction
export const createSpace = async (req: Request, res: Response ) => {
  const parsedData = createSpaceSchema.safeParse(req.body);
  const creatorId = req.userId as string;

  if(!parsedData.success){
    res.status(400).json({
      message: "Invalid Data"
    })

    return
  }

  if(!parsedData.data?.mapId && !parsedData.data?.dimensions){
    res.status(400).json({
      message: "Cannot create space without dimensions and mapId"
    })

    return
  }

  if(!parsedData.data?.mapId && parsedData.data?.dimensions){
    try {
      const dimensions = parsedData.data?.dimensions.split('x') as string[];
  
      const createSpace = await client.space.create({
        data: {
          name: parsedData.data?.name as string,
          creatorId: creatorId,
          width: parseInt(dimensions[0]),
          height: parseInt(dimensions[1]),
        }
      })
  
      res.status(200).json({
        spaceId: createSpace.id
      })

      return;

    } catch (error) {
      res.status(500).json({
        message: "DataBase error, could not create Space",
      });

      return;
    }
  }

  const map = await client.map.findFirst({
    where: {
      id: parsedData.data?.mapId
    }, select: {
      mapElements: true,
      height: true,
      width: true,
    }
  })

  if(!map){
    res.status(400).json({
      message: "Map is not found"
    })
    return
  }

  const createSpaceResponse = await client.$transaction( async (client) => {
    const space = await client.space.create({
      data: {
        name: parsedData.data?.name as string,
        height: map?.height as number,
        width: map?.width as number,
        creatorId: req.userId as string
      }
    });

    await client.spaceElements.createMany({
      data: map.mapElements.map(e => ({
          spaceId: space.id,
          elementId: e.elementId,
          x: e.x!,
          y: e.y!
      }))
    })

    return space;
  })

  res.status(200).json({
    spaceId: createSpaceResponse.id
  })
}

// ask harshit
export const deleteSpace = async (req: Request, res: Response) => {
  const spaceId = req.params.spaceId as string;
  const userId = req.userId as string;

  try {
    const response = await client.space.findUnique({
      where: {
        id: spaceId
      }, select: {
        creatorId: true
      }
    })

    if(!response){
      res.status(400).json({
        message: "space doesn't exist with this space id"
      });
      
      return;
    }

    if(response?.creatorId !== userId){
      res.status(403).json({
        message: "Unauthorized User"
      })

      return;
    }

    await client.space.delete({
      where: {
        id: spaceId
      }
    });

    res.status(200).json({
      message: "Space deleted successful"
    })

  } catch (error) {
    res.status(400).json({
      message: "Couldn't find the space to be deleted"
    })
    return
  }
}

export const getAllSpaces = async (req: Request, res: Response) => {
  const userId = req.userId as string;

  const spaces = await client.space.findMany({
    where: {
      creatorId: userId
    }
  })

  console.log(spaces);

  res.status(200).json({
    spaces: spaces.map((s) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail,
      dimensions: `${s.width}x${s.height}`
    }))
  })
}

export const getSpace = async (req: Request, res: Response) => {
  const spaceId = req.params.spaceId;
  
  if(!spaceId){
    res.status(401).json({
      message: "invalid data input"
    })

    return;
  }

  const spaces = await client.space.findUnique({
    where: {
      id: spaceId as string
    },
    include: {
      SpaceElements: {
        include: {
          element: true
        }
      }
    }
  });

  if(!spaces){
    res.status(400).json({
      message: "Space not found"
    })

    return
  }

  res.status(200).json({
    dimensions: `${spaces?.width}x${spaces?.height}`,
    elements: spaces?.SpaceElements.map((e)=> ({
      id: e.id,
      element: {
        id: e.element.id,
        imageUrl: e.element.imageUrl,
        width: e.element.width,
        height: e.element.height,
        static: e.element.static
      },
    }))
  })
}

export const addElement = async (req: Request, res: Response) => {
  const parsedData = addElementSchema.safeParse(req.body);
  const userId = req.userId as string

  if(!parsedData.success){
    res.status(401).json({
      message: "Invalid data"
    });

    return;
  }

  // get the max height and width of the space - it will avoid you to add the element outside the map
  const space = await client.space.findUnique({
    where: {
      id: parsedData.data.spaceId,
      creatorId: userId
    }, select: {
      width: true,
      height: true
    }
  })

  if(parsedData.data.x < 0 || parsedData.data.y < 0 || parsedData.data.x > (space?.width as number) || parsedData.data.y > (space?.height as number)){
    res.status(400).json({
      message: "element position out of bound"
    })

    return
  }

  if(!space){
    res.status(400).json({
      message: "Space doesn't exists"
    })

    return
  }

  const response = await client.spaceElements.create({
    data: {
      spaceId: parsedData.data.spaceId,
      elementId: parsedData.data.elementId,
      x: parsedData.data.x,
      y: parsedData.data.y
    }
  });

  const getSpaceEle = await client.spaceElements.findMany({
    where: {
      spaceId: parsedData.data.spaceId
    }
  });

  res.status(200).json({
    message: "Element added",
    elements: getSpaceEle
  })
}

export const removeElement = async (req: Request, res: Response) => {

  const parsedData = deleteElementSchema.safeParse(req.body);

  if(!parsedData.success){
    res.status(400).json({
      message: "Invalid Input",
      parsedData: parsedData.data
    })

    return
  }

  const spaceElement = await client.spaceElements.findFirst({
    where: {
      id: parsedData.data?.id
    }, include: {
      space: true,
    }
  })

  if(!spaceElement){
    res.status(403).json({message: "Space element not found"})
    return
  }

  if (spaceElement.space.creatorId !== req.userId) {
    console.log(spaceElement.space.creatorId);
    console.log(req.userId)

    res.status(403).json({message: "You are not the creator"})
    return
  }

  await client.spaceElements.delete({
      where: {
          id: parsedData.data?.id
      }
  })
  res.status(200).json(
    {message: "Element deleted"}
  );
}