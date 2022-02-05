const {Table, Tablet, Device, Phone, Instrument} = require("./device");
let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http, {cors: {origin: '*'}});

let tablet;
let devices = [];

let TABLE_INSTRUMENT_ID = 0;

let DeviceType = {
    TABLET: "tablet",
    TABLE: "table",
    PHONE: "phone"
}

let InstumentType = {
    FLUTE: "flute",
    GUITARE: "guitar",
    BATTERIE: "batterie",
    PIANO: "piano"
}

io.on('connection', (socket) => {


    /******************** CONNECTION HANDLING *********************/

    console.log('user connected');

    socket.on('connected-device', (type) => {
        console.log("New device connected : ", type, socket.id);
        switch (type) {
            case DeviceType.TABLET:
                tablet = new Tablet(io, socket);
                for (let d of devices) {
                    if (d instanceof Tablet) {
                        socket.emit("new-table", d)
                    }
                }
                break;
            case DeviceType.TABLE:
                devices[socket.id] = new Table(io, socket)
                if (tablet) {
                    tablet.socket.emit("new-table", devices[socket.id])
                }
                break;
            case DeviceType.PHONE:
                devices[socket.id] = new Phone(io, socket)
                tablet.socket.emit("new-phone", devices[socket.id])
                break;

        }

    });

    socket.on('disconnect', function (type) {
        switch (type) {
            case "tablet":
                tablet = undefined;
                break;
            case "table":
            case "device":
                devices.splice(socket.id, 1)
                break;

        }
        console.log('user disconnected');
    });


    /**
     * Tablet adds a new instrument (phone OR table) a certain channel
     * tableId: (socket id of the tables)
     * instumentId: (socket id of the instument)
     */

    socket.on('tablet-adds-instrument', ({tableId, type}) => {
        switch (devices[socket.id].type) {
            case DeviceType.PHONE:
                devices[socket.id].tableId = tableId;
                devices[socket.id].instrumentType = type;

                devices[tableId].socket.emit("instrument-added", type);
                break;
            case DeviceType.TABLE:
                TABLE_INSTRUMENT_ID++; // New table instrument

                devices[socket.id].instruments[TABLE_INSTRUMENT_ID] = new Instrument(type)

                devices[tableId].socket.emit("instrument-added", type+":"+TABLE_INSTRUMENT_ID);
                break;
        }
    });


    /**************** EVENTS ************************/


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

    /**
     * When the student calls help
     */
    socket.on('911 called', (message) => {
        io.emit('message', {
            tableId: socket.id, // Indicate which table it is coming from
            type: '911 Call',
            text: "A student called 911 !"
        });
        console.log(message);
    });

    /**
     * When the teacher indicates he is about to come
     *
     * Received by the tablet, then transmitted to the table
     */
    socket.on('confirm-911-call', (tableId) => {
        devices[tableId].socket.emit('teacher-arrives');
    });

    /**
     * Note played by phone (play the note on the right table)
     */
    socket.on('phone-note-played', (noteId) => {
        console.log('"' + noteId + '" played by ' + devices[socket.id].instrumentType + '!');

        let tableId = devices[socket.id].tableId; // Table to whom the phone is connected
        devices[tableId].socket.emit('play-note-on-table', devices[socket.id].instrumentType + ":" + noteId)

    });


});


http.listen(5000, () => {
    console.log('started on port 5000');
    console.log("**Socket.IO Version: " + require('socket.io/package').version);
});
