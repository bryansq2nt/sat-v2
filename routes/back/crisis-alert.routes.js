const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { getCrisisAlertsForm, crisisAlertsList,getById } = require('@controllers/back/crisis-alert.controllers');

router.get('/api/crisis-alerts/list', crisisAlertsList);
router.get('/api/crisis-alerts/form', getCrisisAlertsForm);
router.get('/api/crisis-alerts/:id_atencion_crisis', getById);


module.exports = router;

