const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { getCrisisAlertsForm, crisisAlertsList  } = require('@controllers/back/crisis-alert.controllers');

router.get('/api/crisis-alerts/list', crisisAlertsList);
router.get('/api/crisis-alerts/form', getCrisisAlertsForm);


module.exports = router;

