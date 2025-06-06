import express from "express";
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  getCartItems,
} from "../controllers/cartController";
import { authenticate } from "../middlewares/auth";

const router=express.Router()

router.use(authenticate(["user"]))

router.post("/",addToCart as express.RequestHandler)
router.put("/",updateCartItemQuantity as express.RequestHandler)
router.delete("/:productId",removeFromCart as express.RequestHandler)
router.get("/",getCartItems)

export default router