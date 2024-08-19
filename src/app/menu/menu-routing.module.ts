import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';
import { BlueComponent } from './blue/blue.component';

const routes: Routes = [
  {
    path: '',
    component: MenuPage
  },
  {
    path: 'bluetooth',
    component: BlueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
