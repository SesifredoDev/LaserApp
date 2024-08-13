import { Component, OnInit } from '@angular/core';
import { LocationService } from './shared/services/location.service';
import { GameService } from './shared/services';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private gameService: GameService, 
    private platform: Platform,) { 
    
    this.platform.ready().then(() => {
      console.log('Platform ready');
      this.gameService.initializeBackgroundMode();
    });
  }
 
}
