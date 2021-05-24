const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { administrativeUnitsList, SsenAnalysisAdministrativeUnit} = require('@controllers/back/administrative-units.controllers');

// get list
router.get('/api/administrative-units/list',usersTokenVerification, administrativeUnitsList);

// send analisys administrative unit
router.post('/api/administrative-units/send-analysis', SsenAnalysisAdministrativeUnit)


module.exports = router;

