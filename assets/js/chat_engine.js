// front end file for chat engine. This is the file that would be communicating from the client side whereas chat_sockets.js(observer/server) is server side file that would be receving the req from the subscribers
// I've to include this file and socket.io library in home.ejs [via cdn(refer cdnjs for the cdn link)]
// this class is going to send the req for connection.. Also I need to initialize my class(in home.ejs)
class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`)
        this.userEmail = userEmail;

        // initiating the connection with chat server.. go and connect with the server
        this.socket = io.connect('http://localhost:5000', {transports: ['websocket'], rejectUnauthorized: false })

        if (this.userEmail){
            this.connetionHandler();
        }
    }
    
    // this connectionHandler will handle the to- interaction between the observer and subscriber. on means detecting an event
    connetionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');
        });

        self.socket.emit('join_room', {
           user_email: self.userEmail,
           chatroom: 'codeial'
        });

        self.socket.on('user_joined', function(data){
            console.log('a user joined', data);
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg!= ''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                })
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            let newMessage = $('<li>');
            let messageType = 'other-message';
            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append(  $('<span>', {
                'html': data.message
            })  );
            newMessage.append(  $('<sub>', {
                'html': data.user_email
            }) );

            newMessage.addClass(messageType);
            $('#chat-messages-list').append(newMessage);
        });

    }
}
// frontend part includes creating the connection and initializing our class.. This class is going to send the req for connection. Now next step is to receive the req for connection    