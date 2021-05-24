const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { sexList } = require('@controllers/back/sex.controllers');

// get sex list
router.get('/api/sex-list', usersTokenVerification, sexList);



module.exports = router;