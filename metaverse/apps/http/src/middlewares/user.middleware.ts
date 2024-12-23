import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];
  if(!token){
    console.log(header);
    res.status(403).json({
      message: "Unauthorized"
    })

    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(403).json({
      message: "Unauthorized"
    })
  }
}