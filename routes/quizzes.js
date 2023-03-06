const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizzes');
const checkAuth = require('../middleware/chcek-auth');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir('./uploads/quizzes', (err) => {
            cb(null, './uploads/quizzes');
        });
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype === 'audio/mpeg' ? "mp3" : "png";
        cb(null, Date.now() + `.${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});



router.post('/', checkAuth, upload.fields([{ name: 'quizIcon', maxCount: 1 }, { name: 'quizAudio', maxCount: 1 }]), quizController.createQuiz);

router.get('/', checkAuth, quizController.getAllCategories);

router.get('/dimension/:quizDimension', checkAuth, quizController.getQuizzesInDiemnsion);

router.get('/:id', checkAuth, quizController.getOneCategories);

router.patch('/:id', upload.fields([{ name: 'quizIcon', maxCount: 1 }, { name: 'quizAudio', maxCount: 1 }]), quizController.updateQuiz);

module.exports = router;