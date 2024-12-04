import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middleware";
import { addElement, createSpace, deleteSpace, getAllSpaces, getSpace, removeElement } from "../controllers/space.controller";

const spaceRoutes = Router();

spaceRoutes.post('/', userMiddleware, createSpace);
spaceRoutes.delete('/:spaceId', userMiddleware, deleteSpace);
spaceRoutes.get('/all'), userMiddleware, getAllSpaces;

// arena routes
// anyone can see your space or you can see anyone's space with spaceid
spaceRoutes.get('/:spaceId', getSpace);
spaceRoutes.post('/element', userMiddleware, addElement);
spaceRoutes.delete('/element', userMiddleware, removeElement);

export { spaceRoutes }