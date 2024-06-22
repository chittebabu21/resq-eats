import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  errorMsg = '';

  constructor(
    private userService: UserService, 
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
      }),
      email_address: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      password_hash: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]
      }),
      confirm_password: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const password = this.registerForm.get('password_hash')?.value;
      const confirmPassword = this.registerForm.get('confirm_password')?.value;

      if (password === confirmPassword) {
        const { username, email_address, password_hash } = this.registerForm.value;

        // call service method
        this.userService.register({ username, email_address, password_hash })
          .subscribe({
            next: (response: any) => {
              const jsonResponse = response as any;
              this.errorMsg = '';

              if (jsonResponse.success === 1) {
                this.userService.sendVerificationEmail(email_address)
                  .subscribe({
                    next: (response: any) => {
                      const jsonResponse = response as any;
                      console.log(jsonResponse);
                    },
                    error: (error) => {
                      console.log('Error: ' + error);
                    } 
                  });
              }

              this.showSuccessAlert();
              this.registerForm.reset();

              setTimeout(() => {
                this.router.navigateByUrl('/');
              }, 5000);
            },
            error: (error) => {
              console.log(error);
              this.errorMsg = 'Error in registering user. Please try again later...';
              this.registerForm.reset();
            }
          });
      } else {
        this.errorMsg = 'Passwords do not match...';
        this.registerForm.reset();
      }
    }
  }

  async showSuccessAlert() {
    const successAlert = await this.alertCtrl.create({
      header: 'SUCCESS!',
      subHeader: 'You have registered successfully!',
      message: 'Please click on the link in your email to verify your account',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl('/');
        }
      }]
    });

    successAlert.present();

    setTimeout(() => {
      successAlert.dismiss();
    }, 5000);
  }
}
