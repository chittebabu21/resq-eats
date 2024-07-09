import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    SharedModule
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
