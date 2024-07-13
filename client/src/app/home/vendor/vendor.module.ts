import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { VendorPageRoutingModule } from './vendor-routing.module';
import { EditVendorComponent } from 'src/app/components/edit-vendor/edit-vendor.component';

import { VendorPage } from './vendor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VendorPageRoutingModule,
    SharedModule
  ],
  declarations: [VendorPage, EditVendorComponent]
})
export class VendorPageModule {}
