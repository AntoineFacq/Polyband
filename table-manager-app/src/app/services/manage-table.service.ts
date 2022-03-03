import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import io from "socket.io-client";
import {environment} from "../../environments/environment";

export class SocketMessage {
  type: string;
  text?: string;
  tableId?: string;
  number?: string;
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
      this.socket.on('new-table', (data, number) => {
        observer.next({type: 'new-table', text: data, number: number});
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
      this.socket.on('table-ask-help', (data) => {
        observer.next({type: 'table-ask-help', tableId: data});
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  selectTrack(tableId: string, track: string) {
    this.socket.emit('select-track', tableId, track)
  }

  setMasterVolume(tableId: string, volume: number) {
    this.socket.emit('set-master-volume', tableId, volume)
  }

  assignPhoneToTable(phoneId: string, tableId: string) {
    if (tableId != undefined) {
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

  giveHelpFeedback(tableId: string) {
    this.socket.emit('teacher-arrives', tableId)
  }
}
