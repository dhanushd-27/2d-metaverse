import { Router } from "express";

const spaceRoutes = Router();

spaceRoutes.post('/api/v1/space');
spaceRoutes.delete('/api/v1/space/:spaceId');
spaceRoutes.get('/api/v1/space/all');