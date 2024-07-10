import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';

import { Order } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/interfaces/food';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  @ViewChild('accordionGroup', {static: true}) accordionGroup!: IonAccordionGroup;
  orders!: Order[];
  userId!: number;
  orderDetailsMap: Map<number, Food> = new Map(); // store order details mapped by order id
  hasOrders = false;

  constructor(private orderService: OrderService, private foodService: FoodService) { }

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
                  this.getOrderDetailsByFoodId(jsonResponse.food_id, order.order_id);
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
