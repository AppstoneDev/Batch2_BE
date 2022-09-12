const express = require('express')
const router = express.Router();
const artistRoute = require('./artist')

router.use(artistRoute);





module.exports = router