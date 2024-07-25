import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { EditVendorComponent } from '../../components/edit-vendor/edit-vendor.component';
import { Vendor } from '../../interfaces/vendor';
import { VendorService } from '../../services/vendor.service';
import { FoodService } from '../../services/food.service';
import { AddMenuItemComponent } from '../../components/add-menu-item/add-menu-item.component';
import { Food } from '../../interfaces/food';
import { EditMenuItemComponent } from 'src/app/components/edit-menu-item/edit-menu-item.component';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.page.html',
  styleUrls: ['./vendor.page.scss'],
})
export class VendorPage implements OnInit {
  @ViewChild('accordionGroup', {static: true}) accordionGroup!: IonAccordionGroup;
  vendor!: Vendor;
  menu!: Food[];
  isLoading = false;
  hasMenu = false;
  vendorImageFile!: string;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private vendorService: VendorService,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    this.getVendorByUserId();
    this.getMenuItemsByVendorId();
  }

  getVendorByUserId() {
    const jsonUserId = localStorage.getItem('userId');

    if (jsonUserId) {
      const userId = parseInt(jsonUserId, 10);

      this.vendorService.getVendorByUserId(userId).subscribe({
        next: (vendor: Vendor | null) => {
          if (vendor !== null) {
            if (vendor.vendor_image_url) {
              this.vendorImageFile = vendor.vendor_image_url?.slice(30); // slice the url and get the image file name
            }

            this.vendorService.set('vendorId', vendor.vendor_id);

            this.vendor = vendor;
            this.isLoading = true;
          } else {
            this.showVendorFailAlert();
          }
        },
        error: (error) => {
          console.log(error);
          this.showVendorFailAlert();
        }
      });
    }
  }

  async showVendorFailAlert() {
    const failAlert = await this.alertCtrl.create({
      header: 'SIGN UP!',
      subHeader: 'Unable to retrieve vendor details!',
      message: 'Please sign up as a vendor below.',
      buttons: [
        {
          text: 'SIGN UP',
          handler: () => {
            this.navCtrl.navigateForward('/home/vendor-sign-up'); // change to sign up modal url
          }
        },
        {
          text: 'CANCEL',
          handler: () => {
            failAlert.dismiss();
            this.navCtrl.navigateBack('/home/account');
          }
        }
      ]
    });

    failAlert.present();
  }

  getMenuItemsByVendorId() {
    const jsonVendorId = localStorage.getItem('vendorId');

    if (jsonVendorId) {
      const vendorId = parseInt(jsonVendorId, 10);

      this.foodService.getFoodByVendorId(vendorId).subscribe({
        next: (response: Food[]) => {
          if (response.length > 0) {
            this.menu = response;
            this.hasMenu = true;
          } else {
            this.hasMenu = false;
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  onMenuEdit(id: number) {
    this.foodService.getFoodById(id).subscribe({
      next: (response: any) => {
        this.modalCtrl.create({
          component: EditMenuItemComponent,
          componentProps: { selectedMenuItem: response }
        }).then(modalEl => modalEl.present());
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  async onMenuDelete(id: number) {
    const confirmAlert = await this.alertCtrl.create({
      header: 'DELETE?',
      subHeader: 'Click OK to delete.',
      message: 'Click CANCEL to go back.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.foodService.deleteFoodById(id).subscribe({
              next: async (response: any) => {
                if (response.success === 1) {
                  const successAlert = await this.alertCtrl.create({
                    header: 'SUCCESS!',
                    subHeader: 'Successfully deleted menu item!',
                    message: 'Click OK to continue.',
                    buttons: [
                      {
                        text: 'OK',
                        handler: () => {
                          successAlert.dismiss();
                          this.navCtrl.navigateBack('/home/vendor');
                        }
                      }
                    ]
                  });
        
                  successAlert.present();
                }
              }
            });
          }
        },
        {
          text: 'CANCEL',
          handler: () => {
            confirmAlert.dismiss();
            this.navCtrl.navigateBack('/home/vendor');
          }
        }
      ]
    });

    confirmAlert.present();
  }

  onEdit() {
    this.modalCtrl.create({
      component: EditVendorComponent
    }).then(modalEl => modalEl.present());
  }

  onAddMenuItem() {
    this.modalCtrl.create({
      component: AddMenuItemComponent
    }).then(modalEl => modalEl.present());
  }
}
