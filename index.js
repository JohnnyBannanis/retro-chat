const path = require('path');
const express = require('express');
const app = express();

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
    socket.on('chat_message', (data) => {
        console.log(data);
        io.sockets.emit('chat:message', data);
    })
});