import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Table} from "../../../models/Device";

export interface DialogData {
  nbTable: number;
}

@Component({
  selector: 'app-new-phone-connected',
  templateUrl: './new-phone-connected.component.html',
  styleUrls: ['./new-phone-connected.component.scss']
})
export class NewPhoneConnectedComponent implements OnInit {

  tables: Table[] = [];
  selectedTable: Table;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    for (let i = 0; i < this.data.nbTable; i++) {
      this.tables.push({...new Table(), number: i + 1})
    }
  }

  clickOnTable(t: Table) {
    this.selectedTable = t;
  }
}
