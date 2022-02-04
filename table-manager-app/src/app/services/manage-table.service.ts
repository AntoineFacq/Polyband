import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import io from "socket.io-client";
import {environment} from "../../environments/environment";
import {Track} from "../home/home.component";

export class SocketMessage {
  type: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManageTableService {

  private socket;

  connect(): Subject<MessageEvent> {
    this.socket = io(environment.ws_url);

    const observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        console.log('Received message from Websocket Server');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable);
  }

  sendMessage(value: string, message: string){
    this.socket.emit(value, message);
  }

  callHelp() {
    this.socket.emit('911 called', 'SOS');
  }

  selectTrack(track: Track) {
    console.log("track selected")
    this.socket.emit('select-track', track.value)
  }

  getMessages(): Observable<SocketMessage> {
    return new Observable<SocketMessage>(observer => {
      this.socket = io(environment.ws_url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
