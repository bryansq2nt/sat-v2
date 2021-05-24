const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { entryTypeList} = require('@controllers/back/entry-type.controllers');

// get entry type
router.get('/api/entry-type/list', usersTokenVerification, entryTypeList);

module.exports = router;