import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/interfaces/food';
import { OrderComponent } from 'src/app/components/order/order.component';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.page.html',
  styleUrls: ['./food-detail.page.scss'],
})
export class FoodDetailPage implements OnInit {
  food!: Food;
  foodId!: number;
  vendorName!: string;
  contactNumber!: string;
  address!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private foodService: FoodService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('foodId')) {
        this.navCtrl.navigateBack('/home');
        return;
      } else {
        this.foodId = parseInt(paramMap.get('foodId')!);
        this.foodService.getFoodById(this.foodId).subscribe({
          next: (response: Food) => {
            this.food = response;
            this.foodService.getFoodByVendorId(this.food.vendor_id).subscribe({
              next: (response) => {
                this.vendorName = response.vendor_name;
                this.contactNumber = response.contact_no;
                this.address = response.address;
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
    });
  }

  onOrder() {
    this.modalCtrl.create({
      component: OrderComponent
    }).then(modalEl => modalEl.present());
  }
}
