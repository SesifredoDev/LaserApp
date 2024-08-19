import { Injectable } from '@angular/core';
import { BleClient, BleDevice, ScanResult, numberToUUID } from '@capacitor-community/bluetooth-le';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  list: any;
  scanResults: BleDevice[] | null = null;
  devices: BleDevice[] = [];
  bleIsEnabled = false;
  searchingDevices = false;
  isIntialised: boolean = false;
  info: any = '';

  // shotUpdate
  shotUpdate: Subject<string> = new Subject<any>();

  // Settings
  myService = numberToUUID(0x180d);
  myCharacteristic = '00002a37-0000-1000-8000-00805f9b34fb';

  isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  async initialized(): Promise<boolean> {
    if (!this.isIntialised) {
      try {
        await BleClient.initialize();
        this.isIntialised = true;
        BleClient.isEnabled().then((isEnabled) => {
          if (!isEnabled) {
            BleClient.requestEnable()
              .then((didEnable) => {
                this.getConnectedDevices();
              })
              .catch((error) => {
                console.error('Failed to enable Bluetooth', error);
              });
          } else {
            this.getConnectedDevices();
          }
        });
      } catch (e) {
        this.isIntialised = false;
        console.error('Failed to initialize Bluetooth', e);
      }
    }
    return this.isIntialised;
  }

  async getConnectedDevices() {
    try {
      // Attempt to reconnect to the last known device
      const lastDeviceId = localStorage.getItem('bleDeviceId');
      if (lastDeviceId) {
        const devices = await BleClient.getConnectedDevices([this.myService]);
        const lastDevice = devices.find((device) => device.deviceId === lastDeviceId);

        if (lastDevice) {
          console.info(`Reconnecting to last known device: ${lastDevice.name}`);
          await this.connectToDevice(lastDevice);
          return;
        }
      }

      // If not connected, scan for devices
      this.devices = await BleClient.getConnectedDevices([this.myService]);
      console.info(`Found ${this.devices.length} connected devices`);
      if (this.devices.length > 0) {
        // Automatically connect to the first available device
        await this.connectToDevice(this.devices[0]);
      } else {
        console.info('No devices found during initial scan, starting full scan.');
        await this.startDeviceScan();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async startDeviceScan(): Promise<BleDevice[]> {
    this.scanResults = [];
    this.searchingDevices = true;

    await BleClient.requestLEScan({ services: [this.myService] }, async (scanResult: ScanResult) => {
      const foundDevice = scanResult.device;
      foundDevice.name = scanResult.localName || foundDevice.name;
      console.log(`New device found: ${foundDevice.name}`);
      this.scanResults?.push(foundDevice);

      // Attempt to auto-connect to the last known device during the scan
      const lastDeviceId = localStorage.getItem('bleDeviceId');
      if (lastDeviceId && foundDevice.deviceId === lastDeviceId) {
        console.info(`Auto-connecting to last known device: ${foundDevice.name}`);
        await this.connectToDevice(foundDevice);
        BleClient.stopLEScan();
      }
    });

    setTimeout(async () => {
      await BleClient.stopLEScan();
      this.searchingDevices = false;

      // If no last known device, connect to the first available device
      if (this.scanResults?.length && !this.isConnected.getValue()) {
        await this.connectToDevice(this.scanResults[0]);
      }
    }, 30000);

    return this.scanResults;
  }

  getIsConnected() {
    return this.isConnected;
  }

  async onDisconnect(deviceId: any) {
    console.log(`Device ${deviceId} disconnected`);
    let connectedDevices = await BleClient.getConnectedDevices([this.myService]);

    if (connectedDevices.length === 0) {
      this.isConnected.next(false);
    }
  }

  async onConnect(device: BleDevice) {
    localStorage.setItem('bleDeviceId', device.deviceId);
    this.isConnected.next(true);

    await BleClient.startNotifications(device.deviceId, this.myService, this.myCharacteristic, (value: any) => {
      console.log('Notification as string:', value.buffer);
      const dataView = new DataView(value.buffer);

      const textDecoder = new TextDecoder('utf-8');
      const stringValue = textDecoder.decode(value);

      this.shotUpdate.next(stringValue);
    });
  }

  async connectToDevice(device: BleDevice) {
    try {
      await BleClient.connect(device.deviceId, (data) => this.onDisconnect(data));
      await this.onConnect(device);
    } catch (e) {
      console.error('Failed to connect to device', e);
      this.isConnected.next(false);
    }
  }
}