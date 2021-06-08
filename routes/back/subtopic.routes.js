const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { subtopicList } = require('@controllers/back/subtopic.controllers');

router.get('/api/subtopic/list', usersTokenVerification, subtopicList);

module.exports = router;