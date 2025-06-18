import { Router } from "express";
import { createAdmin, updateAdmin,getAdminById,getAllAdmins,deleteAdmin, loginAdmin } from "../controllers/adminController";
import express,{Request,Response} from 'express'
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/",createAdmin as express.RequestHandler);
router.post('/login',loginAdmin as express.RequestHandler)

router.put("/:id", authenticate(['admin', 'superadmin']),updateAdmin as express.RequestHandler);

router.get('/', getAllAdmins);
router.get('/:id', authenticate(['admin', 'superadmin']), getAdminById as express.RequestHandler);
router.delete('/:id', authenticate(['superadmin']), deleteAdmin as express.RequestHandler); // Only superadmin can delete other admins
export default router;
