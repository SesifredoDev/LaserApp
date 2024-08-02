import { CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IonicModule } from '@ionic/angular';
import { MapPageModule } from './map/map.module';
import { HomePageRoutingModule } from './home/home-routing.module';
import { HomePageModule } from './home/home.module';
import { WorkerService } from '../shared/services/worker.service';
import { AuthGuard } from '@angular/fire/auth-guard';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MainRoutingModule,
    IonicModule
  ],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule implements OnInit{

  constructor(private socket: WorkerService){}

  ngOnInit(): void {
    if(AuthGuard){
      
      this.socket.socketConnect();
    }else{
      alert("not logged in")
    }
  }
 }
