var log = require('./logger').getLogger('session filter')
var nlp = require('./nlp.js')

const TIMEOUT = 86500000 // about one day
var SessionModel = require('./dbModel').Session

exports.messageSwitch = (req, res, next) => {
    // console.log('hello session')
    for (let messaging_events of req.body.entry) {
        for (let event of messaging_events.messaging) {
            // console.log('hello')
            if (event.message) {
                querySession(event)
            } else {
                // TODO received unknown messaging event
            }
        }
    }
    next()
}

//
// event_context: {
//     event:object -> user event from a single facebook page
//     new:boolean -> whether the session is newly created
//     session:object -> user conversation session 
// }
//
async function querySession(event) {
    console.log('processing user %s', event.sender.id)
    await SessionModel.findOne({psid: event.sender.id}, {}, {sort: {'updated_at':-1}}, (err, session) => {
        if(err) {
            // TODO
            // handle error response
            // nlp.nlpSwitch(err, null)
        } else {
            var curr_time = new Date().getTime()
            var event_context = {event: event}
            if (!session) {
                event_context.session = new SessionModel({psid: event.sender.id})
                event_context.new = true
            } else if (curr_time - session.updated_at > TIMEOUT) {
                event_context.session = new SessionModel({psid: event.sender.id})
                event_context.new = true
            } else {
                event_context.session = session
                event_context.new = false
            }
            // TODO
            // handle successful responses
            // nlp.testfunc()
            nlp.nlpSwitch(null, event_context)
        }
    })
}

exports.updateSession = async (event_context) => {
    await SessionModel.findByIdAndUpdate(
        {_id: event_context.session._id}, 
        event_context.new_session,
        {new: true, upsert: true}
    ).then((err, session) => {
        if (err) {
            log.error(err)
        }
        if (!session) {
            log.error(new Error("No session was updated. Previous session: \n" + JSON.stringify(event_context.session)))
        }
    })
}