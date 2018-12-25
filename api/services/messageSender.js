const log = require('./logger.js').getLogger("message sender")
var request = require('request-promise-native')
var session = require('./sessionFilter')

exports.sendTextMessage = async (event_context) => {
    var messageData = {
        recipient: {
            id: event_context.session.psid
        },
        message: {
            text: event_context.next_message, // TODO
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    }
    console.log("sending request to %s", event_context.session.psid)
    await request({
        uri: '', // facebook api
        qs: {access_token: "TODO"}, // facebook api access token
        method: 'POST',
        body: messageData,
        json: true
    }).then((response) => {
        console.log("response from %s", messageData.recipient.id)
        if (response.statusCode == 200) {
            let recipientId = body.recipient_id;
            let messageId = body.message_id;
            if (messageId) {
                log.info("Successfully sent message with id %s to recipient %s", messageId, recipientId);
            } else {
                log.info("Successfully called Send API for recipient %s", recipientId);
            }
        }
        session.updateSession(event_context)
    }).catch(err => {
        console.log("Failed calling send API for %s", messageData.recipient.id)
        log.error("Failed calling Send API for %s, %s", messageData.recipient.id, JSON.stringify(err));
    }) 
    session.updateSession(event_context)
}