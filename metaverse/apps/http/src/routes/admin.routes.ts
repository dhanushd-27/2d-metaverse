import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { createAvatar, createElement, createMap, updateElement } from "../controllers/admin.controller";

const adminRoutes = Router();

// add admin middlewares
adminRoutes.post('/element', adminMiddleware, createElement);
adminRoutes.put('/element/:elementId', adminMiddleware, updateElement);
adminRoutes.post('/avatar', adminMiddleware, createAvatar);
adminRoutes.post('/map', adminMiddleware, createMap);

export { adminRoutes }