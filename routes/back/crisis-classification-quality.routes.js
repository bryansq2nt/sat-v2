const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { classificationQualityList } = require('@controllers/back/crisis-classification-quality.controllers');

router.get('/api/crisis-classification-quality/list', usersTokenVerification, classificationQualityList);

module.exports = router;