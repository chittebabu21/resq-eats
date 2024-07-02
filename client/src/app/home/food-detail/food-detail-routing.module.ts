import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodDetailPage } from './food-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FoodDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodDetailPageRoutingModule {}
