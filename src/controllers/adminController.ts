import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { hashPassword,generateToken,comparePassword } from "../utils/auth";
const prisma = new PrismaClient();

const isValidEmail=(email:string)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword=(password:string)=> typeof password === "string" && password.length >= 6;
const isValidName=(name:string)=> typeof name === "string" && name.trim().length > 0;

export const createAdmin=async(req:Request,res:Response)=>{
    const {name,email,password,role}=req.body
    if(!isValidName(name)) return res.status(400).json({message:"Name is required"})
    if (!isValidEmail(email)) return res.status(400).json({ message: "Valid email is required" });
    if (!isValidPassword(password)) return res.status(400).json({ message: "Password must be at least 6 characters" });

    if (role === "SUPERADMIN") {
      const existingSuperadmin = await prisma.admin.findFirst({
        where: { role: "SUPERADMIN" },
      });

      if (existingSuperadmin) {
        return res.status(400).json({ message: "Only one SuperAdmin is allowed." });
      }
    }
    try{
        const existing=await prisma.admin.findUnique({where:{email}})
        if(existing) return res.status(400).json({message:'Email already exists'})
        
        const hashed= await hashPassword(password)
        const admin=await prisma.admin.create({
            data: { name, email, password: hashed,role },
        })
        const token=generateToken(admin.id,admin.role)
        res.status(201).json({admin,token})
    }
    catch(err:any){[
        res.status(500).json({error:err.message})
    ]}
}

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(admin.id, 'admin');
    res.json({ admin, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const updateAdmin=async(req:Request,res:Response)=>{
    const adminId=req.params.id
    const {name,password}=req.body
    if (req.user?.id !== adminId && req.user?.role !== 'superadmin') {
        return res.status(403).json({ message: 'Cannot update other admins' });
    }
    if (name !== undefined && !isValidName(name)) return res.status(400).json({ message: "Name is invalid" });
    if (password !== undefined && !isValidPassword(password)) return res.status(400).json({ message: "Password must be at least 6 characters" });
    try{
        const updated=await prisma.admin.update({
            where:{id:adminId},
            data:{
                name,
                ...(password && { password: await hashPassword(password) }),
            }
        })
        res.json(updated)
    }
    catch(err:any){
        res.status(500).json({error:err.message})
    }
}


export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await prisma.admin.findMany({
      where: {
        role: 'ADMIN',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(admins);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  const adminId = req.params.id;

  if (req.user?.id !== adminId && req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  const adminId = req.params.id;

  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Only superadmin can delete admins' });
  }

  try {
    await prisma.admin.delete({ where: { id: adminId } });
    res.json({ message: 'Admin deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
