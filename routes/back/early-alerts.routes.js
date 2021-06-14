const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { earlyAlertsList, getById, getEarlyAlertForm, createEarlyAlert, updateEarlyAlert, getFormToAnalyze, analyzeEarlyAlert, searchEarlyAlert } = require('@controllers/back/early-alert.controllers');

router.post('/api/alerts', usersTokenVerification, createEarlyAlert);
router.get('/api/alerts', usersTokenVerification, earlyAlertsList);

router.get('/api/alerts/search', usersTokenVerification, searchEarlyAlert);
router.get('/api/alerts/:id_alerta_temprana', usersTokenVerification, getById);
router.put('/api/alerts/:id_alerta_temprana', usersTokenVerification, updateEarlyAlert);

router.get('/api/alerts/form/empty',usersTokenVerification, getEarlyAlertForm);
router.get('/api/alerts/form/analyze/:id_alerta_temprana',usersTokenVerification, getFormToAnalyze);
router.put('/api/alerts/form/analyze/:id_alerta_temprana',usersTokenVerification, analyzeEarlyAlert);



module.exports = router;