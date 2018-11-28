var nlp = require('./nlp.js')

const TIMEOUT = 86500000 // about one day
var SessionModel = require('./dbModel').Session

exports.querySession = (req, res, next) => {
    // console.log('hello session')
    res.locals.sessions = []
    let messaging_events = req.body.entry[0].messaging
    for (let event of messaging_events) {
        SessionModel.findOne({psid: event.sender.id}, {}, {sort: {'updated_at':-1}}, (err, session) => {
            if(err) {
                // TODO
                // handle error response
            } else {
                var curr_time = new Date().getTime()
                var event_context = {event: event}
                if (!session) {
                    event_context.session = new SessionModel({psid: event.sender.id})
                    event_context.new = true
                    res.locals.sessions.push(event_context)
                } else if (curr_time - session.updated_at > TIMEOUT) {
                    event_context.session = new SessionModel({psid: event.sender.id})
                    event_context.new = true
                    res.locals.sessions.push(event_context)
                } else {
                    event_context.session = session
                    event_context.new = true
                    res.locals.sessions.push(event_context)
                }
                // TODO
                // handle successful responses
                nlp.testfunc()
            }
        })
    }
    next()
}