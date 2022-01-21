import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import io from "socket.io-client";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ManageTableService {

  private socket;

  connect(): Subject<MessageEvent> {
    this.socket = io(environment.ws_url);

    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        console.log("Received message from Websocket Server")
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });

    let observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable);
  }

  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(environment.ws_url);
      this.socket.on('message', (data) => {
        observer.next(data);
        console.log(data)
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
