import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {
  @Input() id!: number;
  errorMsg = '';
  successMsg = '';

  constructor(
    private modal: NgbActiveModal,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    
  }

  deleteUser(id: number) {
    this.loginService.deleteUser(id).subscribe({
      next: (response: any) => {
        const jsonResponse = response as any;
        console.log(jsonResponse);
        this.errorMsg = '';
        this.successMsg = 'User deleted successfully!';

        setTimeout(() => {
          this.onClose();
        }, 3000);
      },
      error: (error) => {
        console.log(error);
        this.errorMsg = 'Failed to delete user. Please try again.';
      }
    });
  }

  onClose() {
    this.modal.dismiss();
    this.router.navigateByUrl('/home');
  }
}
