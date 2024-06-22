import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  errorMsg = '';
  token = '';
  isLoggedIn = false;

  constructor(
    private userService: UserService, 
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email_address: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      password_hash: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            const jsonResponse = response as any;
            this.errorMsg = '';

            // save token to local storage
            this.userService.set('token', jsonResponse.token);
            this.isLoggedIn = true;

            this.showSuccessAlert();
            this.loginForm.reset();

            setTimeout(() => {
              this.router.navigateByUrl('/home');
            }, 5000);
          },
          error: (error) => {
            console.log(error);
            this.errorMsg = 'Invalid credentials. Please try again...';
            this.loginForm.reset();
          }
        });
    }
  }

  async showSuccessAlert() {
    const successAlert = await this.alertCtrl.create({
      header: 'SUCCESS!',
      message: 'You are logged in successfully!',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl('/home');
        }
      }]
    });

    await successAlert.present();

    setTimeout(() => {
      successAlert.dismiss();
    }, 5000);
  }
}
