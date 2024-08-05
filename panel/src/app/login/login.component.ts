import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  admin!: any;
  errorMsg = '';

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email_address: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      password_hash: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  login(email_address: string, password_hash: string) {
    this.loginService.login({ email_address: email_address, password_hash: password_hash })
      .subscribe({
        next: (response: any) => {
          const jsonResponse = response as any;

          // get admin by user id
          this.loginService.getAdminByUserId(jsonResponse.user).subscribe({
            next: (response: any) => {
              this.admin = response;

              if (this.admin) {
                this.loginService.set('token', jsonResponse.token);
                this.loginService.set('adminId', this.admin.admin_id);

                this.errorMsg = '';
                this.loginForm.reset();
                this.router.navigateByUrl('/home');
              } else {
                this.errorMsg = 'Invalid admin credentials...';
                this.loginForm.reset();
              }
            },
            error: (error) => {
              throw new Error(error);
            }
          });
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
}
