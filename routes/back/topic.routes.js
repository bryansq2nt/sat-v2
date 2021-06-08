const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { topicList } = require('@controllers/back/topic.controllers');

router.get('/api/topic/list', usersTokenVerification, topicList);

module.exports = router;