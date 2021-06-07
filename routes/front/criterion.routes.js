const {Router} = require('express');
const router = Router();

const {isLoggedIn} = require('@middlewares/auth');
const {criterionList, viewCreateCriterion, createCriterion, getById, updateCriterion} = require('@controllers/front/criterion.controllers');

router.get('/api-sat/criterion-list', isLoggedIn, criterionList);

router.get('/api-sat/criterion/create-view', isLoggedIn, viewCreateCriterion);
router.post('/api-sat/criterion/create', isLoggedIn, createCriterion);

router.get('/api-sat/criterion/:id_criterio/update-view', isLoggedIn, getById);
router.post('/api-sat/criterion/:id_criterio/update', isLoggedIn, updateCriterion);

module.exports = router;