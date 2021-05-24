const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { vulnerableGroupList } = require('@controllers/back/vulnerable-group.controllers');

router.get('/api/vulnerable-group/list',usersTokenVerification, vulnerableGroupList);

module.exports = router;