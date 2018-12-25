const logConfig = {
    appenders: {
        access: {
          type: "dateFile",
          filename: "logs/access.log",
          pattern: "-yyyy-MM-dd",
          cateory: "http"
        },
        app: {
            type: "file",
            filename: "logs/app.log",
            maxLogSize: 10485760,
            numBackups: 3
        },
        errorFile: {
            type: "file",
            filename: "logs/errors.log"
        },
        errors: {
            type: "logLevelFilter",
            level: "ERROR",
            appender: "errorFile"
        }
    },
    categories: {
        default: { appenders: [ "app", "errors" ], level: "DEBUG" },
        http: { appenders: ["access"], level: "info" }
    }
}

module.exports = logConfig