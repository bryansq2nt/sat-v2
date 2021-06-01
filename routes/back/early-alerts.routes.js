const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { earlyAlertsList, getById, getEarlyAlertForm, createEarlyAlert, updateEarlyAlert, getFormToAnalyze, analyzeEarlyAlert, searchEarlyAlert } = require('@controllers/back/early-alert.controllers');

router.post('/api/alerts', usersTokenVerification, createEarlyAlert);
router.get('/api/alerts', earlyAlertsList);

router.get('/api/alerts/search', searchEarlyAlert);
router.get('/api/alerts/:id_alerta_temprana', getById);
router.put('/api/alerts/:id_alerta_temprana',usersTokenVerification, updateEarlyAlert);

router.get('/api/alerts/form/empty', getEarlyAlertForm);
router.get('/api/alerts/form/analyze/:id_alerta_temprana', getFormToAnalyze);
router.put('/api/alerts/form/analyze/:id_alerta_temprana',usersTokenVerification, analyzeEarlyAlert);



module.exports = router;