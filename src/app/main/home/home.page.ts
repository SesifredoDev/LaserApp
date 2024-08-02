import { Component, OnInit } from '@angular/core';
import { BleClient, BleDevice, ScanResult} from '@capacitor-community/bluetooth-le';
import { AlertController, ToastController } from '@ionic/angular';
import { BluetoothService } from '../../shared/services/bluetooth.service';
import { WorkerService } from '../../shared/services/worker.service';

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

  constructor(
    private alertController: AlertController, 
    private toastController: ToastController, 
    private bts : BluetoothService, 
    private sockerService: WorkerService ) {}

  async ngOnInit() {
    this.sockerService.socketConnect()
    if(!this.bts.isIntialised){
      await this.bts.initialized();
    }

    try{
      this.bts.startDeviceScan().then(data=>{
        this.scanResults = data;
      });
    }catch(e){
      this.info = e;
    }

  }

  sendGotShot() {
    // this.info= this.sockerService.socketConnect();
    this.info = this.sockerService.sendGotShot();
  }

    

}
