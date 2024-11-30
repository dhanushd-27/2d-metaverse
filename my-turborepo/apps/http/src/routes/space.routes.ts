import { Router } from "express";

const spaceRoutes = Router();

spaceRoutes.post('/');
spaceRoutes.delete('/:spaceId');
spaceRoutes.get('/all');

// arena routes
spaceRoutes.get('/:spaceId');
spaceRoutes.post('/element');
spaceRoutes.delete('/element');

export { spaceRoutes }