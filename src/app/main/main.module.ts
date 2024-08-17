import { CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IonicModule } from '@ionic/angular';
import { MapPageModule } from './map/map.module';
import { HomePageRoutingModule } from './home/home-routing.module';
import { HomePageModule } from './home/home.module';
import { WorkerService } from '../shared/services/worker.service';
import { AuthGuard } from '@angular/fire/auth-guard';
import { GameService } from '../shared/services';
import { TabControlComponent } from './tab-control/tab-control.component';


@NgModule({
  declarations: [
    TabControlComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    IonicModule
  ],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule {

  constructor(private gameService: GameService){
    
  }
  // ngOnInit(): void {
  //   gameService.setUp();
  // }

  // ngOnInit(): void {
  //   if(AuthGuard){
      
  //     this.socket.socketConnect();
  //   }else{
  //     alert("not logged in")
  //   }
  // }
 }
