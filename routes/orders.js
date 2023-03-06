const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orders");
const checkAuth = require('../middleware/chcek-auth');


router.get("/", checkAuth, orderController.getAllOrders);

router.get("/delivered", checkAuth, orderController.getDelivered);

router.get(`/my-orders`, checkAuth, orderController.getMyOrders);

router.get(`/undelivered`, checkAuth, orderController.getUndelivered);

router.get(`/:id`, checkAuth, orderController.getOneOrder);

router.post(`/`, checkAuth, orderController.createOrder);

// router.delete('/:id', checkAuth, orderController.deleteMessage);

router.put('/delivered/:id', checkAuth, orderController.deliveredProduct);

// router.put('/:id', checkAuth, orderController.updateMessage);


module.exports = router;