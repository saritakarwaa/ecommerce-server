import { PrismaClient} from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

export const getAllTransactions=async(req:Request,res:Response)=>{
    try{
        const transactions = await prisma.order.findMany({
        select: {id: true,transactionId: true,amount: true,paymentMethod: true,
            paymentStatus: true,createdAt: true,
            user: {select: { id: true, name: true, email: true }},
            seller: {select: { id: true, name: true, email: true }},
            orderItems: {select: {
                product: { select: { name: true } },
                quantity: true,
                price: true}}},
        orderBy: {createdAt: "desc"}
        })
        res.status(200).json(transactions);
    }
    catch(error){
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getTransactionById=async(req:Request,res:Response)=>{
    const {id}=req.params
    try{
        const transaction = await prisma.order.findUnique({
            where: { id },
            select: {id: true,transactionId: true,amount: true,
                paymentMethod: true,paymentStatus: true,status: true,
                createdAt: true,updatedAt: true,
                user: {select: { id: true, name: true, email: true }},
                seller: {select: { id: true, name: true, email: true }},
                orderItems: {select: {
                    product: { select: { name: true } },
                    quantity: true,
                    price: true}}
                }
        });
        if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction)
    }
    catch(error){
        console.error("Error fetching transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}