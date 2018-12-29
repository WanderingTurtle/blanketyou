var SessionModel = require("./dbModel").Session
var DonorModel = require("./dbModel").Donor
var DoneeModel = require("./dbModel").Donee

exports.queryNumOfDonors = async () => {
    await DonorModel.countDocuments()
        .then(num => {
            return num.toString()
        })
        .catch(err => {
            return "Something wrong\n" + JSON.stringify(err)
        })
}

exports.queryNumOfDonees = async () => {
    await DoneeModel.countDocuments()
        .then(num => {
            return num.toString()
        })
        .catch(err => {
            return "Something wrong\n" + JSON.stringify(err)
        })
}

exports.queryNumOfSessions = async () => {
    await SessionModel.countDocuments()
        .then(num => {
            return num.toString()
        })
        .catch(err => {
            return "Something wrong\n" + JSON.stringify(err)
        })
}