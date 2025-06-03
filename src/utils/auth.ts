import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const hashPassword=async (password:string)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

export const comparePassword=(password:string, hashed:string)=>{
    return bcrypt.compare(password,hashed)
}

export const generateToken=(id:string,role:string)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET!,{expiresIn:'7d'})
}

export const verifyToken=(token:string):{id:string} | null =>{
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSec") as { id: string };
        return decoded;
    }
    catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
}