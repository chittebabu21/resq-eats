import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {
  @Input() isLoggedIn = true;

  constructor() { }

  ngOnInit() {
    console.log(this.isLoggedIn);
  }

}
