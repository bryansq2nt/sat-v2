const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { populationTypeList } = require('@controllers/back/population-type.controllers');

//Population Type
router.get('/api/population-type-list', usersTokenVerification, populationTypeList);

module.exports = router;