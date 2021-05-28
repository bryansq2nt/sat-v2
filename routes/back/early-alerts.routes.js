const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('../../middlewares/token.middleware');
const { earlyAlertsList, getById, getEarlyAlertForm, createEarlyAlert, updateEarlyAlert } = require('@controllers/back/early-alert.controllers');
const upload = require('../../lib/multer');

router.get('/api/early-alerts/list', earlyAlertsList);
router.get('/api/early-alerts/:id_alerta_temprana', getById);
router.put('/api/early-alerts/:id_alerta_temprana',usersTokenVerification, updateEarlyAlert);

router.get('/api/early-alerts-form', getEarlyAlertForm);
router.post('/api/early-alerts-form', usersTokenVerification, upload.any(), createEarlyAlert);



module.exports = router;