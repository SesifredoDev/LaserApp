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
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { IGame } from '../../models/game-info.model';
import { Subscription } from 'rxjs';



@Injectable({

  providedIn: 'root'
})
export class GameService {

  socketConnection: boolean = false;
  activeGame: IGame = {gameCode: "", isConnected: false};
  bluetoothConnection: boolean = false;

  activeGameSubscription?: Subscription;

  initialize: boolean = false;
  
  user: any;
  onStartScore: number = 0;

  constructor(
    private socketService: WorkerService,
    private firebaseService: FirebaseService,
    private bluetoothService: BluetoothService,
    private router: Router,
    private readonly ngZone: NgZone,
    private backgroundMode: BackgroundMode,
  ) {
    // this.setUp();
    this.addListeners();
    this.autoPlayerUpdate();
  }

  async initializeBackgroundMode() {
    await ForegroundService.requestManageOverlayPermission();
    await ForegroundService.requestPermissions();
    this.backgroundMode.enable();
    this.backgroundMode.disableBatteryOptimizations();


    this.backgroundMode.on('activate').subscribe(async () => {
      ForegroundService.moveToForeground();
    })
    this.backgroundMode.on('deactivate').subscribe(() => {
      this.backgroundMode.moveToForeground();
    })
    
  }


  RunInBackground() {
    this.backgroundMode.moveToBackground();
    
    
  }

  async setUp() {
    if(!this.initialize){
      
    // Get User Details
    let uid = localStorage.getItem("uid");
    console.log(uid)
    this.firebaseService.getDetails(uid).subscribe((data: any) => {
      this.user = data.data();
      console.log(this.user, localStorage.getItem("uid"));
      
      let gameCode = localStorage.getItem('activeCode')
      if(gameCode){
        console.log('Reconnecting to game:', gameCode);
        this.socketService.joinGame(gameCode, this.user);
      }
    })


    this.firebaseService.changedAuth.subscribe( ()=>{
      this.firebaseService.getDetails({uid: localStorage.getItem("uid")}).subscribe((data: any) => {
        this.user = data.data();
      })
    })

    // Bluetooth Setup

    this.bluetoothService.isConnected.subscribe(isConnected => {
      this.bluetoothConnection = isConnected;

    })

    this.bluetoothService.shotUpdate.subscribe(shotUpdate => {
      this.gotShot(shotUpdate);
    })

    
    // Server Connection
    this.socketService.isConnected.subscribe(isConnected => {
      console.log('Socket is connected?', isConnected);
      this.socketConnection = isConnected;
      if (!isConnected) {

        console.error('Server not connected. Reconnecting...');
        this.router.navigate(['menu']);
        
        this.socketService.socketConnect();
      } else {
        this.router.navigate(['']);
        if(this.activeGame.isConnected && this.activeGame.gameCode){
          this.socketService.joinGame(this.activeGame.gameCode, this.user);
        }
      }
      this.initialize = true;
    })


    // Activated Game
    this.socketService.activeGame.subscribe(code => {
      console.log('Active game code:', code.gameCode);
      this.activeGame = code;
      if(code.gameCode !== undefined) {
        localStorage.setItem('activeCode', code.gameCode);
      }

      if (!code.isConnected) {

        console.error('Game not connected. Reconnecting...');
        this.router.navigate(['menu']);
      } else {
        this.router.navigate(['']);
      }
    })
    
    // Initialize services
    this.bluetoothService.initialized();
    
    this.socketService.socketConnect();



    }

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


  connectToGame(code: string, extraInfo?: any) {
   let  playerInfo = {uid: this.user.uid, name: this.user.name}
    if(extraInfo){
      playerInfo = {...playerInfo,...extraInfo}
    }
    this.socketService.joinGame(code, playerInfo)
  }

  disconnectFromGame(){
    this.socketService.disconnectGame();
  }

  gotShot(any: any) {
    this.socketService.sendGotShot(any);
  }

  autoPlayerUpdate(){
    this.socketService.playerData.subscribe((data)=>{
      let newTotal = data.changeScore + this.user.totalScore ;
      this.user.totalScore = newTotal;
      console.log(this.user.totalScore)
      this.firebaseService.updateDetails({uid: this.user.uid, totalScore: newTotal});
    })
  }


}
