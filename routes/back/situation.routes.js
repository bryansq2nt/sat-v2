const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { conflictSituationList } = require('@controllers/back/situation.controller');

router.get('/api/situation/list', usersTokenVerification, conflictSituationList);

module.exports = router;