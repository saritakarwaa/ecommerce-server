import { PrismaClient } from '@prisma/client';
import { hashPassword, generateToken } from '../utils/auth';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

export const createSeller = async (req:Request, res:Response) => {
  const { name, email, password } = req.body;

  try {
    const existing = await prisma.seller.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await hashPassword(password);
    const seller = await prisma.seller.create({
      data: { name, email, password: hashed },
    });

    const token = generateToken(seller.id, 'seller');
    res.status(201).json({ seller, token });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSeller = async (req:Request, res:Response) => {
  const sellerId = req.params.id;
  const { name, password } = req.body;
  if (req.user?.id !== sellerId) {
        return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const updated = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        name,
        ...(password && { password: await hashPassword(password) }),
      },
    });

    res.json(updated);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSellerById = async (req: Request, res: Response) => {
  const sellerId = req.params.id;

  if (req.user?.id !== sellerId && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const seller = await prisma.seller.findUnique({ where: { id: sellerId } });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json(seller);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSeller = async (req: Request, res: Response) => {
  const sellerId = req.params.id;

  if (req.user?.id !== sellerId && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const products = await prisma.product.count({
      where: { sellerId }
  });
  if (products > 0) {
    return res.status(400).json({ message: 'Cannot delete seller with active products' });
  }
  try {
    await prisma.seller.delete({ where: { id: sellerId } });
    res.json({ message: 'Seller deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSellers = async (_req: Request, res: Response) => {
  try {
    const sellers = await prisma.seller.findMany();
    res.json(sellers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const approveSeller=async(req:Request,res:Response)=>{
  const sellerId=req.params.id
  if(req.user?.role!=='admin' && req.user?.role!=='superadmin'){
    return res.status(403).json({ message: 'Only admins can approve sellers' });
  }
  try{
    const seller=await prisma.seller.findUnique({where:{id:sellerId}})
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    const updatedSeller=await prisma.seller.update({
      where:{id:sellerId},
      data:{
        status:'APPROVED'
      }
    })
    res.json({ message: 'Seller approved', seller: updatedSeller });
  }
  catch(err:any){
    res.status(500).json({error:err.message})
  }
}