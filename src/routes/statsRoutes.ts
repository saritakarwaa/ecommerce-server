import express from "express";
import { authenticate } from "../middlewares/auth";
import { statsCount } from "../controllers/statsController";

const router=express.Router()

router.get("/counts",authenticate(["admin"]),statsCount);
export default router;