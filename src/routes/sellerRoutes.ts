import express, { Router } from 'express';
import { createSeller, updateSeller } from "../controllers/sellerController";
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post("/", createSeller as express.RequestHandler);
router.put("/:id", authenticate(['seller']),updateSeller as express.RequestHandler);

export default router;
