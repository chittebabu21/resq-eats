import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Food } from 'src/app/interfaces/food';

import { FoodService } from 'src/app/services/food.service';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-menu-item',
  templateUrl: './add-menu-item.component.html',
  styleUrls: ['./add-menu-item.component.scss'],
})
export class AddMenuItemComponent implements OnInit {
  addForm!: FormGroup;
  food!: Food;
  vendorId!: number;
  errorMsg = '';

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private foodService: FoodService
  ) { }

  ngOnInit() {
    this.getVendorId();

    this.addForm = new FormGroup({
      food_name: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      }),
      price: new FormControl(0, {
        validators: [Validators.min(0), Validators.max(100)]
      }),
      quantity: new FormControl(0, {
        validators: [Validators.required, Validators.min(0), Validators.max(10000)]
      }),
      vendor_id: new FormControl(this.vendorId, {
        validators: [Validators.required]
      })
    });
  }

  getVendorId() {
    const jsonVendorId = localStorage.getItem('vendorId');

    if (jsonVendorId) {
      this.vendorId = parseInt(jsonVendorId);
    } else {
      this.errorMsg = 'Only vendors can add menu items.';
    }
  }

  onSubmit() {
    if (this.addForm.valid) {
      const { food_name, price, quantity, vendor_id } = this.addForm.value;

      this.foodService.insertFood({ food_name, price, quantity, vendor_id }).subscribe({
        next: async (response: any) => {
          console.log(response);
          const successAlert = await this.alertCtrl.create({
            header: 'SUCCESS!',
            subHeader: 'You have added an item successfully!',
            message: 'Please click OK to continue.',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.modalCtrl.dismiss();
              }
            }]
          });
      
          successAlert.present();
          this.addForm.reset();
          this.errorMsg = '';
        },
        error: (error) => {
          console.log(error);

          this.errorMsg = 'Failed to add menu item. Please try again.';
          this.addForm.reset();
        }
      });
    }
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
