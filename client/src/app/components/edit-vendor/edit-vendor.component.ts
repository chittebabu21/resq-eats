import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Vendor } from '../../interfaces/vendor';
import { VendorService } from '../../services/vendor.service';
import { Helper } from '../../utility/helper';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss'],
})
export class EditVendorComponent implements OnInit {
  editForm!: FormGroup;
  vendor!: Vendor;
  vendorImageFile!: string;
  imageFile!: Blob;
  errorMsg = '';

  constructor(
    private vendorService: VendorService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private helper: Helper
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
          if (vendor !== null) {
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
      address: vendor.address,
      vendor_image_url: this.imageFile || null
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
      this.vendorImageFile = image.dataUrl;

      if (
        this.vendorImageFile.startsWith('data:image/png;', 0) ||
        this.vendorImageFile.startsWith('data:image/jpg;', 0) ||
        this.vendorImageFile.startsWith('data:image/jpeg;', 0) 
      ) {
        try {
          const blob = this.helper.base64ToBlob(this.vendorImageFile.slice(23), 'image/jpg');
          this.imageFile = new File([blob], 'vendor_image.jpg', { type: 'image/jpg'} );
          console.log(this.imageFile);
        } catch (error) {
          console.log(error);
          return;
        }
      }
    }).catch(error => {
      console.log(error);
      return;
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    const vendorData = new FormData();
    vendorData.append('vendor_name', this.editForm.value.vendor_name);
    vendorData.append('contact_no', this.editForm.value.contact_no);
    vendorData.append('address', this.editForm.value.address);

    if (this.imageFile) {
      vendorData.append('vendor_image_url', this.imageFile);
    }

    // call service update method
    this.vendorService.updateVendorById(this.vendor.vendor_id, vendorData).subscribe({
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
        this.vendorImageFile = '';
        this.errorMsg = '';
      },
      error: async (error) => {
        console.log(error);

        this.errorMsg = 'Failed to update vendor. Please try again.';
        
        this.editForm.reset();
        this.vendorImageFile = '';
      }
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}