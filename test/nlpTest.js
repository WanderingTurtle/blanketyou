const chai = require('chai')
const expect = require('chai').expect
const nlp = require('../api/services/nlp')
const questions = require('../config/questionMapping.js')

let message_greetings = {
    nlp: {
        entities: {
            greetings: [{
                confidence: 0.99,
                value: true
            }]
        }
    },
    text: "hello"
}

let message_identity = {
    nlp: {
        entities: {
            sentiment: [{
                confidence: 0.5
            }]
        }
    },
    text: "to donate"
}

let message_quantity = {
    nlp: {
        entities: {
            sentiment: [{
                confidence: 0.5
            }]
        }
    },
    text: "7"
}

let message_location = {
    nlp: {
        entities: {
            location: [{
                confidence: 0.98,
                value: "1234 Lang street, Madison"
            }]
        }
    },
    text: "1234 Lang street, Madison"
}

let message_email = {
    nlp: {
        entities: {
            email: [{
                confidence: 0.98,
                value: 'abc@wisc.edu'
            }]
        }
    },
    text: 'abc@wisc.edu'
}

let context_new = {
    session: {_id: '11111111111111'},
    new_session: {psid: '2222222222222222'},
    event: {message: null}
}

let context_identity = {
    session: {_id: '11111111111111', last_question: 'identity'},
    new_session: {},
    event: {message: null}
}

let context_quantity = {
    session: {_id: '11111111111111', last_question: 'blanket_quantity', identity: 'donor'},
    new_session: {},
    event: {message: null}
}

let context_location = {
    session: {_id: '11111111111111', last_question: 'location', identity: 'donor', confirmed_questions: ["blanket_quantity"]},
    new_session: {},
    event: {message: null}
}

let context_email = {
    session: {_id: '11111111111111', last_question: 'email', identity: 'donor', confirmed_questions: ["blanket_quantity", "location"]},
    new_session: {},
    event: {message: null}
}

// -----------------TEST CASE 1----------------------------------------------------------

let context_case1 = {
    session: {_id: '11111111111111'},
    new_session: {},
    event: {message: null}
}

let message_case1_greeting = {

}

let message_case1_identity = {

}

let message_case1_quantity = {

}

let message_case1_location = {

}

let message_case1_email = {

}

//---------------------------------------------------------------------------------

describe('Tests for nlp.js', () => {
    it('nlp should respond correctly to greetings', () => {
        context_new.event.message = message_greetings
        return nlp.nlpSwitch(null, context_new)
            .then(() => {
                expect(questions.identity.includes(context_new.next_message))
            })
    })

    it('nlp should respond correctly to identity', () => {
        context_identity.event.message = message_identity
        return nlp.nlpSwitch(null, context_identity)
            .then(() => {
                expect(questions.blanket_quantity.donor.includes(context_identity.next_message))
            })
    })

    it('nlp should respond correctly to quantity', () => {
        context_quantity.event.message = message_quantity
        return nlp.nlpSwitch(null, context_quantity)
            .then(() => {
                expect(questions.location.donor.includes(context_quantity.next_message))
            })
    })

    it('nlp should respond correctly to location', () => {
        context_location.event.message = message_location
        return nlp.nlpSwitch(null, context_location)
            .then(() => {
                expect(questions.email.includes(context_location.next_message))
            })
    })

    it('nlp should respond correctly to email', () => {
        context_email.event.message = message_email
        return nlp.nlpSwitch(null, context_email)
            .then(() => {
                console.log(context_email.next_message)
                expect(context_email.next_message.includes(" "))
            })
    })
})