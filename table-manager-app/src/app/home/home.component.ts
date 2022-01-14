import { Component, OnInit } from '@angular/core';
import {ManageTableService} from "../services/manage-table.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  message: string = "";

  constructor(private manageTableService: ManageTableService) { }

  ngOnInit(): void {
    this.manageTableService.connect();

  }

  sendMessage() {
    this.manageTableService.sendMessage(this.message);
    this.message = '';
  }

}
