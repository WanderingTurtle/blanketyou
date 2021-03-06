var log = require('./logger').getLogger('session filter')
var nlp = require('./nlp.js')

const TIMEOUT = 86500000 // about one day
var SessionModel = require('./dbModel').Session

exports.messageSwitch = (req, res, next) => {
    // console.log('hello session')
    console.log('session\n', req.body)
    if (Object.keys(req.body).length !== 0){
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
    console.log('session\nprocessing user %s', event.sender.id)
    await SessionModel.findOne({psid: event.sender.id}, {}, {sort: {'updated_at':-1}}, (err, session) => {
        if(err) {
            // TODO
            // handle error response
            // nlp.nlpSwitch(err, null)
        } else {
            let curr_time = new Date().getTime()
            let new_session = {psid: event.sender.id}
            let event_context = {event: event, new_session: new_session}
            if (!session) {
                event_context.session = new SessionModel(new_session)
            } else if (curr_time - session.updated_at > TIMEOUT) {
                event_context.session = new SessionModel(new_session)
            } else {
                event_context.session = session
                event_context.new_session = {}
            }
            // TODO
            // handle successful responses
            // nlp.testfunc()
            
            nlp.nlpSwitch(null, event_context)
        }
    })
}

exports.updateSession = async (event_context) => {
    console.log("session\nupdating session for user: %s", event_context.session._id)
    // delete empty update params
    let new_session = event_context.new_session
    for (let key of Object.keys(new_session)) {
        if (key.startsWith("$")) {
            let obj = new_session[key]
            if (Object.keys(obj).length === 0) {
                delete new_session[key]
            }
        }
    }
    await SessionModel.findByIdAndUpdate(
        event_context.session._id, 
        new_session,
        {new: true, upsert: true}
    ).then(
        session => {
            if (!session) {
                log.error(new Error("No session was updated. Previous session: \n" + JSON.stringify(event_context.session)))
            } else {
                console.log("session\nupdated session for %s", session._id)
                console.log("updated session: \n", session)
            }
        },
        err => {
            console.log("session\nFailed updating session for %s", event_context.session._id)
            console.log(err)
            log.error("Failed updating session for %s, %s", event_context.session._id, JSON.stringify(err));
        }
    )
}