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

    console.log('new connection');


    /**
     * Must be sent by all devices after being connected to the socket.
     * It allows to identify the device and loads state
     * type: A "table" ? A "tablet" ? A "phone" => see DeviceType
     */
    socket.on('connected-device', (type) => {
        console.log("New " + type + " connected with socket ", socket.id);
        switch (type) {
            case DeviceType.TABLET:
                tablet = new Tablet(io, socket);
                for (let d of Object.keys(devices)) {
                    if (devices[d].type === "table") {
                        socket.emit("new-table", d)
                    } else {
                        socket.emit("new-phone", d)
                    }
                }
                break;
            case DeviceType.TABLE:
                devices[socket.id] = new Table(io, socket)
                if (tablet) {
                    tablet.socket.emit("new-table", devices[socket.id].id)
                }
                devices[socket.id].socket.join("tableRoom" + socket.id)
                break;
            case DeviceType.PHONE:
                devices[socket.id] = new Phone(io, socket)
                if (tablet) {
                    tablet.socket.emit("new-phone", devices[socket.id].id)
                }
                break;

        }

    });


    /**
     * Must be sent by all of the devices when they disconnect from the server
     * type = 'transport' in queries type: A "table" ? A "tablet" ? A "phone" => see DeviceType
     */
    socket.on('disconnect', function (type) {
        if(socket.id in devices) {
            if(devices[socket.id].type === "phone") {
                if(tablet) tablet.socket.emit("phone-leaved", socket.id);
                console.log("Phone " + socket.id + " leaved.");
            } else {
                if (tablet) tablet.socket.emit("table-leaved", socket.id);
                console.log("Table " + socket.id + " leaved.");
            }
            delete devices[socket.id];
        }
        if(tablet && tablet.socket.id === socket.id) {
            tablet = undefined;
            console.log("Tablet " + socket.id + " leaved.");
        }
        /*switch (type) {
            case DeviceType.TABLET:
                tablet = undefined;
                break;
            case DeviceType.TABLE:
                console.log("table with " + socket.id + " deconnected !!!");
                break;
            case DeviceType.PHONE:
                devices.splice(socket.id, 1)
                tablet.socket.emit("disconnected-device", socket.id)
                if (devices[socket.id].tableId !== undefined) {
                    devices[socket.id].socket.leave("tableRoom" + devices[socket.id].tableId) // LEAVE ROOM
                    devices[socket.id].tableId = undefined
                }
                break;

        }
        console.log(type+" with socket "+socket.id+' disconnected');*/
    });


    /**
     * Tablet adds a new instrument (phone OR table) a certain channel
     * tableId: (socket id of the table)
     * instumentId: (socket id of the phone instrument OR undefined if table)
     */

    socket.on('tablet-adds-instrument', (tableId, type, instrumentId) => {
        if (instrumentId !== undefined) {
            console.log("Instrument (" + type + ") with id " + instrumentId + " added to table " + tableId);
            devices[instrumentId].tableId = tableId;
            devices[instrumentId].instrumentType = type;

            devices[tableId].socket.emit("instrument-added", type);
            devices[tableId].socket.join("tableRoom" + socket.id) // JOIN GOOD ROOM
        } else {
            TABLE_INSTRUMENT_ID++; // New table instrument

            // devices[tableId].instruments[TABLE_INSTRUMENT_ID] = new Instrument(type)

            devices[tableId].socket.emit("instrument-added", type/* + ":" + TABLE_INSTRUMENT_ID*/);
        }
    });


    /**************** EVENTS ************************/


    socket.on('select-track', (tableId, trackId) => {
        devices[tableId].socket.emit('select-track', trackId);
    });

    /**
     * Called by the tablet to set the master [volume] on a certain [tableId]
     */
    socket.on('set-master-volume', (tableId, volume) => {
        console.log("Set master volume of table " + tableId + " to " + volume);
        devices[tableId].socket.emit('set-master-volume', volume / 100);
    });

    /**
     * Toggle the music on/off on a [tableId]
     */
    socket.on('tablet-play-pause', (tableId) => {
        devices[tableId].play = !devices[tableId].play;
        devices[tableId].socket.emit('table-start-stop-music', devices[tableId].play);
        console.log("Playing: " + devices[tableId].play);
    });


    /**
     * Toggle the recording on/off on a [tableId]
     */
    socket.on('start-stop-recording', (tableId) => {
        devices[tableId].socket.emit('toggle-record');
    });


    /**
     * Toggle the playing of the recording on/off on a [tableId]
     */
    socket.on('play-pause-recording', (tableId) => {
        devices[tableId].socket.emit('toggle-recording-playback');
    });





    /**
     * When the student calls help
     */
    socket.on('911 called', (message) => {
        if(tablet) {
            tablet.socket.emit('message', {
                tableId: socket.id, // Indicate which table it is coming from
                type: '911 Call',
                text: "A student called 911 !"
            });
            console.log(message);
        } else {
            console.log("Tablet not associated yet !")
        }

    });

    /**
     * When the teacher indicates he is about to come
     *
     * Received from the tablet, then transmitted to the table by the server
     */
    socket.on('confirm-911-call', (tableId) => {
        devices[tableId].socket.emit('teacher-arrives');
    });

    /**
     * Note played by phone (play the note on the right table)
     */
    socket.on('phone-note-played', (noteId) => {
        console.log('"' + noteId + '" played by ' + devices[socket.id].instrumentType + '!');

        let tableId = devices[socket.id].tableId; // T
        if(tableId) {
            devices[tableId].socket.emit('play-note-on-table', devices[socket.id].instrumentType + ":" + noteId)
        }// able to whom the phone is connected
        else {
            console.log("Phone not associated with a tabled yet !")
        }

    });


});


http.listen(5000, () => {
    console.log('started on port 5000');
    console.log("**Socket.IO Version: " + require('socket.io/package').version);
});
