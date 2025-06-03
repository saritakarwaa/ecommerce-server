import { createUser, updateUser } from "../controllers/userController";
import express, { Router } from 'express';
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", createUser as express.RequestHandler);
router.put("/:id",  authenticate(['user']),updateUser as express.RequestHandler);

export default router;