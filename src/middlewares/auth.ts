import { clerkMiddleware } from '@clerk/express';

const requireAuth = clerkMiddleware();

export { requireAuth };
