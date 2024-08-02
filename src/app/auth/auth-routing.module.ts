import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),

  },
  {
    path:'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule),

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
