const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');  
const { getCaseProcessingForm, createCaseProcessing, getInvolvedForm  } = require('../../controllers/back/case-processing.controllers');  

router.get('/api/case-processing', getCaseProcessingForm);
router.post('/api/case-processing', createCaseProcessing);

router.get('/api/case-processing/involved', getInvolvedForm);

module.exports = router;