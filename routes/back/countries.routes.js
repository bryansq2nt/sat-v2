const {Router} = require('express');
const router = Router();

const { countryList } = require('@controllers/back/countries.controllers');

router.get('/api/countries-list', countryList);

module.exports = router;