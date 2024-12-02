import { Router } from "express";

const userRoutes = Router();

userRoutes.post('/metadata');
userRoutes.get('/metadata/bulk/:ids');

export { userRoutes }