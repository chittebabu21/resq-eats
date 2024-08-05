import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { User } from './user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users!: User[];
  errorMsg = '';
  successMsg = '';

  constructor(private loginService: LoginService) {}

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

  deleteUser(id: number) {
    this.loginService.deleteUser(id).subscribe({
      next: (response: any) => {
        const jsonResponse = response as any;
        console.log(jsonResponse);
        this.errorMsg = '';
        this.successMsg = 'User deleted successfully!';
      },
      error: (error) => {
        console.log(error);
        this.errorMsg = 'Failed to delete user. Please try again.';
      }
    });
  }

}
