import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

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
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      vendor_name: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      contact_no: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      address: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      vendor_image_url: new FormControl(null)
    });
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
            this.updateForm(vendor);
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

  updateForm(vendor: Vendor) {
    this.editForm.patchValue({
      vendor_name: vendor.vendor_name,
      contact_no: vendor.contact_no,
      address: vendor.address
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.editForm.patchValue({ vendor_image_url: file });
    this.editForm.value.vendor_image_url.updateValueAndValidity();

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
    vendorData.append('vendor_name', this.editForm.value.vendor_name);
    vendorData.append('contact_no', this.editForm.value.contact_no);
    vendorData.append('address', this.editForm.value.address);

    if (this.editForm.value.vendor_image_url) {
      vendorData.append('vendor_image_url', this.editForm.value.vendor_image_url);
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

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
