import { Router } from "express";

const generalRoutes = Router();

generalRoutes.post('/signup');  //, signUp
generalRoutes.post('/signin');
generalRoutes.get('/elements', (req, res) => {
    res.send("Hello TurboRepo");
});
generalRoutes.get('/avatars');

export { generalRoutes }