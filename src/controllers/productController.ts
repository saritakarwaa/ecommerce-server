import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

export const createProduct=async(req:Request,res:Response)=>{
    const sellerId=req.user?.id
    if (req.user?.role !== 'seller') {
        return res.status(403).json({ message: 'Only sellers can add products' });
    }
    const {name,description,price,stock}=req.body
     if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({ message: 'Name is required and should be at least 3 characters' });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({ message: 'Description is required and should be at least 10 characters' });
    }

    if (price == null || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    if (stock == null || typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
      return res.status(400).json({ message: 'Stock must be a non-negative integer' });
    }
    try{
        const product=await prisma.product.create({
            data:{
                name,description,price,stock,sellerId:sellerId!
            }
        })
        res.status(201).json(product)
    }
    catch(err:any){
        res.status(500).json({ error: err.message });
    }
}

export const getProductById = async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

//getAllProducts- public access with optional filters

export const updateProduct=async(req:Request,res:Response)=>{
    const sellerId=req.user?.id
    const productId=req.params.id

    if (req.user?.role !== 'seller') {
        return res.status(403).json({ message: 'Only sellers can update products' });
    }
    const { name, description, price, stock } = req.body;
    if (name && (typeof name !== 'string' || name.trim().length < 3)) {
      return res.status(400).json({ message: 'Name must be at least 3 characters' });
    }

    if (description && (typeof description !== 'string' || description.trim().length < 10)) {
      return res.status(400).json({ message: 'Description must be at least 10 characters' });
    }

    if (price != null && (typeof price !== 'number' || price <= 0)) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    if (stock != null && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) {
      return res.status(400).json({ message: 'Stock must be a non-negative integer' });
    }
    try{
        const product=await prisma.product.findUnique({where:{id:productId}})
        if (!product || product.sellerId !== sellerId) {
            return res.status(403).json({ message: 'Unauthorized to update this product' });
        }
        const updated = await prisma.product.update({
            where: { id: productId },
            data: req.body,
        });
        res.json(updated)
    }
    catch(err:any){
        res.status(500).json({error:err.message})
    }
}

export const getSellerProducts = async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId;

  try {
    const products = await prisma.product.findMany({
      where: { sellerId },
    });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const sellerId = req.user?.id;
  const productId = req.params.id;

  if (req.user?.role !== 'seller') {
    return res.status(403).json({ message: 'Only sellers can delete products' });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.sellerId !== sellerId) {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }

    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const adminDeleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;

  if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Only admin can delete any product' });
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: 'Product deleted by admin' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
