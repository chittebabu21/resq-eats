import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

import { Order } from '../interfaces/order';
import { User } from '../interfaces/user';
import { Food } from '../interfaces/food';
import { OrderDetails } from '../interfaces/order-details';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.baseUrl;
  private orderUrl = environment.orderUrl;

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<{ success: number; data: Order[] }>(this.orderUrl, { headers: headers }).pipe(
      map(res => res.data.map((item) => {
        item.ordered_on = new Date(item.ordered_on);
        return item;
      })),
      map(order => order.sort((a, b) => b.ordered_on.getTime() - a.ordered_on.getTime()))
    );
  }

  getOrdersByUserId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.get<{ success: number; data: any }>(`${this.orderUrl}/user/${id}`, { headers: headers }).pipe(
      map(res => {
        return res.data.map((order: any) => ({
          order_id: order.order_id,
          amount_paid: order.amount_paid,
          user_id: order.user_id,
          order_status: order.order_status,
          ordered_on: new Date(order.ordered_on),
          user: {
            user_id: order.user_id,
            username: order.username,
            email_address: order.email_address,
            password_hash: order.password_hash,
            image_url: `${this.baseUrl}/uploads/${order.image_url}` || null,
            verification_token: order.verification_token,
            is_verified: order.is_verified,
            created_on: new Date(order.created_on)
          } as User
        }) as Order);
      }),
      map(order => order.sort((a: any, b: any) => b.ordered_on.getTime() - a.ordered_on.getTime()))
    );
  }

  getOrderWithDetails(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.get<{ success: number; data: any }>(`${this.orderUrl}/order-details/${id}`, { headers: headers }).pipe(
      map(res => {
        res.data.ordered_on = new Date(res.data.ordered_on);
        return res.data;
      })
    );
  }

  getOrderDetailsByFoodId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.get<{ success: number; data: any }>(`${this.orderUrl}/order-details/menu/${id}`, { headers: headers }).pipe(
      map(res => {
        return res.data.map((order: any) => ({
          order_detail_id: order.order_detail_id,
          order_id: order.order_id,
          food_id: order.food_id,
          order_quantity: order.order_quantity,
          food: {
            food_id: order.food_id,
            food_name: order.food_name,
            price: order.price,
            quantity: order.quantity,
            image_url: `${this.baseUrl}/uploads/${order.image_url}` || null,
            vendor_id: order.vendor_id,
            created_on: new Date(order.created_on)
          } as Food
        }) as OrderDetails);
      })
    );
  }

  insertOrderWithOrderDetails(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.post(this.orderUrl, body, { headers: headers }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  updateOrder(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${cleanedToken}`);

    return this.http.put(this.orderUrl, body, { headers: headers }).pipe(
      tap((res) => console.log(res)),
      catchError((error) => throwError(() => error))
    );
  }
}
