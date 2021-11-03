const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');  
const { getcaseProcesingFormList,getCaseProcessingForm, createCaseProcessing, getCaseProcesingById, updateCaseProcesing, getPersonInvolvedForm, getPersonInvolvedFormOffline, getInvolvedFormList, createPersonInvolvedForm, getPersonInvolvedById, updatePersonInvolvedForm, deletePersonInvolved, sentCaseToSigi,getFormVersion } = require('../../controllers/back/case-processing.controllers');  



router.get('/api/forms/caseProcessing/version',usersTokenVerification, getFormVersion);

//Processing Case
router.get('/api/case-processing/list',usersTokenVerification, getcaseProcesingFormList);

router.get('/api/case-processing', usersTokenVerification, getCaseProcessingForm);
router.post('/api/case-processing',usersTokenVerification, createCaseProcessing);

router.get('/api/case-processing/:id_caso_temp',usersTokenVerification, getCaseProcesingById);
router.put('/api/case-processing/:id_caso_temp',usersTokenVerification, updateCaseProcesing);

//Person Involved
router.get('/api/case-processing/:id_caso_temp/involved/list', usersTokenVerification, getInvolvedFormList);
  
//Form involucrados on line 
router.get('/api/case-processing/:id_caso_temp/involved/lists-form',usersTokenVerification, getPersonInvolvedForm);

//Form involucrados Offline
router.get('/api/case-processing/involved/form-offline',usersTokenVerification, getPersonInvolvedFormOffline);

router.get('/api/case-processing/:id_persona_temp/involved/form',usersTokenVerification, getPersonInvolvedById);
router.post('/api/case-processing/:id_caso_temp/involved/form',usersTokenVerification, createPersonInvolvedForm);

router.get('/api/case-processing/person-involved/:id_persona_temp',usersTokenVerification, getPersonInvolvedById);
router.put('/api/case-processing/person-involved/:id_persona_temp',usersTokenVerification, updatePersonInvolvedForm);

router.put('/api/case-processing/person-involved/:id_persona_temp/delete',usersTokenVerification, deletePersonInvolved);

// Send Case to SIGI 
router.post('/api/case-processing/:id_caso_temp/send-to-sigi', usersTokenVerification, sentCaseToSigi); 

module.exports = router;