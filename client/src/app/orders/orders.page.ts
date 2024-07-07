import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';

import { Order } from '../interfaces/order';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  @ViewChild('accordionGroup', {static: true}) accordionGroup!: IonAccordionGroup;
  orders!: Order[];
  userId!: number;
  hasOrders = false;

  constructor(private orderService: OrderService) { }

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

  onRefresh() {
    window.location.reload();
  }
}
