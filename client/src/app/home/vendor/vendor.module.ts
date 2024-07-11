import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { VendorPageRoutingModule } from './vendor-routing.module';

import { VendorPage } from './vendor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorPageRoutingModule,
    SharedModule
  ],
  declarations: [VendorPage]
})
export class VendorPageModule {}
