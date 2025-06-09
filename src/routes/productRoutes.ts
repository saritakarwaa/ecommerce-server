import express, { Router } from 'express';
import { getProductById,getSellerProducts,createProduct,updateProduct,deleteProduct,adminDeleteProduct, approveProduct, topSellingProducts } from '../controllers/productController';
import { authenticate } from "../middlewares/auth";
const router=express.Router()

router.get('/:id', getProductById as express.RequestHandler);
router.get('/seller/:sellerId', getSellerProducts);

router.get('/top-selling',topSellingProducts)

router.post('/', authenticate(['seller']), createProduct as express.RequestHandler);
router.put('/:id', authenticate(['seller']), updateProduct as express.RequestHandler);
router.delete('/:id', authenticate(['seller']), deleteProduct as express.RequestHandler);

router.delete('/admin/:id', authenticate(['admin']), adminDeleteProduct as express.RequestHandler);
router.patch("/:productId/approve",authenticate(["admin"]),approveProduct)

export default router