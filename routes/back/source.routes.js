const { Router } = require('express');
const router = Router();

const { sourceList } = require('@controllers/back/source.controllers');

// get source list
router.get('/api/source/list', sourceList);

module.exports = router;