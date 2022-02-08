import { Component, OnInit } from '@angular/core';
import {ManageTableService} from "../services/manage-table.service";
import {MatSliderChange} from "@angular/material/slider";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatSelectChange} from "@angular/material/select";
import {Observable} from "rxjs";
import { interval } from 'rxjs';
import {MatTabChangeEvent} from "@angular/material/tabs";

export interface Track {
  value: string;
  name: string;
}

export enum DeviceType {
  TABLE = "Table",
  PHONE = "Phone"
}


export class Device {
  id: string;
  number: number;
}

export class Table extends Device {
  type = DeviceType.TABLE
}

export class Phone extends Device {
  type = DeviceType.PHONE
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
  sub: any;

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
        console.log("new phoone")
        let phone = {...new Phone(), id: message.text, number: this.phones.length + 1}
        this.phones.push(phone);
      }
    })
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "../../assets/audio/notif_2.mp3";
    audio.load();
    audio.play();
  }

  sendMessage() {
    this.manageTableService.sendMessage("add-message", this.message);
    this.message = '';
  }

  volumeChanged($event: MatSliderChange) {
    this.volumeValue = $event.value;
    let obj = {name: "volume", value: $event.value}
    this.manageTableService.sendMessage("add-message", JSON.stringify(obj));
  }

  simulate911() {
    this.manageTableService.callHelp()
  }

  chooseTrack(event: MatSelectChange) {
    this.manageTableService.selectTrack(this.selectedTable.id, event.value);
  }


  selectTable(t: MatTabChangeEvent) {
    this.selectedTable = this.tables[t.index];
  }

  assignPhoneToTable($event: MatSelectChange) {
    this.manageTableService.assignPhoneToTable($event.value, this.selectedTable.id);
  }
}
