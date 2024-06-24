import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, of, throwError } from 'rxjs';

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

  getUserByEmail(email: string) {
    return this.http.get(`${this.userUrl}/email-address?email=${email}`)
      .pipe(
        catchError((error) => {
          if (error.status === 500) {
            return of(null);
          } else {
            return throwError(() => error); // new substitute for throwError
          }
        })
      )
  }

  insertUser(body: any) {
    return this.http.post(this.userUrl, body);
  }

  insertOAuthUser(body: any) {
    return this.http.post(`${this.userUrl}/oauth-user`, body);
  }

  updateUserImage(body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });

    const payload = {
      email_address: body.email_address,
      image_url: body.image_url
    };

    return this.http.put(this.userUrl, payload, { headers: headers });
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

  register(body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      username: body.username,
      email_address: body.email_address,
      password_hash: body.password_hash
    };

    return this.http.post(`${this.userUrl}`, payload, { headers: headers });
  }

  sendVerificationEmail(email: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      email_address: email
    };

    return this.http.post(`${this.userUrl}/verify-email-request`, payload, { headers: headers });
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
