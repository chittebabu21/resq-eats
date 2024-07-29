import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';

import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor-sign-up',
  templateUrl: './vendor-sign-up.page.html',
  styleUrls: ['./vendor-sign-up.page.scss'],
})
export class VendorSignUpPage implements OnInit {
  vendorForm!: FormGroup;
  errorMsg = '';

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private vendorService: VendorService
  ) { }

  ngOnInit() {
    this.vendorForm = new FormGroup({
      vendor_name: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      country_code: new FormControl('+65', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      contact_no: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required, 
          Validators.pattern("^[0-9]*$"), 
          Validators.minLength(8), 
          Validators.maxLength(8)
        ]
      }),
      address: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      postal_code: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required, 
          Validators.pattern("^[0-9]*$"), 
          Validators.minLength(4), 
          Validators.maxLength(6)
        ]
      })
    });
  }

  onSignUp() {
    if (this.vendorForm.valid) {
      const userId = this.vendorService.get('userId');

      const { vendor_name, country_code, contact_no, address, postal_code } = this.vendorForm.value;
      const fullContactNo = `${country_code}${contact_no}`;
      const fullAddress = `${address} P.O ${postal_code}`;

      this.vendorService.insertVendor({ vendor_name, contact_no: fullContactNo, address: fullAddress, user_id: userId }).subscribe({
        next: (response: any) => {
          const jsonResponse = response as any;
          this.errorMsg = '';

          if (jsonResponse.success === 1) {
            this.showSuccessAlert();
            this.vendorForm.reset();

            setTimeout(() => {
              this.navCtrl.navigateBack('/home/account');
            }, 3000);
          }
        },
        error: (error) => {
          console.log(error);
          this.errorMsg = 'Failed to sign up as vendor. Please contact us for assistance.';
          this.vendorForm.reset();
        }
      });
    }
  }

  async showSuccessAlert() {
    const successAlert = await this.alertCtrl.create({
      header: 'SUCCESS!',
      subHeader: 'You have signed up successfully!',
      message: 'Please add your menu items',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateBack('/home/account');
        }
      }]
    });

    successAlert.present();

    setTimeout(() => {
      successAlert.dismiss();
    }, 3000);
  }

  onBack() {
    this.navCtrl.navigateBack('/home/account');
  }

}
