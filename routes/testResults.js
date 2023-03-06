const express = require('express');
const router = express.Router();
const multer = require('multer');
const testResultsController = require('../controllers/testResults');
const checkAuth = require('../middleware/chcek-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/test-results');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'application/pdf') {
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

});


router.post("/", checkAuth, upload.single('resultFile'), testResultsController.createTestResult);

router.get("/", checkAuth, testResultsController.getAllResults);

router.get("/my", checkAuth, testResultsController.getOneResults);

router.delete("/:id", checkAuth, testResultsController.deleteResult);

router.patch("/:id", checkAuth, upload.single('resultFile'), testResultsController.updateResult);

module.exports = router;