const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const {criterionList} = require('@controllers/back/criterion.controllers');

router.get('/api/criterion/list', usersTokenVerification, criterionList);

module.exports = router;