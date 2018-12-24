// Provide mapping between question id and actual questions to be asked.
// Sentences are stored in an array to allow randomization

const QuestionMappings = {
    questions: [
        "blanket_quantity", "email", "identity", "location"
    ],
    error: [
        "Sorry, I don't understand."
    ],
    greetings: [
        "Hello! What can I help you?"
    ],
    blanket_quantity: {
        donor: [
            "How many blankets do you want to donate?"
        ],
        donee: [
            "How many blankets do you need?"
        ] 
    },
    location: {
        donor: [
            "Do you have a preference for location?"
        ],
        donee: [
            "May I know your specific address?"
        ]
    },
    email: [
        "What is your email address?"
    ],
    identity: [
        "Do you want to donate some blankets?"
    ]
}

module.exports = QuestionMappings