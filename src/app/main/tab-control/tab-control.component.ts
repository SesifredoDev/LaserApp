import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { FirebaseService, LocationService } from 'src/app/shared/services';

@Component({
  selector: 'app-tab-control',
  templateUrl: './tab-control.component.html',
  styleUrls: ['./tab-control.component.scss']
})
export class TabControlComponent  implements OnInit {
  constructor(private readonly ls: LocationService, private readonly firebaseService: FirebaseService) {
  }
  ngOnInit(): void {
    this.ls.setUp();
  }

  logout(){
    this.firebaseService.logout();
  }

}
