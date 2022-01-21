let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http, {cors: {origin: '*'}});

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message});
    console.log(message);
  });

  socket.on('911 called', (message) => {
    console.log("911 !");
    io.emit('message', {type:'911 Call', text: "A student called 911 !"});
    console.log(message);
  });

});

http.listen(5000, () => {
  console.log('started on port 5000');
});
