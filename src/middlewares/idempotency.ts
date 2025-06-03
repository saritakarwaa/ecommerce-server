import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

export async function checkIdempotency(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['x-idempotency-key'] as string;
  if (!key) {
    return res.status(400).json({ error: 'Idempotency key required' });
  }

  try{
        const exists = await redis.get(key);
        if (exists) {
            // Return cached response or error if needed
            return res.status(409).json({ error: 'Duplicate request' });
        }

        // Set a temporary key for this idempotency key, expire after some time
        await redis.set(key, 'in-progress', 'EX',60*5); // 5 minutes TTL
        next();
    }
    catch(error){
        console.error('Error checking idempotency:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}  