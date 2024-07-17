import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorSignUpPage } from './vendor-sign-up.page';

const routes: Routes = [
  {
    path: '',
    component: VendorSignUpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorSignUpPageRoutingModule {}
