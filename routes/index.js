const express = require('express')
const router = express.Router();
const artistRoute = require('./artist')
const albumRoute = require('./album')

router.use(artistRoute);
router.use(albumRoute);




module.exports = router