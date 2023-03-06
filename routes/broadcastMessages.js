const express = require('express');
const router = express.Router();
const messageController = require("../controllers/broadcastMessages");
const checkAuth = require('../middleware/chcek-auth');


router.get(`/`, checkAuth, messageController.getAllMessages);

router.get(`/read`, checkAuth, messageController.getRead);

router.get(`/my-messages`, checkAuth, messageController.getMyMessages);

router.get(`/unread`, checkAuth, messageController.getUnread);

router.get(`/:id`, checkAuth, messageController.getOneMessage);

router.post(`/`, checkAuth, messageController.createMessage);

router.delete('/:id', checkAuth, messageController.deleteMessage);

router.put('/read-by/:id', checkAuth, messageController.readMessage);

router.put('/:id', checkAuth, messageController.updateMessage);


module.exports = router;