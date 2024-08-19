import { Component, OnInit } from '@angular/core';
import { BleClient, BleDevice, ScanResult} from '@capacitor-community/bluetooth-le';
import { AlertController, ToastController } from '@ionic/angular';
import { BluetoothService } from '../../shared/services/bluetooth.service';
import { WorkerService } from '../../shared/services/worker.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { GameService } from 'src/app/shared/services';
import { firstValueFrom } from 'rxjs';
import { IGame } from 'src/app/shared/models/game-info.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  list: any;
  scanResults: BleDevice[] | null = null;
  devices: BleDevice[] = [];
  bleIsEnabled = false;
  searchingDevices = false;
  info:any = "";
  user: any;
  gameData?: IGame;
  playerData:any;

  constructor(
    private alertController: AlertController, 
    private toastController: ToastController, 
    private bts : BluetoothService, 
    private gameService: GameService,
    private firebaseService: FirebaseService,
    private workerService: WorkerService
  ) {}

  async ngOnInit() {
    try{
      this.firebaseService.changedAuth.subscribe(() =>{
        this.loadData();
      })
      this.workerService.activeGame.subscribe((data: any)=>{
        this.gameData = data;
      })  
      this.workerService.playerData.subscribe((data: any)=>{
        this.playerData = data;
        if(this.user.totalScore) this.user.totalScore += this.playerData.changeScore;
      })  
      this.loadData();
      
    }catch(e){
      console.log(e);
    }
  }

  loadData(){
    let uid = localStorage.getItem('uid');
      firstValueFrom(this.firebaseService.getDetails(uid)).then((data) =>{
        this.user = data.data();
        console.log(this.user, localStorage.getItem("uid"));
      });
    
  }
    
  //   try{
  //     this.bts.startDeviceScan().then(data=>{
  //       this.scanResults = data;
  //     });
  //   }catch(e){
  //     this.info = e;
  //   }

  // }

  // refreshBluetooth(){
  //   this.devices = [];
  //   this.scanResults = null;
  //   this.bts.startDeviceScan().then(data=>{
  //     this.scanResults = data;
  //   });
  // }
  // handleRefresh(event: any) {
  //   setTimeout(() => {
  //     this.refreshBluetooth();
  //     event.target.complete();
  //   }, 2000);
  // }


  // connectToDevice(device: BleDevice) {
  //   this.info = `Connecting to ${device.name}`;
  //   this.bts.connectToDevice(device).then(async (data) => {
  //     this.info = `Connected to ${device.name}`;
  //     const alert = await this.alertController.create({
  //       header: 'Connected',
  //       message: `Connected to ${device.name}`,
  //       buttons: ['OK']
  //     });
  //     await alert.present();
  //   }).catch(async (e) => {
  //     this.info = e;
  //     const alert = await this.alertController.create({
  //       header: 'Error',
  //       message: e,
  //       buttons: ['OK']
  //     });
  //     await alert.present();
  //   });
  // }
  // connectToGame(){
  //   this.gameService.connectToGame("test");
  // }

  runInBackground(){
    this.gameService.RunInBackground();
  }


  

    

}
