const path = require('path');
const express = require('express');
const app = express();
const users = {};

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
    //console.log('New connection', socket.id)
    //console.log(users)
    socket.on('new_user', (data, callback) => {
        if(data in users){
            callback(false);
        } else {
            callback(true);
            socket.user = data;
            users[socket.user] = socket.id;
            io.sockets.emit('usernames', Object.keys(users));
        };
    });
    socket.on('chat_message', (data) => {
        console.log(data.to);
        
        //io.sockets.emit('chat:message', data);
        data.pos="right";
        data.style="is-dark";
        io.to(users[data.username]).emit('chat:message', data);
        //io.to(users[data.to]).emit('chat message', data);

        //cambiar posicion de burbuja
        data.pos= "left";
        data.style= "";
        io.to(users[data.to]).emit('chat:message', data);
    });

    socket.on('disconnect', (data) => {
        if(!socket.user) return;
        delete users[socket.user];
        io.sockets.emit('usernames', Object.keys(users));
    });
});