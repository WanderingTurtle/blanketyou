var log = require('./logger.js').getLogger('nlp')
var sender = require('./messageSender.js')
var confidenceLevel = require('../../config/confidenceLevel.js')
var questionMappings = require('../../config/questionMapping.js')

// Do use async functions here and await here
//
// Basic function layout 
//
exports.testfunc = async () => {
    // Do something that needs time
    // When the function is not a promise, turn it to promise like this
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 1000) // something that needs time to run 
    })
    let result = await promise

    // When the function is not a promise (e.g. foo() returns a promise), do the following
    // let result = await foo()
    console.log(result)
}

// @param event_context defined in sessionFilter.js
exports.nlpSwitch = async(err, event_context) => {
    // TODO save everything to event_context
    //      save response to user in event_context.next_message
    if (err) {
        // TODO handle error messages
    } else {
        let message = event_context.event.message
        console.log(message)
        log.info('message format: \n', message)
        let nlp = message.nlp
        let session = event_context.session
        if (nlp && nlp.greetings && nlp.greetings.confidence > confidenceLevel.greetings) {
            // TODO try to check identity, and provide information about this org
            //      if identity is confirmed in user text, ask first question
            //      if not, ask identity question, set last_question to "identity"
            let identity = judgeIdentity(message.text)
            console.log(identity)
            if (identity === "donor") {
                // TODO if identity is provided as donor
            } else if (identity === "donee") {
                // TODO if identity is provided as donee
            } else {
                event_context.new_session.last_question = "identity"
                let ran = random(Math.random(), questionMappings.identity.length)
                event_context.next_message = questionMappings.identity[ran]
            }
        } else if (nlp && nlp.bye && nlp.bye.confidence > confidenceLevel.bye) {
            // TODO handle bye messages
        } else if (session.last_question === "identity") {
            // TODO handle identity answers
        } else if (
            nlp &&
            nlp.quantity && 
            nlp.quantity.confidence > confidenceLevel.quantity &&
            session.last_question === "blanket_quantity"
        ) {
            // TODO update blanket quantity
            // TODO update session
            // TODO ask next question
        } else if (
            nlp &&
            nlp.location &&
            nlp.location.confidence > confidenceLevel.location &&
            session.last_question === "location"
        ) {
            // TODO update donor/donee address
            // TODO update session
            // TODO ask next question
        } else if (
            nlp &&
            nlp.email &&
            nlp.email.confidence > confidenceLevel.email &&
            session.last_question === "email"
        ) {
            // TODO update donor/donee email
            // TODO update session
            // TODO ask next question
        } else {
            // TODO handle unknown messages
            console.log("received unknown message")
        }
        // prepare something different for asking last question before matching
        if (questionMappings.questions.length === session.confirmed_questions.length + 1) {
            // TODO
        }
        // start donee matching process for donor or simply storing donee information
        // register/update user information
        if (questionMappings.questions.length === session.confirmed_questions.length) {
            // TODO     
        }
    }
    sender.sendTextMessage(event_context)
}

function judgeIdentity (text) {
    let tmp_text = text.toLowerCase()
    if (tmp_text.indexOf('to donate') > -1 || tmp_text.indexOf('todonate') > -1) {
        return 'donor'
    } else if (tmp_text.indexOf('need') > -1 || tmp_text.indexOf('blanket') > -1) {
        return 'donee'
    } else {
        return 'unknown'
    }
}

function random(ran, bound) {
    return Math.floor(ran * bound)
}