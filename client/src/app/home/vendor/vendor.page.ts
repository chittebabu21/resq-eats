import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { EditVendorComponent } from '../../components/edit-vendor/edit-vendor.component';
import { Vendor } from '../../interfaces/vendor';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.page.html',
  styleUrls: ['./vendor.page.scss'],
})
export class VendorPage implements OnInit {
  vendor!: Vendor;
  isLoading = false;
  vendorImageFile!: string;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    this.getVendorByUserId();
  }

  getVendorByUserId() {
    const jsonUserId = localStorage.getItem('userId');

    if (jsonUserId) {
      const userId = parseInt(jsonUserId, 10);

      this.vendorService.getVendorByUserId(userId).subscribe({
        next: (vendor: Vendor | null) => {
          console.log(vendor);
          if (vendor !== null) {
            if (vendor.vendor_image_url) {
              this.vendorImageFile = vendor.vendor_image_url?.slice(30); // slice the url and get the image file name
            }

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
            this.navCtrl.navigateForward('/home/account'); // change to sign up modal url
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

  onEdit() {
    this.modalCtrl.create({
      component: EditVendorComponent
    }).then(modalEl => modalEl.present());
  }

}
