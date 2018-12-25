const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
// const path = require("path")
const mongoose = require('mongoose')
const appConfig = require('./config/appConfig.js')
const log = require('./api/services/logger.js')
const {db: {host, port, name}} = appConfig
const DB_URI = 'mongodb://' + host+ ':' + port + '/'+ name
const routes = require("./api/router.js")

mongoose.connect(process.env.MONGODB_URI || DB_URI, { useNewUrlParser: true })
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'DB connection error: '))

app.use(log.connectLogger(log.getLogger('http'), {level: 'auto'}))
app.use(bodyParser.json())
app.use(cors())

app.use('', routes)
db.once('open', () => {
    let listener = app.listen(process.env.PORT || appConfig.app.port, () => {
        let port = listener.address().port
        console.log('app running on port', port)
        // log.getLogger('index.js').info('app running on port', appConfig.app.port)
    })
})

module.exports = app;