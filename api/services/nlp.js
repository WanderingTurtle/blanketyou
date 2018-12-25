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
        let event = event_context.event
        let session = event_context.session
        console.log("hello")
        if (event.greetings && event.greetings.confidence > confidenceLevel.greetings) {
            // TODO try to check identity, 
            //      if identity is checked, ask first question
            //      if not, ask identity question, set last_question to "identity"
        } else if (event.bye && event.bye.confidence > confidenceLevel.bye) {
            // TODO handle bye messages
        } else if (session.last_question === "identity") {
            // TODO handle identity answers
        } else if (
            event.quantity && 
            event.quantity.confidence > confidenceLevel.quantity &&
            session.last_question === "blanket_quantity"
        ) {
            // TODO update blanket quantity
            // TODO update session
            // TODO ask next question
        } else if (
            event.location &&
            event.location.confidence > confidenceLevel.location &&
            session.last_question === "location"
        ) {
            // TODO update donor/donee address
            // TODO update session
            // TODO ask next question
        } else if (
            event.email &&
            event.email.confidence > confidenceLevel.email &&
            session.last_question === "email"
        ) {
            // TODO update donor/donee email
            // TODO update session
            // TODO ask next question
        } else {
            // TODO handle unknown messages
        }
        // prepare something different for asking last question before matching
        if (questionMappings.questions.length === session.confirmed_questions.length + 1) {
            // TODO
        }
        // start donee matching process for donor or simply storing donee information
        if (questionMappings.questions.length === session.confirmed_questions.length) {
            // TODO     
        }
    }
    sender.sendTextMessage(event_context)
}