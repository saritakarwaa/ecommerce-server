import { Request, Response } from 'express';
import { OrderStatus, PaymentStatus, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createOrder=async(req:Request,res:Response)=>{
    const userId=req.user?.id
    const {sellerId,items,paymentMethod,transactionId}=req.body
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain items' });
    }

    try{
        const amount=items.reduce((total:number,item:any)=>total+item.price*item.quantity,0)
        const order=await prisma.order.create({
            data:{
                userId,sellerId,amount,status:OrderStatus.PENDING,paymentStatus:PaymentStatus.PENDING,
                paymentMethod,transactionId,orderItems:{
                    create:items.map((item:any)=>({
                        productId:item.productId,
                        quantity:item.quantity,
                        price:item.price
                    }))
                }
            },include:{orderItems:true}
        })
        res.status(201).json(order);
    }
    catch(err){
        res.status(500).json({ message: 'Failed to create order', error: err });
    }
}

export const getUserOrders = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: true }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user orders', error: err });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const role = req.user?.role;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true }
    });

    if (!order || (role === 'user' && order.userId !== userId) || (role === 'seller' && order.sellerId !== userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err });
  }
};

export const updateOrderStatus=async(req:Request,res:Response)=>{
    const {id}=req.params
    const {status}=req.body
    const sellerId=req.user?.id

    try{
        const order=await prisma.order.findUnique({where:{id}})
        if(!order || order.sellerId!== sellerId){
            return res.status(403).json({ message: 'Access denied' });
        }
        const updated=await prisma.order.update({
            where:{id},
            data:{status}
        })
        res.json(updated)
    }
    catch(err){
        res.status(500).json({ message: 'Failed to update status', error: err });
    }
}

export const getSellerOrders=async(req:Request,res:Response)=>{
    const sellerId = req.user?.id;

  try {
    const orders = await prisma.order.findMany({
      where: { sellerId },
      include: { orderItems: true }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err });
  }
}

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { orderItems: true, user: true, seller: true }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Admin fetch failed', error: err });
  }
};