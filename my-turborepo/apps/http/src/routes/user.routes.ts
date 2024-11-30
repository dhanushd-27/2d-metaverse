import { Router } from "express";

const userRoutes = Router();

userRoutes.post('/api/v1/user/metadata');
userRoutes.get('/api/v1/avatars');
userRoutes.get('/api/v1/user/metadata/bulk/:ids');