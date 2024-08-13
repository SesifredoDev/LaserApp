import { Injectable } from '@angular/core';
import { BleClient, BleDevice, ScanResult , numberToUUID } from '@capacitor-community/bluetooth-le';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  list: any;
  scanResults: BleDevice[] | null = null;
  devices: BleDevice[] = [];
  bleIsEnabled = false;
  searchingDevices = false;
  isIntialised: boolean = false;
  info: any = "";

  // shotUpdate

  shotUpdate: Subject<string> = new Subject<any>();


  // Settings
  myService = numberToUUID(0x180d);
  myCharacteristic = '00002a37-0000-1000-8000-00805f9b34fb';

  isConnected: Subject<boolean> = new Subject<boolean>();

  constructor() { }
  async initialized(): Promise<boolean> {
    if (!this.isIntialised) {

      try {
        await BleClient.initialize();
        this.isIntialised = true

        BleClient.enable();
        this.getConnectedDevices();

      } catch (e) {
        this.isIntialised = false;
        console.error('Failed to initialize Bluetooth', e);
      }
    }
    return this.isIntialised;
  }



  async getConnectedDevices() {
    
    try{
    this.devices = await BleClient.getConnectedDevices([this.myService]);
    console.log(this.devices)
    console.info(`Found ${this.devices.length} connected devices`);
    for (const device of this.devices) {
      this.connectToDevice(device);
    }
    if(this.devices.length == 0){
        let deviceId = localStorage.getItem('bleDeviceId');
        console.log('deviceId:', deviceId);
        if(deviceId){
          this.connectToDevice({deviceId: deviceId});
        }else{
          throw new Error('No connected devices found');
        }
      }
    }catch(e){
      console.error(e);
    }
  }

  async startDeviceScan(): Promise<BleDevice[]> {
    this.scanResults = [];
    this.searchingDevices = true;
    await BleClient.requestLEScan({ services: [this.myService] }, (scanResult: ScanResult) => {
      const foundDevice = scanResult.device;
      foundDevice.name = scanResult.localName || foundDevice.name;
      console.log(`New device found: ${foundDevice.name}`);
      this.scanResults?.push(foundDevice);
    });

    setTimeout(async () => {
      // this.info ='Trying to stop scanning';
      await BleClient.stopLEScan();
      this.searchingDevices = false;
    }, 30000);

    return this.scanResults;
  }

  getIsConnected() {
    return this.isConnected;
  }


  async onDisconnect(deviceId: any) {
    console.log(`Device ${deviceId} disconnected`);
    let connectedDevices = await BleClient.getConnectedDevices([this.myService])

    if(connectedDevices.length === 0){
      this.isConnected.next(false);

    }
  }

  async onConnect(device: BleDevice){
    localStorage.setItem('bleDeviceId', device.deviceId);
    this.isConnected.next(true);
    // BleClient.createBond(device.deviceId);
    await BleClient.startNotifications(
      device.deviceId,
      this.myService,
      this.myCharacteristic,
      (value :any) => {
        
        console.log('Notification as string:', value.buffer);
        const dataView = new DataView(value.buffer);
        
        const textDecoder = new TextDecoder('utf-8');
        const stringValue = textDecoder.decode(value);
        
        this.shotUpdate.next(stringValue);

      });
  }

  async connectToDevice(device: BleDevice) {
    BleClient.connect(device.deviceId,
      (data) => this.onDisconnect(data)
    )
    .then(() => this.onConnect(device))
  

}
}
