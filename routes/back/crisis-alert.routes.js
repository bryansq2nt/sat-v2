const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { getCrisisAlertsForm, crisisAlertsList, getById, createCrisisAlert, updateCrisisAlert, getFormToAnalyze, analyzeCrisisAlert } = require('@controllers/back/crisis-alert.controllers');

router.get('/api/crisis-alerts/list', crisisAlertsList);
router.get('/api/crisis-alerts/form', getCrisisAlertsForm);
router.get('/api/crisis-alerts/:id_atencion_crisis', usersTokenVerification, getById);
router.get('/api/crisis-alerts-form-to-analyze/:id_atencion_crisis', getFormToAnalyze);

router.put('/api/crisis-alerts/:id_atencion_crisis', usersTokenVerification, updateCrisisAlert);
router.put('/api/crisis-alerts/:id_atencion_crisis/analyze', usersTokenVerification, analyzeCrisisAlert);

router.post('/api/crisis-alerts/form', usersTokenVerification, createCrisisAlert);


module.exports = router;

