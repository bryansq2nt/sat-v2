const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { getCrisisAlertsForm, crisisAlertsList, getById, createCrisisAlert, updateCrisisAlert } = require('@controllers/back/crisis-alert.controllers');

router.get('/api/crisis-alerts/list', crisisAlertsList);
router.get('/api/crisis-alerts/form', getCrisisAlertsForm);
router.get('/api/crisis-alerts/:id_atencion_crisis', usersTokenVerification, getById);

router.put('/api/early-alerts/:id_atencion_crisis', usersTokenVerification, updateCrisisAlert);

router.post('/api/crisis-alerts/form', usersTokenVerification, createCrisisAlert);


module.exports = router;

