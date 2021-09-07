const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');  
const { getCaseProcessingForm } = require('../../controllers/back/case-processing.controllers');  

router.get('/api/case-processing', usersTokenVerification, getCaseProcessingForm);

module.exports = router;