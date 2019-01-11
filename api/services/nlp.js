var log = require('./logger.js').getLogger('nlp')
var sender = require('./messageSender.js')
var confidenceLevel = require('../../config/confidenceLevel.js')
var questionMappings = require('../../config/questionMapping.js')
var matcher = require('./doneeMatcher.js')
var user = require('./user.js')

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
    console.log("nlp\n", result)
}

// @param event_context defined in sessionFilter.js
exports.nlpSwitch = async(err, event_context) => {
    // TODO save everything to event_context
    //      save response to user in event_context.next_message
    if (err) {
        // TODO handle error messages
    } else {
        let message = event_context.event.message
        console.log("nlp\n message format",message)
        let entity = message.nlp.entities
        let session = event_context.session
        session.user = {_id: session.psid}
        console.log("nlp\n entity", entity)
        if (entity && entity.greetings && entity.greetings[0].value === 'true') {
            // TODO try to check identity, and provide information about this org
            //      if identity is confirmed in user text, ask first question
            //      if not, ask identity question, set last_question to "identity"
            let identity = judgeIdentity(message.text)
            console.log("nlp\n", identity)
            if (identity === "donor") {
                // TODO if identity is provided as donor
                session.identity = "donor"
                let ran = random(questionMappings.blanket_quantity['donor'].length)
                event_context.next_message = questionMappings.blanket_quantity['donor'][ran]
            } else if (identity === "donee") {
                // TODO if identity is provided as donee
                session.identity = "donee"
                let ran = random(questionMappings.blanket_quantity['donee'].length)
                event_context.next_message = questionMappings.blanket_quantity['donee'][ran]
            } else {
                event_context.new_session.last_question = "identity"
                let ran = random(questionMappings.identity.length)
                event_context.next_message = questionMappings.identity[ran]
            }
        } else if (entity && entity.bye && entity.bye[0].confidence > confidenceLevel.bye) {
            // TODO handle bye messages
            let ran = random(questionMappings.bye.length)
            event_context.next_message = questionMappings.bye[ran]
        } else if (session.last_question === "identity") {
            // TODO handle identity answers
            let identity = judgeIdentity(message.text)
            if (identity === "donor") {
                // TODO if identity is provided as donor
                session.identity = "donor"
                let ran = random(questionMappings.blanket_quantity['donor'].length)
                event_context.next_message = questionMappings.blanket_quantity['donor'][ran]
            } else if (identity === "donee") {
                // TODO if identity is provided as donee
                session.identity = "donee"
                let ran = random(questionMappings.blanket_quantity['donee'].length)
                event_context.next_message = questionMappings.blanket_quantity['donee'][ran]
            } else {
                event_context.new_session.last_question = "identity"
                let ran = random(questionMappings.error_again.length)
                event_context.next_message = questionMappings.error_again[ran]
                ran = random(questionMappings.identity.length)
                event_context.next_message += questionMappings.identity[ran]
            }
        } 
        // questions that count toward confirmed_questions
        if (session.identity) {
            if (
                entity &&
                entity.quantity && 
                entity.quantity[0].confidence > confidenceLevel.quantity &&
                session.last_question === "blanket_quantity"
            ) {
                // TODO update blanket quantity
                // TODO update session
                // TODO ask next question
                session.confirmed_questions.push("blanket_quantity")
                let quantity = entity.quantity.value
                session.user.quantity =  quantity
                let ran = random(questionMappings.location.length)
                event_context.next_message = questionMappings.location[ran]
                session.last_question = "location"
            } else if (
                entity &&
                entity.location &&
                entity.location[0].confidence > confidenceLevel.location &&
                session.last_question === "location"
            ) {
                // TODO update donor/donee address
                // TODO update session
                // TODO ask next question
                session.confirmed_questions.push("location")
                let addr = entity.location.value
                session.user.address = addr
                let ran = random(questionMappings.email.length)
                event_context.next_message = questionMappings.email[ran]
                session.last_question = "email"
            } else if (
                entity &&
                entity.email &&
                entity.email[0].confidence > confidenceLevel.email &&
                session.last_question === "email"
            ) {
                // TODO update donor/donee email
                // TODO update session
                // TODO ask next question
                session.confirmed_questions.push("email")
                let email = entity.email.value
                session.user.email = email
            } else {
                // TODO handle unknown messages
                console.log("nlp\nreceived unknown message")
                // TODO ask last question again
                let last = session.last_question
                let ran = random(questionMappings[last].length)
                event_context.next_message = questionMappings[last][ran]
            }
            // prepare something different for asking last question before matching
            if (questionMappings.questions.length === session.confirmed_questions.length + 1) {
                // TODO
                if (session.identity === "donor") {
                    event_context.next_message += " (After this question, matching process will start. The matching process could take a while, thank you for your patience)"
                }
                if (session.identity === "donee") {
                    event_context.next_message += " (After this question, information you provided will be stored in our database.)"
                }
            }
            // start donee matching process for donor or simply storing donee information
            // register/update user information
            if (
                questionMappings.questions.length === session.confirmed_questions.length &&
                session.last_question !== "done"
            ) {
                // TODO
                switch(session.identity) {
                    case "donor":
                        await matcher.match(session.user)
                            .then(donees => {            
                                if (donees && donees.length > 0) {
                                    event_context.next_message = "Your help means a lot to them: " + stringfyUserInfo(donees)
                                } else {
                                    event_context.next_message = "We did not find anyone that needs help."
                                }
                            })
                            .catch(error => {
                                console.log(error)
                                log.error(error)
                                let ran = random(questionMappings.error.length)
                                event_context.next_message = questionMappings.error[ran]
                            })
                        break;
                    case "donee":
                        user.update(event_context)
                        event_context.next_message = "Your information is registered. " + stringfyUserInfo(event_context.session.user)
                        break;
                    default:
                        console.log("Found unknown identity")
                        let ran = random(questionMappings.error.length)
                        event_context.next_message = questionMappings.error[ran]
                        break;
                }
                event_context.session.last_question = "done"
            } else {
                let ran = random(questionMappings.done.length)
                event_context.next_message = questionMappings.done[ran]
            }
        }
    }
    sender.sendTextMessage(event_context)
}

function judgeIdentity (text) {
    let tmp_text = text.toLowerCase()
    if (
        tmp_text.indexOf('to donate') > -1 ||
        tmp_text.indexOf('have') > -1 ||
        tmp_text.indexOf('donation') > -1 || 
        tmp_text.indexOf('todonate') > -1) {
        return 'donor'
    } else if (
        tmp_text.indexOf('need') > -1 || 
        tmp_text.indexOf('help') > -1 ||
        tmp_text.indexOf('blanket') > -1) {
        return 'donee'
    } else {
        return 'unknown'
    }
}

function random(bound) {
    return Math.floor(Math.random() * bound)
}

function stringfyUserInfo(userList) {
    let results = ""
    for (let user of userList) {
        for (let key of Object.keys(user)) {
            // TODO need to find how messenger break lines
        }
    }
    return results
}