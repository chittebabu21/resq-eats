import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  adminUrl = environment.adminUrl;
  userUrl = environment.userUrl;
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAdminByUserId(id: number): Observable<any> {
    return this.http.get<{ success: number; data: any }>(`${this.adminUrl}/user/${id}`).pipe(
      map(res => {
        res.data.created_on = new Date(res.data.created_on);
        res.data.image_url = `${this.baseUrl}/uploads/${res.data.image_url}` || null;
        return res.data;
      })
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
