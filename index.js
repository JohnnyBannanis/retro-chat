const path = require('path');
const express = require('express');
const app = express();
const users = [];

// Settings
app.set('port', process.env.PORT || 3000);

// static files
app.use(express.static(path.join(__dirname, '/public')));

// Start the server
const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

// websocket
const SocketIO = require('socket.io');
const io = SocketIO(server);


io.on('connection', (socket) => {
    console.log('New connection', socket.id)
    console.log(users)
    socket.on('new_user', (data, callback) => {
        if(users.includes(data)){
            callback(false);
        } else {
            callback(true);
            socket.user = data;
            users.push(socket.user);
            io.sockets.emit('usernames', users);
        };
    });
    socket.on('chat_message', (data) => {
        console.log(data);
        io.sockets.emit('chat:message', data);
    });

    socket.on('disconnect', (data) => {
        if(!socket.user) return;
        users.splice(users.indexOf(socket.user), 1);
        io.sockets.emit('usernames', users);
    });
});