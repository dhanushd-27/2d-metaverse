import { Router } from "express";
import { signIn, signUp } from "../controllers/general";

const generalRoutes = Router();

generalRoutes.post('/signup', signUp);  //, signUp
generalRoutes.post('/signin', signIn);
generalRoutes.get('/elements', (req, res) => {
    res.send("Hello TurboRepo");
});
generalRoutes.get('/avatars');

export { generalRoutes }