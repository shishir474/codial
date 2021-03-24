// server side file for chat engine
module.exports.chatSockets = function(socketServer){
 let io = require('socket.io')(socketServer);

 io.sockets.on('connection', function(socket){
     console.log('new connection received', socket.id);

     socket.on('disconnect', function(){
         console.log('socket disconnected!')
     });

     socket.on('join_room', function(data){
         console.log('joining req received', data);
         socket.join(data.chatroom);

         io.in(data.chatroom).emit('user_joined', data);

         // detect send message and broadcast it to everyone in the room
         socket.on('send_message', function(data){
             console.log('message received at server side broadcasting it to other subscribers', data.message);
             io.in(data.chatroom).emit('receive_message', data);
         })
     })
 });
}