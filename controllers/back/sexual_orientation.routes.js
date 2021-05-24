const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { sexualOrientationList } = require('@controllers/back/sexual_orientation.controllers');

router.get('/api/sexual-orientation/list', sexualOrientationList);

module.exports = router;