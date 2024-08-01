import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminUrl = environment.adminUrl;
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAdminById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.get<{ success: number; data: any }>(`${this.adminUrl}/${id}`, { headers: headers }).pipe(
      map(res => {
        res.data.created_on = new Date(res.data.created_on);
        res.data.image_url = `${this.baseUrl}/uploads/${res.data.image_url}` || null;

        if (res.data.is_verified !== 0 && res.data.is_verified !== 1) {
          throw new Error('Invalid value for isVerified field...');
        }

        return res.data;
      })
    );
  }
}
