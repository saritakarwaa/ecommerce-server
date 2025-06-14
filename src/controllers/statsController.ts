import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const statsCount = async (req:Request, res:Response) =>{
    try {
        const [adminCount, sellerCount, userCount] = await Promise.all([
        prisma.admin.count(),
        prisma.seller.count(),
        prisma.user.count(),
        ]);

        res.json({ adminCount, sellerCount, userCount });
    } catch (error) {
        console.error("Failed to get counts:", error);
        res.status(500).json({ message: "Failed to fetch counts" });
    }
}