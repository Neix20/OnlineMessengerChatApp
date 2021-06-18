const moment = require('moment');

let messages = []

function newMsg(name, message) {
    return {
        "name": name,
        "msg": message,
        "color": "red"
    }
}

module.exports = {
    messages,
    newMsg
}