import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../login/login.service';
import { User } from '../user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  @Input() id!: number;
  user!: User;
  editForm!: FormGroup;
  errorMsg = '';
  successMsg = '';
  isDisabled = true;

  constructor(
    private router: Router,
    private modal: NgbActiveModal,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.editForm = new FormGroup({
      username: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      }),
      email_address: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      is_verified: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.loginService.getUserById(this.id).subscribe({
      next: (response: User) => {
        this.user = response;
        this.updateForm(this.user);
        this.editForm.controls['email_address'].disable();
      },
      error: (error) => {
        throw new Error(error);
      },
      complete: () => {
        console.log('Completed!');
      }
    });
  }

  updateForm(user: User) {
    this.editForm.patchValue({
      username: user.username,
      email_address: user.email_address,
      is_verified: user.is_verified
    });
  }

  onSubmit() {
    this.editForm.controls['email_address'].enable();

    if (this.editForm.valid) {
      const userData = new FormData();
      userData.append('username', this.editForm.value.username);
      userData.append('email_address', this.editForm.value.email_address);
      userData.append('is_verified', this.editForm.value.is_verified);

      // call service
      this.loginService.updateUser(userData).subscribe({
        next: (response: any) => {
          if (response.success === 1) {
            this.editForm.controls['email_address'].disable();
            this.errorMsg = '';
            this.successMsg = 'Successfully updated user!';

            setTimeout(() => {
              this.onClose();
            }, 2000);
          } else {
            console.log(response.message);
            this.errorMsg = 'Failed to update user...';
          }
        },
        error: (error) => {
          throw new Error(error);
        }
      });
    }
  }

  onClose() {
    this.modal.dismiss();
    this.router.navigateByUrl('/home');
  }
}
