var mongoose = require('mongoose')
var Schema = mongoose.Schema

const timestamp_spec = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}

var sessionSchema = new Schema({
    psid: {type: String, required: true}, // facebook user id
    identity: {type: String},             // donor, donee, or admin
    last_question: {type: String},
    confirmed_questions: [{type: String}]
}, {
    timestamps: timestamp_spec
})

var donorSchema = new Schema({
    _id: {type: String, required: true}, // use psid as _id
    email: {type: String, default: "Not provided"},
    quantity: {type: Number, default: 0},
    address: {type: String, default: "Not provided"},
}, {
    timestamps: timestamp_spec
})

var doneeSchema = new Schema({
    _id: {type: String, required: true}, // use psid as _id
    email: {type: String, default: "Not provided"},
    quantity: {type: Number, default: 0},
    address: {type: String, default: "Not provided"},
    recommend_times: {type: Number, default: Number.MIN_SAFE_INTEGER} // −9007199254740991
}, {
    timestamps: timestamp_spec
})

var session = mongoose.model('Session', sessionSchema)
var donor = mongoose.model('Donor', donorSchema)
var donee = mongoose.model('Donee', doneeSchema)

exports.Session = session
exports.Donor = donor
exports.Donee = donee