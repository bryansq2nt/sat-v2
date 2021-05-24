const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { aggressionTypeList } = require('@controllers/back/aggression-type.controllers');

// get list actions PDDH
router.get('/api/aggression-type/list', aggressionTypeList);

module.exports = router;