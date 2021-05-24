const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { scenarioList } = require('@controllers/back/scenario.controllers');

//Scenario List
router.get('/api/scenario/list', scenarioList);

module.exports = router;