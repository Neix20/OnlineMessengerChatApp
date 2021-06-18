const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const socket = require('socket.io');
const {
    users,
    userJoin,
    findUser,
    userLeave
} = require('./utils/user.js');

const {
    messages,
    newMsg
} = require('./utils/messages.js');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// //enable https
// var https = require('https');
// https.createServer(app).listen(443);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/json/message', (req, res) => {
    fs.access('./json/message.json', err => {
        if (err) {
            res.send("Nothing to show....");
            return;
        }

        fs.readFile('./json/message.json', 'utf8', (err, data) => {
            res.send(data);
        });
    });
});

app.delete('/json/message', (req, res) => {
    fs.access('./json/message.json', err => {
        if (err) {
            return;
        }

        fs.writeFile('./json/message.json', "", () => {});
    });
    res.redirect('/');
});

// //redirect traffic to https
// app.get('*', (req, res) => {
//     res.redirect('https://' + req.headers.host + req.url);
// });

const PORT = process.env.PORT || 3000;

server.listen(PORT, _ => {
    console.log(`Server started at Port ${PORT}`);
});

var count = 0;

io.on('connection', socket => {

    // fs.access('./json/message.json', err => {
    //     if(err){
    //         return;
    //     }

    //     fs.readFile('./json/message.json', 'utf8', (err, data) => {
    //         let temp = JSON.parse(data);
    //         io.emit('loadMsg', temp.messages);
    //     });
    // });

    //When Someone connects
    socket.on('user', data => {
        data.count = count;
        count += 1;
        socket.broadcast.emit('user', data);
        io.emit('active', users);
        userJoin(data.name, data.color, data.count, socket.id);
    });

    //When someone disconnects
    socket.on('disconnect', data => {
        io.emit('dis', findUser(socket.id));
        userLeave(socket.id);
    });

    //When someone message
    socket.on('msg', data => {
        let temp = findUser(socket.id);
        temp.msg = data.msg;

        console.log(temp);

        socket.broadcast.emit('msg', newMsg(data.name, data.msg));

        fs.access('./json/message.json', (err) => {
            if (err) {
                let new_msg_json = {};
                let tmpArr = [];
                tmpArr.push(temp);
                new_msg_json.messages = tmpArr;
                fs.writeFile("./json/message.json", JSON.stringify(new_msg_json), () => {});
                return;
            }

            fs.readFile('./json/message.json', 'utf8', (err, d2) => {
                let tmp2 = (d2 == "") ? { "messages": [] } : JSON.parse(d2);
                tmp2.messages.push(temp);
                fs.writeFile("./json/message.json", JSON.stringify(tmp2), () => {});
            });
        });
    });

    //When someone types
    socket.on('typing', data => {
        socket.broadcast.emit('typing', data);
    });
});