const express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello world, I am a chat bot')
})

module.exports = router