import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { PrivacyPolicyComponent } from 'src/app/components/privacy-policy/privacy-policy.component';
import { ContactComponent } from 'src/app/components/contact/contact.component';

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
  placeholderUser = '/assets/placeholder-images/user.png';

  constructor(
    private navCtrl: NavController, 
    private modalCtrl: ModalController,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUserById();
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

  onSwitchVendor() {
    this.navCtrl.navigateForward('/home/vendor');
  }

  logout() {
    this.userService.logout();
    this.navCtrl.navigateBack('/');
  }

  onRefresh() {
    window.location.reload();
  }

  onPrivacyPolicy() {
    this.modalCtrl.create({
      component: PrivacyPolicyComponent
    }).then(modalEl => modalEl.present());
  }

  onContact() {
    this.modalCtrl.create({
      component: ContactComponent
    }).then(modalEl => modalEl.present());
  }
}
