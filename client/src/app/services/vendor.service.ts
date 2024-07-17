import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Vendor } from '../interfaces/vendor';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private baseUrl = environment.baseUrl;
  private vendorUrl = environment.vendorUrl;

  constructor(private http: HttpClient) { }

  getVendorByUserId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.get<{ success: number; data: any }>(`${this.vendorUrl}/user/${id}`, { headers: headers }).pipe(
      map((res) => {
        const vendor = res.data;

        if (vendor) {
          return {
            vendor_id: vendor.vendor_id,
            vendor_name: vendor.vendor_name,
            contact_no: vendor.contact_no,
            address: vendor.address,
            vendor_image_url: `${this.baseUrl}/uploads/${vendor.vendor_image_url}` || null,
            user_id: vendor.user_id,
            user: {
              user_id: vendor.user_id,
              username: vendor.username,
              email_address: vendor.email_address,
              password_hash: vendor.password_hash,
              image_url: vendor.image_url,
              is_verified: vendor.is_verified,
              created_on: new Date(vendor.created_on)
            }
          }
        } else {
          return null;
        }
      })
    );
  }

  insertVendor(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.post(this.vendorUrl, body, { headers: headers }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  updateVendorById(vendorId: number, vendorData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.put(`${this.vendorUrl}/${vendorId}`, vendorData, { headers: headers }).pipe(
      catchError((error) => throwError(() => error))
    );
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
