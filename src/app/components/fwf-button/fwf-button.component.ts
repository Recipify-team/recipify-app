import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fwf-button',
  templateUrl: './fwf-button.component.html',
  styleUrls: ['./fwf-button.component.scss'],
})
export class FwfButtonComponent implements OnInit {

  @Output() clicked : EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  onClick() {
    this.clicked.emit();
  }

}
