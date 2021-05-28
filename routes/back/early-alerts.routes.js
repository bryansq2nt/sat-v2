const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('../../middlewares/token.middleware');
const { earlyAlertsList, getById, getEarlyAlertForm, createEarlyAlert, updateEarlyAlert,getFormToAnalyze,analyzeEarlyAlert } = require('@controllers/back/early-alert.controllers');

router.get('/api/early-alerts/list', earlyAlertsList);
router.get('/api/early-alerts/:id_alerta_temprana', getById);
router.put('/api/early-alerts/:id_alerta_temprana',usersTokenVerification, updateEarlyAlert);
router.put('/api/early-alerts/:id_alerta_temprana/analyze',usersTokenVerification, analyzeEarlyAlert);

router.get('/api/early-alerts-form', getEarlyAlertForm);
router.get('/api/early-alerts-form-to-analyze/:id_alerta_temprana', getFormToAnalyze);

router.post('/api/early-alerts-form', usersTokenVerification, createEarlyAlert);




module.exports = router;