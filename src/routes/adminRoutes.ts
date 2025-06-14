import { Router } from "express";
import { createAdmin, updateAdmin,getAdminById,getAllAdmins,deleteAdmin,superadmin, loginAdmin } from "../controllers/adminController";
import express,{Request,Response} from 'express'
import { authenticate } from "../middlewares/auth";

const router = Router();

// Only admins can create other admins (role hierarchy)
router.post("/",createAdmin as express.RequestHandler);
router.post('/login',loginAdmin as express.RequestHandler)
//Admins update their own profile
router.put("/:id", authenticate(['admin', 'superadmin']),updateAdmin as express.RequestHandler);

router.post("/superadmin",superadmin as express.RequestHandler)
router.get('/', authenticate(['superadmin']), getAllAdmins);
router.get('/:id', authenticate(['admin', 'superadmin']), getAdminById as express.RequestHandler);
router.delete('/:id', authenticate(['superadmin']), deleteAdmin as express.RequestHandler); // Only superadmin can delete other admins
export default router;
