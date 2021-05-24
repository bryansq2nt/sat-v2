const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { crisisAlertsList,  } = require('@controllers/back/crisis-alert.controllers');

router.get('/api/alert-crisis-form', crisisAlertsList);

module.exports = router;

