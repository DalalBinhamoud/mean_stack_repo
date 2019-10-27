//keep the socket.io connection logic
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
}

  )
export class ChatService {
  //create socket object
  socket:any;
  readonly uri: string = "http://localhost:3000";
  //create connection code within the constructor
  constructor() { 
    this.socket = io.connect(this.uri)
  }


  
  
  joinRoom(data){
  //join new user to a room

        this.socket.emit('join', data)
  }

  addChallengData(code, algorithm) {
    this.socket.emit('addChallengData', {code: code, algorithm: algorithm})
  }
  newTeamJoined(){
  //get users joined

    let observable = new Observable<{user:any}>(observer=>{
      this.socket.on('new team joined', (data)=>{
        observer.next(data);
      });
      return() => {this.socket.disconnect();}

    });

    return observable;
  }

  getDocument(id){
    
  //join a specific editor of user to show their process

    this.socket.emit('team_code', id)
  }



  sendMessage(data){

  //transmit the message sent

    this.socket.emit('message', data)

  }

  newMessageRecieved(){

  //get the new recieved message

    let observable = new Observable<{user:String, message: String,time:any}>(observer=>{
      this.socket.on('new message', (data)=>{
        observer.next(data);
      });
      return() => {this.socket.disconnect();}

    });

    return observable;
  }

  
  write_code(data){

  //detect user typing and transmit each action
 
    this.socket.emit('edit_doc',data)
  }

  DocToShow(){
  
  //get the current code written by a user before chosing from db

    let observable = new Observable<{record:any}>(observer=>{
      this.socket.on('show_doc', (data)=>{
        observer.next(data);
      });
      return() => {this.socket.disconnect();}

    });
    return observable;
  }

  DocUpdated(){

  //get the latest code written by a user on real time

    console.log("imhere1")
    let observable = new Observable<{user:any}>(observer=>{
      this.socket.on('answer_view', (data)=>{
        observer.next(data);
      });
      return() => {this.socket.disconnect();}

    });

    return observable;
  }

  statusRecieved(){
    let observable = new Observable<{msg:String, status: boolean, algorithm: string}>(observer=>{
      this.socket.on('new status', (data)=>{
        observer.next(data);
        
      });
      return() => {this.socket.disconnect();}

    });

    return observable;
  }

  change_color(id:String) {
    console.log ("user" , id)
    this.socket.emit('change_color',id)
  }
  colorChanged(){
    console.log("imhere4")
    let observable = new Observable<{user:any}>(observer=>{
      this.socket.on('color_changed', (data)=>{
        observer.next(data);
      });
      return() => {this.socket.disconnect();}
    });
    return observable;
  }

}