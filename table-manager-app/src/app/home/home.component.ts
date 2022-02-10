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

  tableAskingHelp: Table = undefined;

  tracks: Track[] = [
    {value: 'track-01', name: 'Weekend'},
    {value: 'track-02', name: 'Picnic on the Seine'},
    {value: 'track-03', name: 'Inspiring'},
  ];

  interval: any;

  constructor(private manageTableService: ManageTableService) {
  }

  ngOnInit(): void {
    this.manageTableService.getMessages().subscribe(message => {
      if (message.type == "table-ask-help") {
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

  mute() {
    this.selectedTable.volume = 0;
    this.manageTableService.setMasterVolume(this.selectedTable.id, 0);
  }

  volumeChanged($event: MatSliderChange) {
    this.selectedTable.volume = $event.value;
    this.manageTableService.setMasterVolume(this.selectedTable.id, this.selectedTable.volume);
  }

  chooseTrack(event: MatSelectChange) {
    this.selectedTable.selectedTrack = this.tracks.find(t => t.value === event.value);
    console.log(this.selectedTable.selectedTrack)
    this.selectedTable.play = true;
    this.manageTableService.selectTrack(this.selectedTable.id, event.value);
  }


  selectTable(t: MatTabChangeEvent) {
    if (t.index < this.tables.length) {
      this.selectedTable = this.tables[t.index];
    }
  }

  assignPhoneToTable($event: MatSelectChange) {
    this.manageTableService.assignPhoneToTable($event.value, this.selectedTable.id);
    this.phones.find(p => p.id === $event.value).table = this.selectedTable;
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

  playPauseTrack() {
    this.selectedTable.play = !this.selectedTable.play;
    this.manageTableService.playPauseTrack(this.selectedTable.id);
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
}
