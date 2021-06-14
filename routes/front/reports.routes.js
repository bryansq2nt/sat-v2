const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const {reportTypeAlert, reportPhasesConflict, reportConflictSituation,  getHeatMap} = require('@controllers/front/reports.controllers');

// Get Report Type Alert 
router.get('/api-sat/report/type-alert', isLoggedIn, reportTypeAlert);

// Get Report Phases Conflic
router.get('/api-sat/report/phases-conflict', isLoggedIn, reportPhasesConflict);

//Get Report Conflict Situation
router.get('/api-sat/report/conflict-situation', isLoggedIn, reportConflictSituation);

// Get Heat Map 
router.get('/api-sat/report/heat-map', isLoggedIn, getHeatMap);

module.exports = router;