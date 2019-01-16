var log = require('./logger').getLogger('register')
var Donor = require('./dbModel').Donor
var Donee = require('./dbModel').Donee

exports.register = async (identity, event_context) => {
    let dbModel = findModel(identity)
    if (dbModel === null) return
    let newUser = event_context.session.user
    newUser._id = event_context.session.psid
    await new dbModel(newUser).then(
        user => {
            console.log("user\nnew user %s created.", user._id)
            return user
        },
        err => {
            console.log("user\n", err)
            log.error(err)
        }
    )
}

exports.update = async (event_context) => {
    let dbModel = findModel(event_context.session.identity)
    if (dbModel === null) return
    let session = event_context.session
    let newUser = {$set:{}}
    for (let record of session.confirmed_questions) {
        let pair = record.split(',')
        let key = pair[0], val = pair[1]
        newUser['$set'][key] = val
    }
    newUser._id = event_context.session.psid
    await dbModel.findByIdAndUpdate(
        newUser._id, newUser, {new: true, upsert: true}
    ).then(
        user => {
            console.log("user\nupdated user %s", user._id)
            return user
        },
        err => {
            console.log("user\n", err)
            log.error(err)
        }
    )
}

function findModel(identity) {
    let dbModel
    switch (identity) {
        case "donor":
            dbModel = Donor
            break
        case "donee":
            dbModel = Donee
            break
        default:
            // TODO handle undefined
            dbModel = null
            return
    }
    return dbModel
}