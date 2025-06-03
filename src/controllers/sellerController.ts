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
