import { Component, OnInit } from '@angular/core';

import { Order } from '../../interfaces/order';
import { Food } from '../../interfaces/food';
import { Vendor } from '../../interfaces/vendor';
import { OrderService } from '../../services/order.service';
import { FoodService } from '../../services/food.service';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {
  orders!: Order[];
  vendor!: Vendor;
  userId!: number;
  hasOrders = false;
  orderDetailsMap: Map<number, Food> = new Map();

  constructor(
    private orderService: OrderService, 
    private foodService: FoodService,
    private vendorService: VendorService
  ) { }

  ngOnInit() {
    this.getOrdersByUserId();
  }

  getOrdersByUserId() {
    const jsonUserId = localStorage.getItem('userId');
    
    if (jsonUserId !== null) {
      this.userId = parseInt(jsonUserId, 10);

      this.orderService.getOrdersByUserId(this.userId).subscribe({
        next: (response: Order[]) => {
          if (response.length > 0) {
            this.orders = response;
            this.hasOrders = true;

            // get order details once orders is populated
            this.orders.forEach((order) => {
              this.orderService.getOrderWithDetails(order.order_id).subscribe({
                next: (response: any) => {
                  const jsonResponse = response as any;
                  this.getOrderDetailsByFoodId(jsonResponse.food_id, order.order_id)!;
                },
                error: (error) => {
                  console.log(error);
                }
              });
            });
          } else {
            this.hasOrders = false;
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      console.log('No user ID found...');
    }
  }

  getOrderDetailsByFoodId(foodId: number, orderId: number) {
    this.foodService.getFoodById(foodId).subscribe({
      next: (response: Food) => {
        this.orderDetailsMap.set(orderId, response);
        this.vendorService.getVendorById(response.vendor_id).subscribe({
          next: (response: Vendor) => {
            this.vendor = response;
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onRefresh() {
    window.location.reload();
  }
}
