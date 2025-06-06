import { PrismaClient } from '@prisma/client';
import { hashPassword, generateToken,comparePassword } from '../utils/auth';
import { Request, Response } from 'express';
const prisma = new PrismaClient();


const isValidEmail=(email:string)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword=(password:string)=> typeof password === "string" && password.length >= 6;
const isValidName=(name:string)=> typeof name === "string" && name.trim().length > 0;


export const createSeller = async (req:Request, res:Response) => {
  const { name, email, password } = req.body;

  if (!isValidName(name)) return res.status(400).json({ message: "Name is required" });
  if (!isValidEmail(email)) return res.status(400).json({ message: "Valid email is required" });
  if (!isValidPassword(password)) return res.status(400).json({ message: "Password must be at least 6 characters" });

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
  if (name !== undefined && !isValidName(name)) return res.status(400).json({ message: "Name is invalid" });
  if (password !== undefined && !isValidPassword(password)) return res.status(400).json({ message: "Password must be at least 6 characters" });
  
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

export const loginSeller = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const seller = await prisma.seller.findUnique({ where: { email } });
    if (!seller) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(seller.id, 'seller');
    res.json({ seller, token });
  } catch (err: any) {
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

export const getAllSellers = async (req: Request, res: Response) => {
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
    //array.includes(req.user.role)
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