import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

import { Vendor } from '../../interfaces/vendor';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss'],
})
export class EditVendorComponent  implements OnInit {
  editForm!: FormGroup;
  vendor!: Vendor;
  vendorImageFile!: string;

  constructor(
    private vendorService: VendorService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

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
            this.initializeForm(vendor);
          } else {
            console.log('No vendor details found...');
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  initializeForm(vendor: Vendor) {
    this.editForm = new FormGroup({
      vendor_name: new FormControl(vendor.vendor_name, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      contact_no: new FormControl(vendor.contact_no, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      address: new FormControl(vendor.address, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      vendor_image_url: new FormControl(null)
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.editForm.patchValue({ vendor_image_url: file });
    this.editForm.get('vendor_image_url')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.vendorImageFile = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    const vendorData = new FormData();
    vendorData.append('vendor_name', this.editForm.get('vendor_name')?.value);
    vendorData.append('contact_no', this.editForm.get('contact_no')?.value);
    vendorData.append('address', this.editForm.get('address')?.value);

    if (this.editForm.get('vendor_image_url')?.value) {
      vendorData.append('vendor_image_url', this.editForm.get('vendor_image_url')?.value);
    }

    // call service update method
    this.vendorService.updateVendorById(this.vendor.vendor_id, vendorData).subscribe({
      next: async (response: any) => {
        console.log(response);

        const successAlert = await this.alertCtrl.create({
          header: 'SUCCESS!',
          subHeader: 'You have edited successfully!',
          message: 'Please click OK to continue...',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.navCtrl.navigateBack('/home/vendor');
            }
          }]
        });

        successAlert.present();

        setTimeout(() => {
          successAlert.dismiss();
        }, 3000);

        this.editForm.reset();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
