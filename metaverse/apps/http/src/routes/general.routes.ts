import { Router } from "express";
import { getAllAvatars, getAllElements, signIn, signUp } from "../controllers/general.controller";

const generalRoutes = Router();

generalRoutes.post('/signup', signUp);  //, signUp
generalRoutes.post('/signin', signIn);
generalRoutes.get('/elements', getAllElements);
generalRoutes.get('/avatars', getAllAvatars);

export { generalRoutes }