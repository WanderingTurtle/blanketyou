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
    console.log("nlp:\n", result)
}

// @param event_context defined in sessionFilter.js
exports.nlpSwitch = async(err, event_context) => {
    // TODO save everything to event_context
    //      save response to user in event_context.next_message
    let message = event_context.event.message
    console.log("nlp:\n message format",message)
    let entity = message.nlp.entities
    let session = event_context.session
    let confirm_count = session.confirmed_questions? 0 : session.confirmed_questions.length
    let new_session = event_context.new_session
    new_session["$set"] = {}
    if (err) {
        // TODO handle error messages
    } else {
        console.log("nlp:\n entity", entity)
        if (entity && entity.greetings && entity.greetings[0].confidence > confidenceLevel.greetings) {
            // TODO try to check identity, and provide information about this org
            //      if identity is confirmed in user text, ask first question
            //      if not, ask identity question, set last_question to "identity"
            let identity = judgeIdentity(message.text)
            console.log("nlp:\n", identity)
            event_context.next_message = "Hello! "
            if (identity === "donor") {
                // TODO if identity is provided as donor
                new_session["$set"].identity = "donor"
                let ran = random(questionMappings.blanket_quantity['donor'].length)
                event_context.next_message += questionMappings.blanket_quantity['donor'][ran]
            } else if (identity === "donee") {
                // TODO if identity is provided as donee
                new_session["$set"].identity = "donee"
                let ran = random(questionMappings.blanket_quantity['donee'].length)
                event_context.next_message += questionMappings.blanket_quantity['donee'][ran]
            } else {
                new_session["$set"].last_question = "identity"
                let ran = random(questionMappings.identity.length)
                event_context.next_message += questionMappings.identity[ran]
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
                new_session["$set"].identity = "donor"
                let ran = random(questionMappings.blanket_quantity['donor'].length)
                event_context.next_message = questionMappings.blanket_quantity['donor'][ran]
                new_session["$set"].last_question = "blanket_quantity"
            } else if (identity === "donee") {
                // TODO if identity is provided as donee
                new_session["$set"].identity = "donee"
                let ran = random(questionMappings.blanket_quantity['donee'].length)
                event_context.next_message = questionMappings.blanket_quantity['donee'][ran]
                new_session["$set"].last_question = "blanket_quantity"
            } else {
                new_session["$set"].last_question = "identity"
                let ran = random(questionMappings.error_again.length)
                event_context.next_message = questionMappings.error_again[ran]
                ran = random(questionMappings.identity.length)
                event_context.next_message += questionMappings.identity[ran]
            }
        } 
        // questions that count toward confirmed_questions
        if (session.identity) {
            new_session["$push"] = {}
            new_session["$set"].user = {}
            if (
                event_context.new_session.last_question === "blanket_quantity"
            ) {
                // TODO update blanket quantity
                // TODO update session
                // TODO ask next question
                let quantity = parseInt(message)
                console.log("nlp quantity:\n", quantity)
                if (quantity) {
                    new_session["$push"].confirmed_questions = "blanket_quantity"
                    confirm_count += 1
                    let quantity = entity.quantity.value
                    new_session["$set"]["user.quantity"] =  quantity
                    let ran = random(questionMappings.location.length)
                    event_context.next_message = questionMappings.location[ran]
                    new_session["$set"].last_question = "location"
                } else {
                    let ran = random(questionMappings["blanket_quantity"].length)
                    event_context.next_message = questionMappings.error_again[0] + questionMappings["blanket_quantity"][ran]
                }
            } else if (
                entity &&
                entity.location &&
                entity.location[0].confidence > confidenceLevel.location &&
                session.last_question === "location"
            ) {
                // TODO update donor/donee address
                // TODO update session
                // TODO ask next question
                new_session["$push"].confirmed_questions = "location"
                confirm_count += 1
                let addr = entity.location.value
                new_session["$set"]["user.address"] = addr
                let ran = random(questionMappings.email.length)
                event_context.next_message = questionMappings.email[ran]
                new_session["$set"].last_question = "email"
            } else if (
                entity &&
                entity.email &&
                entity.email[0].confidence > confidenceLevel.email &&
                session.last_question === "email"
            ) {
                // TODO update donor/donee email
                // TODO update session
                // TODO ask next question
                new_session["$push"].confirmed_questions = "email"
                confirm_count += 1
                let email = entity.email.value
                new_session["$set"]["user.email"] = email
            } else {
                // TODO handle unknown messages
                console.log("nlp:\nreceived unknown message")
                // TODO ask last question again
                let last = session.last_question
                // check if the question is already confirmed.
                if (
                    !session.identity ||
                    session.identity === "unknown" ||
                    (
                        last !== "identity" && 
                        session.confirmed_questions.indexOf(last) === -1
                    )
                ) {
                    let ran = random(questionMappings[last].length)
                    event_context.next_message = questionMappings[last][ran]    
                } else {
                    next_message = "Ohoooo, I don't understand."
                }
            }
            // prepare something different for asking last question before matching
            if (questionMappings.questions.length === confirm_count + 1) {
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
                questionMappings.questions.length === confirm_count &&
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
                        event_context.next_message = "Your information is registered."
                        break;
                    default:
                        console.log("Found unknown identity")
                        let ran = random(questionMappings.error.length)
                        event_context.next_message = questionMappings.error[ran]
                        break;
                }
                new_session["$set"].last_question = "done"
            }
            
            if (session.last_question === "done") {
                let ran = random(questionMappings.done.length)
                event_context.next_message = questionMappings.done[ran]
            }
        }
    }
    console.log(event_context)
    if (!event_context.next_message) {
        let ran = random(questionMappings.unsure.length)
        event_context.next_message = questionMappings.unsure[ran]
        if (session.last_question) {
            let last = session.last_question
            ran  = questionMappings[last].length
            event_context.next_message += questionMappings[last][ran]
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

function isNumber(text) {

}