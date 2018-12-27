const FACEBOOK_BASE_URL = "https://graph.facebook.com/v2.6/me/messages"
const TOKEN = "EAAMvRt2DzGUBAGUDACTPPjXeM5yPQJkA6x5VbnoH2tmOHwXvzzQ4Fu6r81jdpVjosrse3m7XkEVLPHRh98hrsJcA0xFDoNcLb1eoUd5ZCUcm0kyu5Uh03Efrvn9jpdzj0ZCV37SixDoYjZAlWBeDnohsnhsLRymE6JcntZBldPSjaGIPSGOt"
const log = require('./logger.js').getLogger("message sender")
var request = require('request-promise-native')
var session = require('./session')

exports.sendTextMessage = async (event_context) => {
    var messageData = {
        message_type: "RESPONSE",
        recipient: {
            id: event_context.session.psid
        },
        message: {
            text: event_context.next_message
        }
    }
    console.log("sending request to %s", event_context.session.psid)
    console.log("sending message: ", event_context.next_message)
    await request({
        uri: FACEBOOK_BASE_URL, // facebook api
        qs: {access_token: TOKEN}, // facebook api access token
        method: 'POST',
        body: messageData,
        json: true
    }).then((response) => {
        console.log("response from %s", messageData.recipient.id)
        if (response.statusCode == 200) {
            let recipientId = response.body.recipient_id;
            let messageId = response.body.message_id;
            console.log(body)
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
}