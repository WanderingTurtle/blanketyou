var mongoose = require('mongoose')
var Schema = mongoose.Schema

const timestamp_spec = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}

var sessionSchema = new Schema({
    psid: {type: String, required: true}, // facebook user id
    identity: {type: String},            // donor, donee, or admin
    last_question: {type: String},
    confirmed_answers: [{type: String}]
}, {
    timestamps: timestamp_spec
})

var session = mongoose.model('Session', sessionSchema)
exports.Session = session
