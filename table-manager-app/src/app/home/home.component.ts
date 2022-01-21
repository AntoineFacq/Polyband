import { Component, OnInit } from '@angular/core';
import {ManageTableService} from "../services/manage-table.service";
import {MatSliderChange} from "@angular/material/slider";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  message: string = "";
  connection;
  messages = []

  volumeValue: number = 50;

  constructor(private manageTableService: ManageTableService) { }

  ngOnInit(): void {
    console.log("here")
    /*this.connection = this.manageTableService.getMessages().subscribe(message => {
      console.log(message)
      this.messages.push(message);
    })*/
    this.manageTableService.connect();
  }
  sendMessage() {
    this.manageTableService.sendMessage(this.message);
    this.message = '';
  }

  volumeChanged($event: MatSliderChange) {
    this.volumeValue = $event.value;
    let obj = {name: "volume", value: $event.value}
    this.manageTableService.sendMessage(JSON.stringify(obj));
  }
}
