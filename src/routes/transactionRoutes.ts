import express from "express";
import { authenticate } from "../middlewares/auth";
import { getAllTransactions, getTransactionById } from "../controllers/transactionControllers";

const router=express.Router()

router.get("/",getAllTransactions)
router.get("/:id",authenticate(["admin"]),getTransactionById as express.RequestHandler)

export default router
