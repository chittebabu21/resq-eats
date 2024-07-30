import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Helper } from '../../utility/helper';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile-image',
  templateUrl: './edit-profile-image.component.html',
  styleUrls: ['./edit-profile-image.component.scss'],
})
export class EditProfileImageComponent implements OnInit {
  @Input() selectedUser!: User
  editForm!: FormGroup;
  user!: User;
  userImageFile!: string;
  imageBlob!: Blob;
  errorMsg = '';

  constructor(
    private userService: UserService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      email_address: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      image_url: new FormControl(null)
    });

    this.updateForm();

    console.log(this.editForm.value);
  }

  updateForm() {
    this.editForm.patchValue({
      email_address: this.selectedUser.email_address,
      image_url: this.selectedUser.image_url || null
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
      this.userImageFile = image.dataUrl;

      if (
        this.userImageFile.startsWith('data:image/png;', 0) ||
        this.userImageFile.startsWith('data:image/jpg;', 0) ||
        this.userImageFile.startsWith('data:image/jpeg;', 0) 
      ) {
        try {
          const blob = this.helper.base64ToBlob(this.userImageFile.slice(23), 'image/jpg');
          this.imageBlob = new File([blob], 'vendor_image.jpg', { type: 'image/jpg'} );
        } catch (error) {
          console.log(error);
          return;
        }
      }
    }).catch((error) => {
      console.log(error);
      return;
    })
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    const userData = new FormData();
    userData.append('email_address', this.editForm.value.email_address);
    
    if (this.imageBlob) {
      userData.append('image_url', this.imageBlob);
    }

    // call service update method
    this.userService.updateUserImage(userData).subscribe({
      next: async (response: any) => {
        console.log(response);

        const successAlert = await this.alertCtrl.create({
          header: 'SUCCESS!',
          subHeader: 'You have updated your profile image successfully!',
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
        this.userImageFile = '';
        this.errorMsg = '';
      },
      error: (error) => {
        console.log(error);

        this.errorMsg = 'Failed to update profile image. Please try again.';
        
        this.editForm.reset();
        this.userImageFile = '';
      }
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
