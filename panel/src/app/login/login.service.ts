import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../home/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  adminUrl = environment.adminUrl;
  userUrl = environment.userUrl;
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get<{ success: 1; data: User[] }>(this.userUrl).pipe(
      map(res => res.data.map((user: any) => {
        user.created_on = new Date(user.created_on);

        if (user.is_verified !== 0 && user.is_verified !== 1) {
          throw new Error('Invalid value for isVerified field...');
        }

        return user;
      }))
    );
  }

  getAdminByUserId(id: number): Observable<any> {
    return this.http.get<{ success: number; data: any }>(`${this.adminUrl}/user/${id}`).pipe(
      map(res => {
        res.data.created_on = new Date(res.data.created_on);
        res.data.image_url = `${this.baseUrl}/uploads/${res.data.image_url}` || null;
        return res.data;
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.delete(`${this.userUrl}/${id}`, { headers: headers }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  login(body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      email_address: body.email_address,
      password_hash: body.password_hash
    };

    return this.http.post(`${this.userUrl}/login`, payload, { headers: headers });
  }

  sendResetPasswordLink(email_address: string): Observable<any> {
    return this.http.post(`${this.userUrl}/reset-password-request`, { email_address: email_address });
  }

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string) {
    const storedValue = localStorage.getItem(key);

    if (storedValue !== null) {
      return storedValue;
    } else {
      return null;
    }
  }
}
