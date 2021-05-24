const { Router } = require('express');
const router = Router();

const { sourceTypeList } = require('@controllers/back/source-type.controllers');

router.get('/api/source-type/list', sourceTypeList);


module.exports = router;