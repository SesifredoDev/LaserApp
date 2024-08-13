import { Injectable, NgZone, OnInit } from '@angular/core';
import { WorkerService } from '../worker.service';
import { LocationService } from '../location.service';
import { FirebaseService } from '../firebase.service';
import { DialogService } from '../dialog.service';
import { BluetoothService } from '../bluetooth.service';
import { GlobalErrorHandlerService } from '../global-error-handler.service';
import { Router } from '@angular/router';
import { BackgroundMode} from '@anuradev/capacitor-background-mode';
import { Platform } from '@ionic/angular';



@Injectable({

  providedIn: 'root'
})
export class GameService {

  user: any;

  constructor(
    private socketService: WorkerService,
    private firebaseService: FirebaseService,
    private bluetoothService: BluetoothService,
    private router: Router,
    private readonly ngZone: NgZone,
  ) {
    this.setUp();
  }

  initializeBackgroundMode() {
    BackgroundMode.requestForegroundPermission()
    BackgroundMode.checkNotificationsPermission().then(permission => {
      if (permission.display !== 'granted') {
        BackgroundMode.moveToBackground();
        BackgroundMode.requestNotificationsPermission()
      }
    })
    
    BackgroundMode.enable();

    BackgroundMode.addListener('appInBackground', ()=>{
      this.setUp();
    })
    
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


  connectToGame(code: string) {

    this.socketService.joinGame(code, this.user)
  }

  gotShot(any: any) {
    this.socketService.sendGotShot(any);
  }


}
