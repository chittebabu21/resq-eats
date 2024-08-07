import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-send-password-link',
  templateUrl: './send-password-link.component.html',
  styleUrls: ['./send-password-link.component.scss']
})
export class SendPasswordLinkComponent implements OnInit {
  sendLinkForm!: FormGroup;
  errorMsg = '';
  successMsg = '';

  constructor(
    private router: Router,
    private modal: NgbActiveModal,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.sendLinkForm = new FormGroup({
      email_address: new FormControl('', {
        validators: [Validators.required, Validators.email]
      })
    });
  }

  onSubmit() {
    if (this.sendLinkForm.valid) {
      const emailAddress = this.sendLinkForm.get('email_address')?.value;

      this.loginService.sendResetPasswordLink(emailAddress).subscribe({
        next: (response: any) => {
          const jsonResponse = response as any;
          this.successMsg = jsonResponse.message;
          this.errorMsg = '';
          this.sendLinkForm.reset();

          setTimeout(() => {
            this.modal.dismiss();
            this.router.navigateByUrl('/');
          }, 2000);
        },
        error: (error) => {
          this.errorMsg = 'Failed to send reset password link. Please try again.';
          this.sendLinkForm.reset();
          console.log(error);
        }
      });
    }
  }

  onClose() {
    this.modal.dismiss();
    this.router.navigateByUrl('/');
  }

}
