import { Injectable, NgZone, OnInit } from '@angular/core';
import { WorkerService } from '../worker.service';
import { LocationService } from '../location.service';
import { FirebaseService } from '../firebase.service';
import { DialogService } from '../dialog.service';
import { BluetoothService } from '../bluetooth.service';
import { GlobalErrorHandlerService } from '../global-error-handler.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ForegroundService } from '@capawesome-team/capacitor-android-foreground-service';




@Injectable({

  providedIn: 'root'
})
export class GameService {

  private readonly GH_URL =
    'https://github.com/capawesome-team/capacitor-plugins';
  user: any;

  constructor(
    private socketService: WorkerService,
    private firebaseService: FirebaseService,
    private bluetoothService: BluetoothService,
    private router: Router,
    private readonly ngZone: NgZone,
  ) {
    // this.setUp();
    this.initializeBackgroundMode();
    this.addListeners();
  }

  async initializeBackgroundMode() {
    await ForegroundService.requestManageOverlayPermission();
    await ForegroundService.requestPermissions();
    await ForegroundService.startForegroundService({body: 'Laser Tag', title: 'Laser Tag', id: 1222, smallIcon:''});
  }

  async setUp() {

    // Get User Details
    let uid = localStorage.getItem("uid");
    this.firebaseService.getDetails(uid).subscribe((data: any) => {
      this.user = data.data();
      console.log(this.user, localStorage.getItem("uid"));
      
      let gameCode = localStorage.getItem('activeCode')
      if(gameCode){
        console.log('Reconnecting to game:', gameCode);
        this.socketService.joinGame(gameCode, this.user);
      }
    })

    // Bluetooth Setup

    this.bluetoothService.isConnected.subscribe(isConnected => {
      console.log('Bluetooth is connected?', isConnected);

    })

    this.bluetoothService.shotUpdate.subscribe(shotUpdate => {
      this.gotShot(shotUpdate);
    })

    
    // Server Connection
    this.socketService.isConnected.subscribe(isConnected => {
      console.log('Socket is connected?', isConnected);
      if (!isConnected) {

        console.error('Server not connected. Reconnecting...');
        this.router.navigate(['menu']);
      } else {
        this.router.navigate(['']);
      }
    })


    // Activated Game

    this.socketService.activeGame.subscribe(code => {
      console.log('Active game code:', code.activeCode);
      if(code.activeCode !== undefined) {
        localStorage.setItem('activeCode', code.activeCode);
      }
    })

    // Initialize services
    this.bluetoothService.initialized()
    this.socketService.socketConnect();


  }


  
  private addListeners(): void {
    ForegroundService.removeAllListeners().then(() => {
      ForegroundService.addListener('buttonClicked', event => {
        this.ngZone.run(() => {
          ForegroundService.stopForegroundService();
          ForegroundService.moveToForeground();
        });
      });
    });
  }


  connectToGame(code: string) {

    this.socketService.joinGame(code, this.user)
  }

  gotShot(any: any) {
    this.socketService.sendGotShot(any);
  }


}
