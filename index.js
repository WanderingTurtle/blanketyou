const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
// const path = require("path")
const mongoose = require('mongoose')
const appConfig = require('./config/appConfig.js')
const {db: {host, port, name}} = appConfig
const DB_URI = 'mongodb://' + host+ ':' + port + '/'+ name
const routes = require("./api/router.js")

mongoose.connect(DB_URI, { useNewUrlParser: true })
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'DB connection error: '))

app.use(bodyParser.json())
app.use(cors())

app.use('', routes)
db.once('open', () => {
    app.listen(appConfig.app.port, () => {
        console.log('app running on port', appConfig.app.port)
    })
})

module.exports = app;