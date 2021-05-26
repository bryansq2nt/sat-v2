const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('../../middlewares/token.middleware');
const { earlyAlertsList, getById, getEarlyAlertForm, createEarlyAlert } = require('@controllers/back/early-alert.controllers');
const upload = require('../../lib/multer');

router.get('/api/early-alerts/list', earlyAlertsList);
router.get('/api/early-alerts/:id_alerta_temprana/get-alert', getById);
router.get('/api/early-alerts-form', getEarlyAlertForm);
router.post('/api/early-alerts-form', usersTokenVerification, upload.any(), createEarlyAlert);



module.exports = router;