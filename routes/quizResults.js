const express = require('express');
const router = express.Router();
const quizResultsController = require('../controllers/quizResults');
const checkAuth = require('../middleware/chcek-auth');

router.post('/', checkAuth, quizResultsController.createResult);

router.get('/', checkAuth, quizResultsController.getResults);

router.get('/:user', checkAuth, quizResultsController.getUserResults);

router.get('/quiz/:quiz', checkAuth, quizResultsController.getQuizResult);

router.get('/perc/:id', checkAuth, quizResultsController.getSpecQuiz);

router.put('/:id', checkAuth, quizResultsController.updateResult)

module.exports = router;