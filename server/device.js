class Device{
    type;

    volume

    constructor(io, socket){
        this.io = io;
        this.socket = socket;
        this.id = socket.id;
        this.socket.join(this.type)
    }

    setVolume(volume){
        this.volume = volume;
        this.io.emit("volume", volume)
    }

    getVolume(){
        return this.volume;
    }

}

class Table extends Device{
    type = "table"

    trackId = 0;

    play = true;

    instruments = []

    constructor(io, socket) {
        super(io, socket);
    }

    addInstrument(){
        this.instruments.push(new Instrument(this.instruments.length))
    }

    removeInstrument(id){
        this.instruments.splice(id)
    }
}


class Instrument{
    volume = 50
    id;

    constructor(id) {
        this.id = id;
    }

}

class Phone extends Device{
    type = "phone"

    tableId = undefined
    constructor(io, socket) {
        super(io, socket);
    }
}

class Tablet {
    type = "tablet"
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }
}

module.exports = { Device, Table, Instrument, Phone, Tablet }
