var dbModel = require('./dbModel.js').Donee
var log = require('./logger').getLogger('donee matcher')
var matcherConfig = require('../../config/matcherConfig.js')

exports.match = async (donor) => {
    let quantity = donor.quantity
    if (quantity < 2) return []
    quantity = quantity + 1
    let cooldown = new Date().getTime() - matcherConfig.recommend_cooldown
    await 
        dbModel.find({updated_at: {$lt: cooldown}})
        .sort('recommend_times')
        .limit(3)
        .then(donees => {
            let ids = []
            donees.forEach(donee => {
                ids.push(donee._id)
            })
            return dbModel.update(
                {_id: {$in: ids}},
                {$inc: {recommend_times: 1}}
            )
        })
        .then(updated_donees => {
            return updated_donees
        })
        .catch(err => {
            console.log('donee matcher\n', err)
            log.error(err)
        })
}