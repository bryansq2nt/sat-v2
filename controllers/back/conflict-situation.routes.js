const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('../../middlewares/token.middleware');
const { conflictSituationList } = require('@controllers/back/conflict-situation.controller');

router.get('/api/conflict-situation/list', conflictSituationList);

module.exports = router;