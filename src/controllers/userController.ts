import { PrismaClient } from "@prisma/client";
import { hashPassword, generateToken } from '../utils/auth';
import { Request, Response } from 'express';
const prisma = new PrismaClient();


export const createUser=async(req:Request,res:Response)=>{
    const {name,email,password}:{ name: string; email: string; password: string }=req.body
    try{
        const existing=await prisma.user.findUnique({where:{email}})
        if(existing) return res.status(400).json({message:'Email already exists'})
        const hashed=await hashPassword(password)
        const user=await prisma.user.create({
            data: { name, email, password: hashed },
        })
        const token = generateToken(user.id, 'user');
        res.status(201).json({user,token})
    }
    catch(err:any){
        res.status(500).json({error:err.message})
    }
}


export const updateUser=async(req:Request,res:Response)=>{
    const userId=req.params.id 
    const {name,password}=req.body
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'You can only update your own profile' });
    }
    try {
        const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            ...(password && { password: await hashPassword(password) }),
            },
        });
        res.json(updated)
    }
    catch(err:any){
        console.error("Update user error:", err);
        res.status(500).json({error:err.message})
    }
}

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;

  if (req.user?.id !== userId && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  if (req.user?.id !== userId && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
