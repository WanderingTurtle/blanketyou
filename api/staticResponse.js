const express = require('express')
var router = express.Router()

// keep connection with facebook messenger platform
router.post('/webhook', (req, res, next) => {
    res.sendStatus(200)
    next()
})

router.get('/webhook', (req, res, next) => {
    console.log(req.query)
    res.status(200)
    res.send(req.query.hub.challenge)
    next()
})

router.get('/', (req, res) => {
    res.send({text: 'Hello world, I am a chat bot'})
})


module.exports = router