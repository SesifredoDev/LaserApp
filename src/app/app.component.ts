import { Component, OnInit } from '@angular/core';
import { LocationService } from './shared/services/location.service';

import { Platform } from '@ionic/angular';
import { FirebaseService } from './shared/services/firebase.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private readonly ls: LocationService, private readonly firebaseService: FirebaseService) {
  }
  ngOnInit(): void {
    this.ls.setUp();
  }

  logout(){
    this.firebaseService.logout();
  }

}
