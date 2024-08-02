import { Injectable } from '@angular/core';
import { BleClient, BleDevice, ScanResult } from '@capacitor-community/bluetooth-le';

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
      }
    }
    return this.isIntialised;
  }



  async getConnectedDevices(): Promise<BleDevice[]> {
    this.devices = await BleClient.getConnectedDevices([]);
    console.info(`Found ${this.devices.length} connected devices`);

    return this.devices;

  }

  async startDeviceScan(): Promise<BleDevice[]> {
    this.scanResults = [];
    this.searchingDevices = true;
    await BleClient.requestLEScan({ services: [] }, (scanResult: ScanResult) => {
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

}
