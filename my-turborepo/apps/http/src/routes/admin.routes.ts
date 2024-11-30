import { Router } from "express";

const adminRoutes = Router();

// add admin middlewares
adminRoutes.post('/element');
adminRoutes.put('/element/:elementId');
adminRoutes.post('/avatar');
adminRoutes.post('/map');

export { adminRoutes }