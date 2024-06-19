import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = environment.userUrl;

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(this.userUrl);
  }

  getUserById(id: number) {
    return this.http.get(`${this.userUrl}/${id}`);
  }
}
