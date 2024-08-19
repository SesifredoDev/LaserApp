import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { BluetoothService, GameService } from "../services";

@Injectable({
    providedIn: 'root'
  })
  export class gameGaurd implements CanActivate {
    constructor(private gameService: GameService, private bluetoothService: BluetoothService, private router: Router) {}
  
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.gameService.activeGame.isConnected && this.bluetoothService.devices.length > 0) {
        return true;
      } else {
        if(!this.gameService.activeGame.isConnected){
            // Navigate to menu
            this.router.navigate(['menu']);
        }
        // else{
        //     this.router.navigate(['menu/bluetooth']);
        // }
        return true;
      }
    }
  }