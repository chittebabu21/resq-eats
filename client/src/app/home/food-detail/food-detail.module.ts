import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { FoodDetailPageRoutingModule } from './food-detail-routing.module';

import { FoodDetailPage } from './food-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [FoodDetailPage]
})
export class FoodDetailPageModule {}
