const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');  
const { getCaseProcessingForm, createCaseProcessing, getCaseProcesingById, updateCaseProcesing, getPersonInvolvedForm, createPersonInvolvedForm, getPersonInvolvedById, updatePersonInvolvedForm, deletePersonInvolved } = require('../../controllers/back/case-processing.controllers');  

//Processing Case

router.get('/api/case-processing', getCaseProcessingForm);
router.post('/api/case-processing', createCaseProcessing);

router.get('/api/case-processing/:id_caso_temp', getCaseProcesingById);
router.put('/api/case-processing/:id_caso_temp', updateCaseProcesing);

//Person Involved

router.get('/api/case-processing/involved', getPersonInvolvedForm);
router.post('/api/case-processing/involved', createPersonInvolvedForm);

router.get('/api/case-processing/person-involved/:id_persona_temp', getPersonInvolvedById);
router.put('/api/case-processing/person-involved/:id_persona_temp', updatePersonInvolvedForm);

router.put('/api/case-processing/person-involved/:id_persona_temp/delete', deletePersonInvolved);

module.exports = router;