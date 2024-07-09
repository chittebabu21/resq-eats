import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { FoodService } from '../../services/food.service';
import { Food } from '../../interfaces/food';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  fillList = 'solid';
  fillMap = 'outline';
  food!: Food[];
  vendorNames: { [key: number]: string } = {};

  constructor(
    private navCtrl: NavController,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.getAllFood();
  }

  onListClick() {
    this.fillList = 'solid';
    this.fillMap = 'outline';

    this.navCtrl.navigateBack('/home/main');
  }

  onMapClick() {
    this.fillList = 'outline';
    this.fillMap = 'solid';

    this.navCtrl.navigateForward('/home/map');
  }

  getAllFood() {
    this.foodService.getAllFood().subscribe({
      next: (response: Food[]) => {
        this.food = response;
        this.food.forEach(item => {
          this.getFoodByVendorId(item.vendor_id);
        });
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getFoodByVendorId(id: number) {
    this.foodService.getFoodByVendorId(id).subscribe({
      next: (response: any) => {
        const jsonResponse = response as any;
        this.vendorNames[id] = jsonResponse.vendor_name;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  navigateToFoodDetail(id: number) {
    this.navCtrl.navigateForward(`home/food-detail/${id}`);
  }
}
