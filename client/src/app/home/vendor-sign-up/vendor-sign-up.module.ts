import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { VendorSignUpPageRoutingModule } from './vendor-sign-up-routing.module';

import { VendorSignUpPage } from './vendor-sign-up.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VendorSignUpPageRoutingModule,
    SharedModule
  ],
  declarations: [VendorSignUpPage]
})
export class VendorSignUpPageModule {}
