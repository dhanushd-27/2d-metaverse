import { Router } from "express";
import { getMetadataOfUsers, updateMetadata } from "../controllers/user.controller";
import { userMiddleware } from "../middlewares/user.middleware";

const userRoutes = Router();

userRoutes.put('/metadata', userMiddleware, updateMetadata);
userRoutes.get('/metadata/bulk',getMetadataOfUsers);

export { userRoutes }