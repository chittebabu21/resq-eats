import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    GoogleSigninButtonModule,
    SharedModule
  ],
  declarations: [
    LoginPage
  ],
  providers: [
   
  ]
})
export class LoginPageModule {}
