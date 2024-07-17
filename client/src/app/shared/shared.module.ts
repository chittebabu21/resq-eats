import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from '../components/header/header.component';
import { SubHeaderComponent } from '../components/sub-header/sub-header.component';
import { TabsComponent } from '../components/tabs/tabs.component';
import { PrivacyPolicyComponent } from '../components/privacy-policy/privacy-policy.component';
import { ContactComponent } from '../components/contact/contact.component';
import { OrderComponent } from '../components/order/order.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SubHeaderComponent,
    TabsComponent,
    PrivacyPolicyComponent,
    ContactComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    SubHeaderComponent,
    TabsComponent,
    PrivacyPolicyComponent,
    ContactComponent,
    OrderComponent
  ]
})
export class SharedModule { }
