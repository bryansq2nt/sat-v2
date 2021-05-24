const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('../../middlewares/token.middleware');
const { genderList } = require('@controllers/back/gender.controllers');

// get gender list
router.get('/api/gender/list', usersTokenVerification, genderList);

module.exports = router;