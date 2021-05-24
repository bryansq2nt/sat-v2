const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { municipalityList } = require('@controllers/back/municipality.controller')

//Get Municipality List
router.get('/api/municipalities/list', municipalityList);


module.exports = router;


