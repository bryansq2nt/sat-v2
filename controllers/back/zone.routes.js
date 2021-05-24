const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { zoneList} = require('@controllers/back/zone.controllers');

// get zone list
router.get('/api/zone/list', usersTokenVerification, zoneList);


module.exports = router;