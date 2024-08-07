import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from '../components/header/header.component';
import { SubHeaderComponent } from '../components/sub-header/sub-header.component';
import { TabsComponent } from '../components/tabs/tabs.component';
import { PrivacyPolicyComponent } from '../components/privacy-policy/privacy-policy.component';
import { ContactComponent } from '../components/contact/contact.component';
import { OrderComponent } from '../components/order/order.component';
import { AddMenuItemComponent } from '../components/add-menu-item/add-menu-item.component';
import { EditMenuItemComponent } from '../components/edit-menu-item/edit-menu-item.component';
import { EditProfileImageComponent } from '../components/edit-profile-image/edit-profile-image.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SubHeaderComponent,
    TabsComponent,
    PrivacyPolicyComponent,
    ContactComponent,
    OrderComponent,
    AddMenuItemComponent,
    EditMenuItemComponent,
    EditProfileImageComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    SubHeaderComponent,
    TabsComponent,
    PrivacyPolicyComponent,
    ContactComponent,
    OrderComponent,
    AddMenuItemComponent,
    EditMenuItemComponent,
    EditProfileImageComponent
  ]
})
export class SharedModule { }
