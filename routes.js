const express = require('express');

const router = express.Router();
const controller = require('./controller/index');

router.post('/api/extract-image', controller);

module.exports = router;
