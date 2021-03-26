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
         socket.join(data.chatroom);// once the joining req is received I just want the socket to join that room.. This will enter the user in the chatroom

         io.in(data.chatroom).emit('user_joined', data);// notifying the other users(including me) in the chatroom that a new user has joined the room. It should be notified to other users only but for now we're not applying that check..emitting the event in the specific chatroom [using io.in(data.chatroom)] bcoz we dont notify the users of the other grp when someone joins a specific grp so notifying users of only that particular grp.

         // detect send message and broadcast it to everyone in the room
         socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data); //console.log('message received at server side broadcasting it to other subscribers', data.message);// once the event is detected, the message is broadcasted to all the other people in the chatroom(i.e another emit event is fired)
         })
     })
 });


}