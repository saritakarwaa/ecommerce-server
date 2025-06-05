import express, { Router } from 'express';
import { createSeller, updateSeller,getAllSellers,getSellerById,deleteSeller ,approveSeller, loginSeller} from "../controllers/sellerController";
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post("/", createSeller as express.RequestHandler);
router.post('/login',loginSeller as express.RequestHandler )
router.get('/', authenticate(['admin']), getAllSellers);
router.get('/:id', authenticate(['seller', 'admin']), getSellerById as express.RequestHandler);
router.put("/:id", authenticate(['seller']),updateSeller as express.RequestHandler);
router.delete('/:id', authenticate(['seller', 'admin']), deleteSeller as express.RequestHandler);

router.patch('/:id/approve', authenticate(['admin', 'superadmin']), approveSeller as express.RequestHandler);

export default router;
