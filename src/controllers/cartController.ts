import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToCart=async (req:Request,res:Response)=>{
    const userId=req.user?.id
    const {productId,quantity}=req.body
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        const existing=await prisma.userCart.findUnique({
            where:{userId_productId:{userId,productId}}
        })
        if(existing){
            const updated=await prisma.userCart.update({
                where:{userId_productId:{userId,productId}},
                data:{quantity:existing.quantity+quantity}
            })
            return res.status(200).json(updated)
        }
        const cartItem=await prisma.userCart.create({
            data:{userId,productId,quantity}
        })
    }
    catch(err){
        res.status(500).json({ message: "Failed to add to cart", error: err });
    }
}


export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  if(!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const updated = await prisma.userCart.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update quantity", error: err });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId } = req.params;

  if(!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    await prisma.userCart.delete({
      where: { userId_productId: { userId, productId } },
    });

    res.status(200).json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart", error: err });
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const items = await prisma.userCart.findMany({
      where: { userId },
      include: { product: true },
    });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart", error: err });
  }
};