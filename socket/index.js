const { Server } = require("socket.io");
require('dotenv').config();


const io = new Server({ cors: process.env.CLIENT_URL });

let onlineUsers = [];

io.on("connection", (socket) => {

  socket.on('addNewUser', (user)=>{

    if(user){
      if(!onlineUsers.some(usr=>usr.id==user.id)){
        onlineUsers.push({
          ...user,
          socketId: socket.id
        });
      }
    }
    io.emit("getOnlineUsers", onlineUsers);
  });


  socket.on('sendMessage',({message,onlineUsers})=>{
    let receiver = onlineUsers.filter(user=>user.id==message.receiver) || [];
    if(receiver.length>0){
      io.to(receiver[0]?.socketId).emit("getMessage", message);
      io.to(receiver[0]?.socketId).emit("getNotifications", {
        senderId: message.senderId,
        date: new Date(),
        isRead: false
      });
    }
  });


  socket.on("disconnect",()=>{
    onlineUsers = onlineUsers.filter(user=>user.socketId!=socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });

});

io.listen(3100);