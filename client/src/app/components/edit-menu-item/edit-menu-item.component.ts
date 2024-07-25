import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Food } from '../../interfaces/food';
import { FoodService } from '../../services/food.service';
import { Helper } from '../../utility/helper';

@Component({
  selector: 'app-edit-menu-item',
  templateUrl: './edit-menu-item.component.html',
  styleUrls: ['./edit-menu-item.component.scss'],
})
export class EditMenuItemComponent  implements OnInit {
  @Input() selectedMenuItem!: Food;
  editForm!: FormGroup;
  food!: Food;
  foodImageFile!: string;
  imageFile!: Blob;
  errorMsg = '';

  constructor(
    private foodService: FoodService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      food_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      food_name: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      price: new FormControl(0, {
        validators: [Validators.min(0), Validators.max(100)]
      }),
      quantity: new FormControl(0, {
        validators: [Validators.required, Validators.min(0), Validators.max(10000)]
      }),
      image_url: new FormControl(null)
    });

    this.updateForm();
  }

  updateForm() {
    this.editForm.patchValue({
      food_id: this.selectedMenuItem.food_id,
      food_name: this.selectedMenuItem.food_name,
      price: this.selectedMenuItem.price,
      quantity: this.selectedMenuItem.quantity,
      image_url: this.selectedMenuItem.image_url || null
    });
  }

  onImagePicked() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Photos,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
    }).then((image: any) => {
      this.foodImageFile = image.dataUrl;

      if (
        this.foodImageFile.startsWith('data:image/png;', 0) ||
        this.foodImageFile.startsWith('data:image/jpg;', 0) ||
        this.foodImageFile.startsWith('data:image/jpeg;', 0) 
      ) {
        try {
          const blob = this.helper.base64ToBlob(this.foodImageFile.slice(23), 'image/jpg');
          this.imageFile = new File([blob], 'vendor_image.jpg', { type: 'image/jpg'} );
          console.log(this.imageFile);
        } catch (error) {
          console.log(error);
          return;
        }
      }
    }).catch(error => console.log(error));
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    const foodData = new FormData();
    foodData.append('food_id', this.editForm.value.food_id);
    foodData.append('food_name', this.editForm.value.food_name);
    foodData.append('price', this.editForm.value.price);
    foodData.append('quantity', this.editForm.value.quantity);

    if (this.imageFile) {
      foodData.append('image_url', this.imageFile);
    }

    // call service update method
    this.foodService.updateFood(foodData).subscribe({
      next: async (response: any) => {
        console.log(response);

        const successAlert = await this.alertCtrl.create({
          header: 'SUCCESS!',
          subHeader: 'You have edited successfully!',
          message: 'Please click OK to continue...',
          backdropDismiss: false,
          buttons: [{
            text: 'OK',
            handler: () => {
              this.modalCtrl.dismiss();
            }
          }]
        });

        successAlert.present();
        this.editForm.reset();
        this.foodImageFile = '';
        this.errorMsg = '';
      },
      error: async (error) => {
        console.log(error);

        this.errorMsg = 'Failed to update menu item. Please try again.';
        
        this.editForm.reset();
        this.foodImageFile = '';
      }
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
