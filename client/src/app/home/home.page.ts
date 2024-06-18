import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  fillList = 'solid';
  fillMap = 'outline';

  constructor() {}

  onListClick() {
    this.fillList = 'solid';
    this.fillMap = 'outline';
  }

  onMapClick() {
    this.fillList = 'outline';
    this.fillMap = 'solid';
  }
}
