const FBConfig = require('../../config/fbConfig')
const log = require('./logger.js').getLogger("message sender")
var request = require('request-promise-native')
var session = require('./session')

exports.sendTextMessage = async (event_context) => {
    var messageData = {
        recipient: {
            id: event_context.session.psid
        },
        message: {
            text: event_context.next_message
        }
    }
    console.log("message sender:\nsending request to %s", event_context.session.psid)
    console.log("message sender:\nsending message: ", event_context.next_message)
    await request({
        uri: FBConfig.BASE_URL, // facebook api
        qs: {access_token: FBConfig.TOKEN}, // facebook api access token
        method: 'POST',
        body: messageData,
        json: true
    }).then((response) => {
        console.log("message sender\nresponse from %s", messageData.recipient.id)
        if (response.statusCode == 200) {
            let recipientId = response.body.recipient_id;
            let messageId = response.body.message_id;
            console.log("message sender\n", body)
            if (messageId) {
                log.info("Successfully sent message with id %s to recipient %s", messageId, recipientId);
            } else {
                log.info("Successfully called Send API for recipient %s", recipientId);
            }
        }
        session.updateSession(event_context)
    }).catch(err => {
        console.log("message sender\nFailed calling send API for %s", messageData.recipient.id)
        log.error("Failed calling Send API for %s, %s", messageData.recipient.id, JSON.stringify(err));
    }) 
}