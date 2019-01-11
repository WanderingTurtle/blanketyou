// Provide mapping between question id and actual questions to be asked.
// Sentences are stored in an array to allow randomization

const QuestionMappings = {
    questions: [
        "blanket_quantity", "email", "location"
    ],
    error_again: [
        "Sorry, I don't understand. Let me ask you again. "
    ],
    error: [
        "Sorry, something was wrong during the process, I have notify my manager.",
        "I'm sorry, something was wrong. I have asked my manager to fix this.",
        "Sorry, something was wrong, I could not proceed further."
    ],
    greetings: [
        "Hello! We are Blanketyou community. We match blanket donors with donees. If you want to donate, we will provide you donee information. If you want to receive some help, you can provide your contact information to us."
    ],
    blanket_quantity: {
        donor: [
            "How many blankets do you want to donate?"
        ],
        donee: [
            "How many blankets do you need? A rough number would be great."
        ] 
    },
    location: {
        donor: [
            "Do you have a preference for location?"
        ],
        donee: [
            "May I know your specific address? Please make sure your address is accurate."
        ]
    },
    email: [
        "What is your email address?"
    ],
    identity: [
        "Do you have some blankets for donation? Or do you want to receive some help?",
        "Do you want to donate some blankets? Or do you need some help?"
    ],
    bye: [
        "Goodbye."
    ],
    done: [
        "That was all I can do, I have to say goodbye.",
        "This is all I can offer, if you need to do this again, please come by tomorrow."
    ]
}

module.exports = QuestionMappings