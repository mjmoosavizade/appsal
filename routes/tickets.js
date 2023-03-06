const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/tickets');
const checkAuth = require('../middleware/chcek-auth');

router.get('/', checkAuth, ticketController.getAllTickets);

router.get('/:id', checkAuth, ticketController.getOneTickets);

router.post('/', checkAuth, ticketController.createTicket);

router.patch('/:id', checkAuth, ticketController.updateTicket);

router.post('/message', checkAuth, ticketController.sendMessage);

module.exports = router;