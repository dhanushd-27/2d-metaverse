import { Router } from "express";

const adminRoutes = Router();

// add admin middlewares
adminRoutes.post('/api/v1/admin/element');
adminRoutes.put('/api/v1/admin/element/:elementId');
adminRoutes.post('/api/v1/admin/avatar');
adminRoutes.post('/api/v1/admin/map');