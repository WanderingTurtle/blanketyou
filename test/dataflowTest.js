const chai = require('chai')
const expect = require('chai').expect
chai.use(require('chai-http'))
const app = require('../index.js')

describe('Dataflow test, test whether requests are handled correctly.', () => {
    //this.timeout(5000)
    let single_test_message = {
        object: "page",
        entry: [{
            id: "test_page_id",
            time: 0000000000,
            messaging: [
                {
                    sender: {id: "test_sender_id_1"},
                    recipient: {id: "test_rec_id_1"},
                }
            ]
        }]
    }

    let multi_test_message = {
        object: "page",
        entry: [{
            id: "test_page_id",
            time: 0000000000,
            messaging: [
                {
                    sender: {id: "test_sender_id_1"},
                    recipient: {id: "test_rec_id_1"},
                },
                {
                    sender: {id: "test_sender_id_2"},
                    recipient: {id: "test_rec_id_2"},
                },
                {
                    sender: {id: "test_sender_id_3"},
                    recipient: {id: "test_rec_id_3"},
                },
                {
                    sender: {id: "test_sender_id_4"},
                    recipient: {id: "test_rec_id_4"},
                }
            ]
        }]
    }

    it('message received by webhook should return status 200', () => {
        return chai.request(app).post('/webhook')
          .send(single_test_message)
          .then(res => {
              expect(res).to.have.status(200)
          })
    })

    it('messages received by webhook should return status 200', () => {
        return chai.request(app).post('/webhook')
          .send(multi_test_message)
          .then(res => {
              expect(res).to.have.status(200)
          })
    })
})
