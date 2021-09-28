const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');  
const { getcaseProcesingFormList,getCaseProcessingForm, createCaseProcessing, getCaseProcesingById, updateCaseProcesing, getPersonInvolvedForm, getInvolvedFormList, createPersonInvolvedForm, getPersonInvolvedById, updatePersonInvolvedForm, deletePersonInvolved } = require('../../controllers/back/case-processing.controllers');  

//Processing Case
router.get('/api/case-processing/list',usersTokenVerification, getcaseProcesingFormList);

router.get('/api/case-processing',usersTokenVerification, getCaseProcessingForm);
router.post('/api/case-processing',usersTokenVerification, createCaseProcessing);

router.get('/api/case-processing/:id_caso_temp',usersTokenVerification, getCaseProcesingById);
router.put('/api/case-processing/:id_caso_temp',usersTokenVerification, updateCaseProcesing);

//Person Involved
router.get('/api/case-processing/:id_caso_temp/involved/list', usersTokenVerification, getInvolvedFormList);

router.get('/api/case-processing/:id_persona_temp/involved/form',usersTokenVerification, getPersonInvolvedById);
router.post('/api/case-processing/:id_caso_temp/involved/form',usersTokenVerification, createPersonInvolvedForm);

router.get('/api/case-processing/person-involved/:id_persona_temp',usersTokenVerification, getPersonInvolvedById);
router.put('/api/case-processing/person-involved/:id_persona_temp',usersTokenVerification, updatePersonInvolvedForm);

router.put('/api/case-processing/person-involved/:id_persona_temp/delete',usersTokenVerification, deletePersonInvolved);

module.exports = router;