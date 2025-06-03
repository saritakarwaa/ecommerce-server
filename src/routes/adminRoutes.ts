import { Router } from "express";
import { createAdmin, updateAdmin } from "../controllers/adminController";
import express,{Request,Response} from 'express'
import { authenticate } from "../middlewares/auth";


const router = Router();

// Only admins can create other admins (role hierarchy)
router.post("/", authenticate(['superadmin']),createAdmin as express.RequestHandler);
//Admins update their own profile
router.put("/:id", authenticate(['admin', 'superadmin']),updateAdmin as express.RequestHandler);

//router.post("/superadmin",superadmin as express.RequestHandler)

export default router;
