import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { User } from './user';
import { EditUserComponent } from './edit-user/edit-user.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users!: User[];
  errorMsg = '';
  successMsg = '';

  constructor(
    private loginService: LoginService, 
    private modal: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.loginService.getAllUsers().subscribe({
      next: (response: any) => {
        const jsonResponse = response as any;
        console.log(jsonResponse);
        this.users = jsonResponse;
      },
      error: (error) => {
        throw new Error(error);
      }
    });
  }

  onEdit(id: number) {
    const modalRef = this.modal.open(EditUserComponent);
    modalRef.componentInstance.id = id;
  }

  onDelete(id: number) {
    const modalRef = this.modal.open(DeleteConfirmationComponent);
    modalRef.componentInstance.id = id;
  }

  onReload() {
    window.location.reload();
  }

  onLogout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }

}
