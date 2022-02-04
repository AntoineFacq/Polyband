import { Component, OnInit } from '@angular/core';
import {ManageTableService} from "../services/manage-table.service";
import {MatSliderChange} from "@angular/material/slider";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatSelectChange} from "@angular/material/select";

export interface Track {
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

  message: string = "";
  connection;

  showHelpAsked: boolean = false;

  volumeValue: number = 50;
  helpValue: number = 100;

  tracks: Track[] = [
    {value: 'track-01', name: 'Track 01'},
    {value: 'track-02', name: 'Track 02'},
    {value: 'track-03', name: 'Track 03'},
  ];
  selectedTrack: Track = this.tracks[0]

  constructor(private manageTableService: ManageTableService) { }

  ngOnInit(): void {
    this.connection = this.manageTableService.getMessages().subscribe(message => {
      if(message.type == "911 Call") {
        console.log("911 called !")
        this.helpValue = 100;
        this.showHelpAsked = true;
        setInterval(() => {
          this.helpValue --;
          if(this.helpValue == 0) this.showHelpAsked = false;
        }, 100);
      }
    })
    this.manageTableService.connect();
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
    let obj = {name: "select-track", value: event.value}
    this.manageTableService.sendMessage("add-message", JSON.stringify(obj));
  }
}
