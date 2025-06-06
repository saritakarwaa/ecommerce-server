import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToWishlist=async (req:Request,res:Response)=>{
  const userId = req.user?.id;
  const { productId } = req.body;

   if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
  try {
    const wishlistItem = await prisma.userWishlist.create({
      data: { userId, productId },
    });

    res.status(201).json(wishlistItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist", error: err });
  }
}

export const removeFromWishlist=async(req:Request,res:Response)=>{
  const userId = req.user?.id;
  const { productId } = req.params;

  if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
  try {
    await prisma.userWishlist.delete({
      where: { userId_productId: { userId, productId } },
    });

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove", error: err });
  }
}

export const getWishlistItems = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const items = await prisma.userWishlist.findMany({
      where: { userId },
      include: { product: true },
    });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: err });
  }
};