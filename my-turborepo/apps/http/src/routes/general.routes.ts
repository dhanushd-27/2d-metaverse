import { Router } from "express";

const generalRoutes = Router();

generalRoutes.post('/signup');  //, signUp
generalRoutes.post('/signin')

export { generalRoutes }