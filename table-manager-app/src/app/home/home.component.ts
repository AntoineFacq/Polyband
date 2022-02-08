import { Component, OnInit } from '@angular/core';
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
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  selectedTable: Table;

  message: string = "";
  connection;

  showHelpAsked: boolean = false;

  volumeValue: number = 50;
  helpValue: number = 100;

  tables: Table[] = [];
  phones: Phone[] = [];

  tracks: Track[] = [
    {value: 'track-01', name: 'Weekend'},
    {value: 'track-02', name: 'Picnic on the Seine'},
    {value: 'track-03', name: 'Inspiring'},
  ];
  selectedTrack: Track = this.tracks[0]

  interval:any;

  constructor(private manageTableService: ManageTableService) { }

  ngOnInit(): void {
    this.connection = this.manageTableService.getMessages().subscribe(message => {
      if(message.type == "911 Call") {
        this.playAudio();
        clearInterval(this.interval);
        console.log("911 called !")
        this.helpValue = 100;
        this.showHelpAsked = true;
        this.interval = setInterval(() => {
          this.helpValue --;
          if(this.helpValue == 0) {
            this.showHelpAsked = false;
          }
        }, 125);
      }
      else if(message.type == "new-table") {
        let table = {...new Table(), id: message.text, number: this.tables.length + 1}
        this.selectedTable = table
        this.tables.push(table);
      }
      else if(message.type == "new-phone") {
        let phone = {...new Phone(), id: message.text, number: this.phones.length + 1}
        if(message.tableId && message.tableId != "") phone = {... phone, table: this.tables.find(t => t.id === message.tableId)};
        this.phones.push(phone);
      }
      else if(message.type == "phone-leaved") {
        this.phones.splice(this.phones.map(p => p.id).indexOf(message.text), 1);
      }
      else if(message.type == "table-leaved") {
        this.tables.splice(this.tables.map(p => p.id).indexOf(message.text), 1);
      }
    })
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "../../assets/audio/notif_2.mp3";
    audio.load();
    audio.play();
  }

  volumeChanged($event: MatSliderChange) {
    this.volumeValue = $event.value;
    this.manageTableService.setMasterVolume(this.selectedTable.id, this.volumeValue);
  }

  chooseTrack(event: MatSelectChange) {
    this.manageTableService.selectTrack(this.selectedTable.id, event.value);
  }


  selectTable(t: MatTabChangeEvent) {
    if(t.index < this.tables.length) {
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
    if((event.container.id).toString().slice(-1) === '0') {
      this.manageTableService.assignPhoneToTable(phoneId, undefined);
      this.phones.find(p => p.id === phoneId).table = undefined;
    }
    else if(event.previousContainer.id != event.container.id) {
      let table = this.tables.find(t => t.number.toString() === (event.container.id).toString().slice(-1))
      this.manageTableService.assignPhoneToTable(phoneId, table.id)
      this.phones.find(p => p.id === phoneId).table = table;
    }
  }
}
