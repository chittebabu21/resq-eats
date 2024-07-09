import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SocialAuthService } from '@abacritt/angularx-social-login';

import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';
import { catchError, of, switchMap, tap } from 'rxjs';

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
    private alertCtrl: AlertController,
    private socialAuthService: SocialAuthService
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

    this.socialAuthService.authState.subscribe({
      next: (user) => {
        console.log(user);

        const emailAddress = user.email;
        const passwordHash = user.id;
        const username = user.firstName;
        const imageUrl = user.photoUrl;

        this.userService.getUserByEmail(emailAddress).subscribe({
          next: (response: any) => {
            if (response === null) {
              this.userService.insertOAuthUser({ 
                username: username, 
                email_address: emailAddress, 
                password_hash: passwordHash, 
                image_url: imageUrl
              }).subscribe({
                next: (response: any) => {
                  const jsonResponse = response as any;
                  this.errorMsg = '';

                  // save token to local storage
                  this.userService.set('token', jsonResponse.token);
                  this.isLoggedIn = true;

                  this.showSuccessAlert();
                  this.loginForm.reset();

                  setTimeout(() => {
                    this.router.navigateByUrl('/home/main');
                  }, 5000);
                },
                error: (error) => {
                  console.log(error);
                }
              });
            } else {
              this.login(emailAddress, passwordHash);
            }
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error) => {
        console.log(error);
        this.errorMsg = 'Failed to login using Google. Please try again or register as a new user...';
        this.loginForm.reset();
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const emailAddress = this.loginForm.get('email_address')?.value;
      const passwordHash = this.loginForm.get('password_hash')?.value;

      this.login(emailAddress, passwordHash);
    }
  }

  login(emailAddress: string, passwordHash: string) {
    this.userService.login({ email_address: emailAddress, password_hash: passwordHash})
        .subscribe({
          next: (response: any) => {
            const jsonResponse = response as any;
            console.log(jsonResponse);
            this.errorMsg = '';

            // save token to local storage
            this.userService.set('token', jsonResponse.token);
            this.userService.set('userId', jsonResponse.user);
            this.isLoggedIn = true;

            this.showSuccessAlert();
            this.loginForm.reset();

            setTimeout(() => {
              this.router.navigateByUrl('/home/main');
            }, 5000);
          },
          error: (error) => {
            console.log(error);
            this.errorMsg = 'Invalid credentials. Please try again...';
            this.loginForm.reset();
          }
        });
  }

  async showSuccessAlert() {
    const successAlert = await this.alertCtrl.create({
      header: 'SUCCESS!',
      message: 'You are logged in successfully!',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl('/home/main');
        }
      }]
    });

    await successAlert.present();

    setTimeout(() => {
      successAlert.dismiss();
    }, 3000);
  }
}
