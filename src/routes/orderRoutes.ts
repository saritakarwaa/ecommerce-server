import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getSellerOrders,
  getAllOrders
} from '../controllers/orderController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticate(['user']), createOrder as express.RequestHandler);
router.get('/user', authenticate(['user']), getUserOrders);

router.put('/:id/status', authenticate(['seller']), updateOrderStatus as express.RequestHandler);
router.get('/seller', authenticate(['seller']), getSellerOrders);

router.get('/:id', authenticate(['user', 'seller']), getOrderById as express.RequestHandler);

router.get('/', authenticate(['admin','superadmin']), getAllOrders);

export default router;
