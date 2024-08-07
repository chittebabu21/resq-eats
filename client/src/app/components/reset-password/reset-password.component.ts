import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent  implements OnInit {
  emailForm!: FormGroup;
  successMsg = '';
  errorMsg = '';

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.emailForm = new FormGroup({
      email_address: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      })
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      const emailAddress = this.emailForm.get('email_address')?.value;

      this.userService.sendResetPasswordLink(emailAddress).subscribe({
        next: (response: any) => {
          const jsonResponse = response as any;
          this.successMsg = jsonResponse.message;
          this.errorMsg = '';
          this.emailForm.reset();

          setTimeout(() => {
            this.modalCtrl.dismiss();
            this.navCtrl.navigateBack('/');
          }, 2000);
        },
        error: (error) => {
          this.errorMsg = 'Failed to find email address. Please sign up for a new account.';
          this.emailForm.reset();
          console.log(error);
        }
      });
    }
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
