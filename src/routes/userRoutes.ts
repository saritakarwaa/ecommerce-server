import { createUser, updateUser , getUserById,getAllUsers, deleteUser, loginUser} from "../controllers/userController";
import express, { Router } from 'express';
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", createUser as express.RequestHandler);
router.post("/login",loginUser as express.RequestHandler)
router.get('/', authenticate(['admin']), getAllUsers); // Only admin can view all users
router.get('/:id', authenticate(['user', 'admin']), getUserById as express.RequestHandler); // user can view self; admin can view anyone
router.put("/:id",  authenticate(['user']),updateUser as express.RequestHandler); //user can update self
router.delete('/:id', authenticate(['user', 'admin']), deleteUser as express.RequestHandler); // user can delete self; admin can delete any

export default router;