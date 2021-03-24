// front end file for chat engine. This is the file that would be communicating from the client side whereas chat_sockets.js(observer/server) is server side file that would be receving the req from the subscribers
// I've to include this file and socket.io library in home.ejs [via cdn(refer cdnjs for the cdn link)]
// this class is going to send the req for connection.. Also I need to initialize my class(in home.ejs)
class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = chatBoxId;
        this.userEmail = userEmail;

        
        this.socket = io.connect('http://localhost:5000', {transports: ['websocket'], rejectUnauthorized: false })

        if (this.userEmail){
            this.connetionHandler();
        }
    }

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
        })
    }
}
// frontend part includes creating the connection and initializing our class.. This class is going to send the req for connection. Now next step is to receive the req for connection    