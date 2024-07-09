import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(private navCtrl: NavController, private userService: UserService) { }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
    this.navCtrl.navigateBack('/');
  }
}
