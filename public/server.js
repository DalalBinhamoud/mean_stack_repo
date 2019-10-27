
const express = require('express');
const app = express();
var server = require ('http').Server(app)
var io = require('socket.io')(server);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/challenge', {useNewUrlParser: true});
app.use(express.static(__dirname+'mean-project/dist/mean-project'))

var  status = true
var  algoTxt = " "
var foundCode = false;

dataArr =[]
prev = ""
// models
const challengeSchema = new mongoose.Schema({
    code: { type: Number, required: true},
    algorithm: { type: String, required: true},
   },{timestamps: true })
   // create an object to that contains methods for mongoose to interface with MongoDB
  const Challenge = mongoose.model('Challenge', challengeSchema);


// models
const teamSchema = new mongoose.Schema({
    username: { type: String, required: true},
    document: { type: String, default: ""},
    code: {type: Number, required:true}
   },{timestamps: true })
   // create an object to that contains methods for mongoose to interface with MongoDB
  const Team = mongoose.model('Team', teamSchema);


io.on('connection', function(socket){

    console.log("A new user connected");

    socket.on ('addChallengData'  ,function(data){
        console.log(data);

        var challenge = new Challenge()
        challenge.code = data.code;
        challenge.algorithm = data.algorithm;

        challenge.save(function (err, challenge) {
            if (err) {
                console.log("error", err);  
            } else {
                console.log("the dtaa = ", challenge); 
            }
        })

    })

    

    socket.on('team_code', function(data){
        //get the code of chosen user to display their editor with real time updates, and leave previous chosen editor to prevent 
        //from keeping to display their updates

            Team.findOne({username: data})
            .then(data => { 
                socket.leave(prev)
                socket.join(data.username)
                prev = data.username
                socket.emit('show_doc', {record: data} )
        })
            .catch(err => console.log('error1'))
        })

    
    socket.on('change_color', function(data){
            Team.findOne({username: data})
            .then(data1 => {
                console.log("user server" , data1.code)
                io.sockets.in(data1.code).emit('color_changed', {data: data1.username} )
        })
            .catch(err => console.log('error1'))
        })

    socket.on('edit_doc', function(data){
        //get real time updates and show it to the client
        console.log("hereeee server")
        Team.updateOne({username: data.id}, {document: data.answer})
        .then(data1 => {
            console.log('room code', data.id)
            io.sockets.in(data.id).emit('answer_view',{document: data.answer})

    })
        .catch(err => console.log('error2'))
    

    })

    socket.on('join', function(data){
            //joining a new user to a specific room
            socket.join(data.code); 
            console.log(data.user+' joined by '+data.code)


            Challenge.find() 
            .then(mydata =>
                {
                    dataArr =  mydata
                  
                    for (var i=0;i<dataArr.length;i++){
                        console.log(dataArr[i].code)
                        if(dataArr[i].code == data.code){
                            foundCode = true;
                            algoTxt = dataArr[i].algorithm
                            break; 
                        }
                        console.log(typeof dataArr[i].code);
                        console.log( data.code);
                        console.log(typeof data.code);
                    }

                    if(foundCode){
                        foundCode = false;
                        // io.sockets.in(data.code).emit('new user joined', {user: data.user, message:'has joined this challenge'})
                        status = true;

                        var team = new Team()
                        team.username = data.user;
                        team.code = data.code;
                        team.save(function (err, team) {
                            if (err) {
                                console.log("error", err);  
                            } else {
                                Team.find( {code: team.code}) 
                                    .then(mydata =>
                                        {
                                            dataArr =  mydata
                                            console.log('dataArr',dataArr)
                                            //add new joined users
                                            io.sockets.in(data.code).emit('new team joined', {user: dataArr})
                                            })
                                    .catch(data => console.log('error'))
                            }
                        })
                        console.log("in if")
                    }else{
                        status = false;
                        console.log("in else")
                    }
                    socket.emit('new status', {msg: "error", status: status, algorithm: algoTxt})
                
                }     
            )
            .catch(err =>  console.log("error here"));

        })

    socket.on('message', function(data){

        //transmit new message recieved to the client 
        io.sockets.in(data.code).emit('new message', {user: data.user, message: data.message, time: new Date().getTime()})
     
    })

});

server.listen(3000, ()=>{
    console.log("Socket.io server is listening on port 3000");
    
})

