import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { hashPassword,generateToken } from "../utils/auth";
const prisma = new PrismaClient();

export const createAdmin=async(req:Request,res:Response)=>{
    const {name,email,password}=req.body
    try{
        const existing=await prisma.admin.findUnique({where:{email}})
        if(existing) return res.status(400).json({message:'Email already exists'})
        
        const hashed= await hashPassword(password)
        const admin=await prisma.admin.create({
            data: { name, email, password: hashed },
        })
        const token=generateToken(admin.id,'admin')
        res.status(201).json({admin,token})
    }
    catch(err:any){[
        res.status(500).json({error:err.message})
    ]}
}


export const updateAdmin=async(req:Request,res:Response)=>{
    const adminId=req.params.id
    const {name,password}=req.body
    if (req.user?.id !== adminId && req.user?.role !== 'superadmin') {
        return res.status(403).json({ message: 'Cannot update other admins' });
    }
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

// export const superadmin=async(req:Request,res:Response)=>{
//     const { name, email, password } = req.body;
//   const existing = await prisma.admin.findUnique({ where: { email } });
//   if (existing) return res.status(400).json({ message: 'Email already exists' });

//   const hashed = await hashPassword(password);
//   const admin = await prisma.admin.create({
//     data: { name, email, password: hashed },
//   });
//   const token = generateToken(admin.id, 'superadmin');
//   res.status(201).json({ admin, token });
// }





export const getAllAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await prisma.admin.findMany();
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
