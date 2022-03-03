import {Component, OnInit} from '@angular/core';
import {ManageTableService} from "../services/manage-table.service";
import {MatSliderChange} from "@angular/material/slider";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatSelectChange} from "@angular/material/select";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Phone, Table} from "../../models/Device";
import {CdkDragDrop} from "@angular/cdk/drag-drop";


export class Track {
  value: string;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(100%)'}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  selectedTable: Table;

  helpValue: number = 0;

  tables: Table[] = [];
  phones: Phone[] = [];

  allTables: Table = new Table();

  tableAskingHelp: Table = undefined;

  tracks: Track[] = [
    {value: 'track-01', name: 'Weekend'},
    {value: 'track-02', name: 'Picnic on the Seine'},
    {value: 'track-03', name: 'Inspiring'},
    {value: 'track-04', name: 'Feelin\' Good'},
  ];

  interval: any;
  colors = ["red", "blue", "green"];

  getColor(index: number): string{
    return this.colors[index];
  }

  constructor(private manageTableService: ManageTableService) {
  }

  ngOnInit(): void {
    this.manageTableService.getMessages().subscribe(message => {
      if (message.type == "table-ask-help") {
        window.navigator.vibrate([100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100]);
        this.playAudio();
        clearInterval(this.interval);
        this.helpValue = 100;
        this.tableAskingHelp = this.tables.find(t => t.id === message.tableId);
        this.interval = setInterval(() => {
          this.helpValue--;
          if (this.helpValue == 0) {
            this.tableAskingHelp = undefined;
          }
        }, 125);
      } else if (message.type == "new-table") {
        let table = {...new Table(), id: message.text, number: this.tables.length + 1}
        if (!this.selectedTable) this.selectedTable = table
        this.tables.push(table);
      } else if (message.type == "new-phone") {
        let phone = {...new Phone(), id: message.text, number: this.phones.length + 1}
        if (message.tableId && message.tableId != "") phone = {
          ...phone,
          table: this.tables.find(t => t.id === message.tableId)
        };
        this.phones.push(phone);
      } else if (message.type == "phone-leaved") {
        this.phones.splice(this.phones.map(p => p.id).indexOf(message.text), 1);
      } else if (message.type == "table-leaved") {
        this.tables.splice(this.tables.map(p => p.id).indexOf(message.text), 1);
        if (this.tables.length == 0) this.selectedTable = undefined
        else {
          this.selectedTable = this.tables[0];
        }
      }
    })
  }

  playAudio() {
    let audio = new Audio();
    audio.src = "../../assets/audio/notif.mp3";
    audio.load();
    audio.play();
  }

  mute(tableId?: string) {
    if (tableId) {
      let table = this.tables.find(t => t.id === tableId);
      if (table) {
        this.tables.find(t => t.id === tableId).volume = 0;
        this.manageTableService.setMasterVolume(tableId, 0);
      }
    } else {
      this.selectedTable.volume = 0;
      this.manageTableService.setMasterVolume(this.selectedTable.id, 0);
    }
  }

  volumeChanged(tableId: string, $event: MatSliderChange) {
    console.log(this.tables)
    if (this.tables.find(t => t.id === tableId)) {
      this.tables.find(t => t.id === tableId).volume = $event.value;
      this.manageTableService.setMasterVolume(tableId, $event.value);
    }
  }

  chooseTrack(event: MatSelectChange, tableId?: string,) {
    if (tableId) {
      if (this.tables.find(t => t.id === tableId)) {
        this.tables.find(t => t.id === tableId).selectedTrack = this.tracks.find(t => t.value === event.value);
        this.tables.find(t => t.id === tableId).play = true;
        this.manageTableService.selectTrack(tableId, event.value);
      }
    } else {
      this.selectedTable.selectedTrack = this.tracks.find(t => t.value === event.value);
      this.selectedTable.play = true;
      this.manageTableService.selectTrack(this.selectedTable.id, event.value);
    }

  }


  selectTable(t: MatTabChangeEvent) {
    if (t.index > 0 && t.index < this.tables.length + 1) {
      this.selectedTable = this.tables[t.index - 1];
    }
  }

  getNotAssignedPhones(): Phone[] {
    return this.phones.filter(p => !p.table);
  }

  getPhonesAssociatedToTable(table: Table): Phone[] {
    return this.phones.filter(p => p.table && p.table.id === table.id);
  }

  drop(event: CdkDragDrop<Phone[]>) {
    let phoneId = event.previousContainer.data[event.previousIndex].id;
    if ((event.container.id).toString().slice(-1) === '0') {
      this.manageTableService.assignPhoneToTable(phoneId, undefined);
      this.phones.find(p => p.id === phoneId).table = undefined;
    } else if (event.previousContainer.id != event.container.id) {
      let table = this.tables.find(t => t.number.toString() === (event.container.id).toString().slice(-1))
      this.manageTableService.assignPhoneToTable(phoneId, table.id)
      this.phones.find(p => p.id === phoneId).table = table;
    }
  }

  playPauseTrack(tableId?: string) {
    if (tableId) {
      if (this.tables.find(t => t.id === tableId)) {
        this.tables.find(t => t.id === tableId).play = !this.tables.find(t => t.id === tableId).play;
        this.manageTableService.playPauseTrack(tableId);
      }
    } else {
      this.selectedTable.play = !this.selectedTable.play;
      this.manageTableService.playPauseTrack(this.selectedTable.id);
    }
  }

  startStopRecording() {
    this.selectedTable.recording = !this.selectedTable.recording;
    this.manageTableService.startStopRecording(this.selectedTable.id);
  }

  playPauseRecording() {
    this.selectedTable.playingRecording = !this.selectedTable.playingRecording;
    this.manageTableService.playPauseRecording(this.selectedTable.id);
  }

  addInstrument(type: string) {
    this.manageTableService.addInstrument(type, this.selectedTable.id);
  }

  giveHelpFeedback() {
    this.manageTableService.giveHelpFeedback(this.tableAskingHelp.id);
    this.tableAskingHelp = undefined;
    this.helpValue = 0;
  }

  muteAll() {
    this.tables.forEach(t => {
      this.mute(t.id);
    })
  }

  changeAllVolumes($event: MatSliderChange) {
    this.tables.forEach(t => {
      this.volumeChanged(t.id, $event);
    })
  }

  areAllTableSameLevel() {
    let v = 0;
    let i = 0;
    for (let t of this.tables) {
      if (i == 0) {
        v = t.volume;
        i++;
      }
      if (t.volume != v) return false;
    }
    return true;
  }

  playPauseTrackForAll() {
    this.allTables.play = !this.allTables.play;
    this.tables.forEach(t => {
      this.playPauseTrack(t.id);
    })
  }

  chooseTrackForAll($event: MatSelectChange) {
    this.allTables.selectedTrack = this.tracks.find(t => t.value === $event.value);
    this.tables.forEach(t => {
      this.chooseTrack($event, t.id);
    })
  }
}
