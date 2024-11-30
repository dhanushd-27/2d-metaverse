import { Router } from "express";

const arenaRoutes = Router();

arenaRoutes.get('/api/v1/space/:spaceId');
arenaRoutes.post('/api/v1/space/element');
arenaRoutes.delete('/api/v1/space/element');
arenaRoutes.get('/api/v1/elements');