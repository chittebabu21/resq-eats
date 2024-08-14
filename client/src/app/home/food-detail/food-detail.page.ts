import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ModalController, AlertController } from '@ionic/angular';

import { FoodService } from '../../services/food.service';
import { UserService } from '../../services/user.service';
import { Food } from '../../interfaces/food';
import { OrderComponent } from '../../components/order/order.component';

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
    private alertCtrl: AlertController,
    private foodService: FoodService,
    private userService: UserService
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
              next: (response: any) => {
                const jsonResponse = response as any;
                this.vendorName = jsonResponse[0].vendor.vendor_name;
                this.contactNumber = jsonResponse[0].vendor.contact_no;
                this.address = jsonResponse[0].vendor.address;
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
    const userId = this.userService.get('userId')!;

    this.userService.getUserById(parseInt(userId)).subscribe({
      next: async (response: any) => {
        const user = response;

        if (user && user.is_verified === 1) {
          this.modalCtrl.create({
            component: OrderComponent,
            componentProps: { 
              selectedFood: this.food,
              selectedVendor: {
                vendorName: this.vendorName,
                contactNumber: this.contactNumber,
                address: this.address
              }
            }
          }).then(modalEl => modalEl.present());
        } else {
          const errorAlert = await this.alertCtrl.create({
            header: 'ACCESS DENIED!',
            message: 'Please verify your account to proceed to order page.',
            backdropDismiss: false,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.navCtrl.navigateBack('/home/main');
              }
            }]
          });

          await errorAlert.present();
        }
      }
    });
    
  }
}
