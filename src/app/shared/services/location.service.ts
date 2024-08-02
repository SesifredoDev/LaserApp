import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  isSetup: boolean = false
  constructor() { }

  async setUp(){
    if(!Geolocation.checkPermissions()){
      Geolocation.requestPermissions();
      this.isSetup = true;
    }
  }
  async getCurrentCoords(){
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates;
  };
}
