const express = require('express')
const router = express.Router()

let staticResponse = require('./staticResponse.js')
router.use(staticResponse)

module.exports = router