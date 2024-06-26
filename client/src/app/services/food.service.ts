import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Food } from '../interfaces/food';

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
        console.log(item);
        item.image_url = `${this.baseUrl}/${item.image_url}` || null;
        item.created_on = new Date(item.created_on);
        return item;
      })),
      map(food => food.sort((a, b) => b.created_on.getTime() - a.created_on.getTime()))
    );
  }
}
