import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Food } from '../interfaces/food';
import { Vendor } from '../interfaces/vendor';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private menuUrl = environment.menuUrl;
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllFood(): Observable<Food[]> {
    return this.http.get<{ success: number; data: Food[] }>(this.menuUrl).pipe(
      map(res => res.data.map((item) => {
        item.image_url = `${this.baseUrl}/uploads/${item.image_url}` || null;
        item.created_on = new Date(item.created_on);
        return item;
      })),
      map(food => food.sort((a, b) => b.created_on.getTime() - a.created_on.getTime()))
    );
  }

  getFoodById(id: number): Observable<Food> {
    return this.http.get<{ success: number; data: Food }>(`${this.menuUrl}/${id}`).pipe(
      map(res => {
        res.data.image_url = `${this.baseUrl}/uploads/${res.data.image_url}` || null;
        res.data.created_on = new Date(res.data.created_on);
        return res.data;
      })
    );
  }

  getFoodByVendorId(id: number): Observable<any> {
    return this.http.get<{ success: number; data: any }>(`${this.menuUrl}/vendor/${id}`).pipe(
      map(res => {
        return res.data.map((food: any) => ({
          food_id: food.food_id,
          food_name: food.food_name,
          price: food.price,
          quantity: food.quantity,
          image_url: `${this.baseUrl}/uploads/${food.image_url}` || null,
          vendor_id: food.vendor_id,
          created_on: new Date(food.created_on),
          vendor: {
            vendor_id: food.vendor_id,
            vendor_name: food.vendor_name,
            contact_no: food.contact_no,
            address: food.address,
            vendor_image_url: `${this.baseUrl}/uploads/${food.vendor_image_url}` || null,
            user_id: food.user_id
          } as Vendor
        }) as Food);
      }),
      map(food => food.sort((a: any, b: any) => b.created_on.getTime() - a.created_on.getTime()))
    );
  }

  insertFood(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.post(this.menuUrl, body, { headers: headers }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  updateFood(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.put(this.menuUrl, body, { headers: headers }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  deleteFoodById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.delete(`${this.menuUrl}/${id}`, { headers: headers }).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
