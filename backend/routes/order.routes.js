const express = require('express');
const router=express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder}= require("../controllers/order.controller");
/* const { authMiddleware, verifyAdmin}= require("../middlewares/auth.middleware"); */


router.get('/', /* authMiddleware, verifyAdmin, */ getAllOrders );
router.get('/:id',/*  authMiddleware, verifyAdmin, */ getOrderById );
router.post('/', /* authMiddleware, verifyAdmin, */ createOrder );
router.put('/:id', /* authMiddleware, verifyAdmin, */ updateOrder );
router.delete('/:id', /* authMiddleware, verifyAdmin, */ deleteOrder);



module.exports=router;
