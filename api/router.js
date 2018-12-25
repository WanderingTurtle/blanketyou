const express = require('express')
const router = express.Router()

let staticResponse = require('./staticResponse.js')
router.use(staticResponse)

let msgSwitch = require('./services/session').messageSwitch
router.use(msgSwitch)

module.exports = router