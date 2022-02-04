let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http, {cors: {origin: '*'}});

let tableConnected = false;

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('add-message', (message) => {
        message = JSON.parse(message);
        io.emit('message', {type: 'new-message', text: message});
        console.log(message.name + " - " + message.value);

        switch (message.name) {
            case "volume":
                io.emit('volume', message.value / 100);
                console.log(message.value);
                break;
            case "select-track":
                io.emit('select-track', message.value);
                break;
        }

    });


    socket.on('911 called', (message) => {
        console.log("911 !");
        io.emit('message', {type: '911 Call', text: "A student called 911 !"});
        console.log(message);
    });

    socket.on('Note played', (message) => {
        console.log("The flute played the note number " + message);
        io.emit('Flute played !', message);
    });

    socket.on('connected-device', (message) => {
        if(message === "table") {
            tableConnected = true;
        }
        console.log("New device connected : ", message);
    });


});


http.listen(5000, () => {
    console.log('started on port 5000');
    console.log("**Socket.IO Version: " + require('socket.io/package').version);
});
