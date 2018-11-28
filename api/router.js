const express = require('express')
const router = express.Router()

let staticResponse = require('./staticResponse.js')
router.use(staticResponse)

let querySession = require('./services/sessionFilter').querySession
router.use(querySession)

module.exports = router