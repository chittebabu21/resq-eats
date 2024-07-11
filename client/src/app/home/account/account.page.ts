import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  userId!: number;
  user!: User;
  isUser = false;
  isVerified = false;
  authUserImageUrl!: string;
  checked = false;

  constructor(
    private navCtrl: NavController, 
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUserById();

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (this.router.url === '/home/account') {
        this.checked = false;
        console.log(paramMap);
      }
    });
  }

  getUserById() {
    const jsonUserId = localStorage.getItem('userId');

    if (jsonUserId) {
      this.userId = parseInt(jsonUserId, 10);

      this.userService.getUserById(this.userId).subscribe({
        next: (user: User) => {
          this.user = user;

          if (user.is_verified === 1) {
            this.isVerified = true;
          } else {
            this.isVerified = false;
          }

          if (user.email_address.endsWith('gmail.com')) {
            const imageUrl = user.image_url?.slice(30);
            console.log(imageUrl);
            if (imageUrl) {
              this.authUserImageUrl = imageUrl;
            }
          }

          this.isUser = true;
          console.log(user);
        },
        error: (error) => {
          console.log(error);
          this.isUser = false;
        }
      });
    }
  }

  onToggle() {
    this.checked = true;
    this.navCtrl.navigateForward('/home/vendor');
  }

  logout() {
    this.userService.logout();
    this.navCtrl.navigateBack('/');
  }

  onRefresh() {
    window.location.reload();
  }
}
