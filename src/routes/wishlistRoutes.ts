import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistItems,
} from "../controllers/wishlistController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate(["user"]));

router.post("/", addToWishlist as express.RequestHandler);
router.delete("/:productId", removeFromWishlist as express.RequestHandler);
router.get("/", getWishlistItems as express.RequestHandler);

export default router;
