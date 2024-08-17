import { Injectable } from '@angular/core';
import { Plugins, registerPlugin } from '@capacitor/core';
import {BackgroundGeolocationPlugin} from "@capacitor-community/background-geolocation";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");


@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  async getLocation(): Promise<any | null> {
    try {
      // Start the background geolocation watcher
      const position = await new Promise<any | null>((resolve, reject) => {
        BackgroundGeolocation.addWatcher(
          {
            backgroundMessage: 'Check out the Radar for game activity!',
            backgroundTitle: 'Laser Active! 🥳😎',
            requestPermissions: true,
            stale: true, // Get the most accurate location possible
          },
          (location, error) => {
            if (location) {
              resolve(location);
            } else {
              console.error('Error getting location:', error);
              reject(error);
            }
          }
        );
      });

      return position;

    } catch (error) {
      console.error('Failed to get location:', error);
      return null;
    }
  }
}
