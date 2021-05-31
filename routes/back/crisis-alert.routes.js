const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { getCrisisAlertsForm, crisisAlertsList, createCrisisAlert  } = require('@controllers/back/crisis-alert.controllers');

router.get('/api/crisis-alerts-form', getCrisisAlertsForm);
router.get('/api/crisis-alerts', crisisAlertsList);
router.post('/api/crisis-alerts',usersTokenVerification, createCrisisAlert);


module.exports = router;

