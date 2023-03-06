const express = require('express');
const router = express.Router();
const quizQuestionsController = require('../controllers/quizQuestions');
const checkAuth = require('../middleware/chcek-auth');

router.post('/', checkAuth, quizQuestionsController.createQuiestion);

router.get('/', checkAuth, quizQuestionsController.getAllQuestions);

router.get('/:id', checkAuth, quizQuestionsController.getOneQuestion);

router.delete('/:id', checkAuth, quizQuestionsController.deleteQuestion);

router.patch('/:id', checkAuth, quizQuestionsController.updateQuestion);

module.exports = router;