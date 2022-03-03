import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-jeton',
  templateUrl: './jeton.component.html',
  styleUrls: ['./jeton.component.scss']
})
export class JetonComponent implements OnInit {

  @Input()
  src: string;

  @Output()
  onJetonClicked: EventEmitter<any> = new EventEmitter<any>();

  saveSrc: string;
  active: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
    this.saveSrc = this.src;
  }

  onClick() {
    if (this.src === this.saveSrc) {
      this.active = false;
      new Promise(resolve => setTimeout(resolve, 1500)).then(() => this.src = this.saveSrc);
      this.onJetonClicked.emit();
    }
  }

  onTransitionEnd() {
    this.src = "checked.png";
    this.active = true;
  }
}
