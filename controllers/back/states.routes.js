const { Router } = require('express');
const router = Router();

const { getList } = require('@controllers/back/states.controller')

//Get State List
router.get('/api/states/list', getList);


module.exports = router;