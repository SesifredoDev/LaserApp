import { Component, OnInit, NgZone } from '@angular/core';
import { LocationService } from './shared/services/location.service';

import { Platform } from '@ionic/angular';
import { FirebaseService } from './shared/services/firebase.service';

import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { GameService } from './shared/services';
import { ThemeService } from './shared/services/theme/theme.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  
  constructor(
    private gameService: GameService, 
    private platform: Platform,
    private router: Router, 
    private zone: NgZone,
    private themeService: ThemeService
  ) {
     
    this.platform.ready().then(() => {
      this.initializeApp();
      this.gameService.initializeBackgroundMode();
      
    });
  }

  // ngOnInit(): void {
    
  // }
 




  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {
            // Example url: https://beerswift.app/tabs/tab2
            // slug = /tabs/tab2
            const slug = event.url.split(".app").pop();
            if (slug) {
                this.router.navigateByUrl(slug);
            }
            // If no match, do nothing - let regular routing
            // logic take over
        });
    });
  } 
}