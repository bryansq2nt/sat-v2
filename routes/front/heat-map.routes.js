const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { getHeatMap } = require('../../controllers/front/heat-map.controllers');

// Get Heat Map 
router.get('/api-sat/heat-map', isLoggedIn, getHeatMap);

module.exports = router;