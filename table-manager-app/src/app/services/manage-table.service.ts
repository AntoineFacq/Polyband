import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import io from "socket.io-client";
import {environment} from "../../environments/environment";

export class SocketMessage {
  type: string;
  text: string;
  tableId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManageTableService {

  private socket;

  getMessages(): Observable<SocketMessage> {
    return new Observable<SocketMessage>(observer => {
      this.socket = io(environment.ws_url);
      this.socket.emit('connected-device', 'tablet');
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      this.socket.on('new-table', (data) => {
        observer.next({type: 'new-table', text: data});
      });
      this.socket.on('new-phone', (id, tableId) => {
        observer.next({type: 'new-phone', text: id, tableId: tableId});
      });
      this.socket.on('phone-leaved', (data) => {
        observer.next({type: 'phone-leaved', text: data});
      });
      this.socket.on('table-leaved', (data) => {
        observer.next({type: 'table-leaved', text: data});
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  selectTrack(tableId: string, track: string) {
    console.log("track selected")
    this.socket.emit('select-track', tableId, track)
  }

  setMasterVolume(tableId: string, volume: number) {
    console.log("set master volume to " + volume)
    this.socket.emit('set-master-volume', tableId, volume)
  }

  assignPhoneToTable(phoneId: string, tableId: string) {
    if(tableId != undefined) {
      console.log("Assign phone " + phoneId + " to table " + tableId);
      this.socket.emit('tablet-adds-instrument', tableId, 'phone', phoneId);
    } else {
      this.socket.emit('tablet-unasign-instrument', phoneId);
    }

  }

  playPauseTrack(id: string) {
    this.socket.emit('tablet-play-pause', id)
  }

  startStopRecording(id: string) {
    this.socket.emit('start-stop-recording', id)
  }

  playPauseRecording(id: string) {
    this.socket.emit('play-pause-recording', id)
  }

  addInstrument(type: string, id: string) {
    this.socket.emit('tablet-adds-instrument', id, type)
  }
}
