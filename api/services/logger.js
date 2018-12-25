const config = require('../../config/logConfig')
const logger = require('log4js')

logger.configure(config)

module.exports = logger