const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { participantQualityList } = require('@controllers/back/participant-quality.controllers');

router.get('/api/participant-quality/list', usersTokenVerification, participantQualityList);

module.exports = router;