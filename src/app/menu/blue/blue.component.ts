import { Component, OnInit } from '@angular/core';
import { BleDevice } from '@capacitor-community/bluetooth-le';
import { BluetoothService } from 'src/app/shared/services';

@Component({
  selector: 'app-blue',
  templateUrl: './blue.component.html',
  styleUrls: ['./blue.component.scss'],
})
export class BlueComponent implements OnInit {
  connectedDevice: BleDevice | null = null;
  devices: BleDevice[] = [];
  isConnected: boolean = false;

  constructor(private bluetoothService: BluetoothService) {}

  ngOnInit() {
    // Initialize Bluetooth Service
    this.bluetoothService.initialized().then((isInitialized) => {
      if (isInitialized) {
        this.scanForDevices();
        this.bluetoothService.getIsConnected().subscribe((isConnected) => {
          this.isConnected = isConnected;
          if (!isConnected) {
            this.connectedDevice = null;
          }
        });
      }
    });
  }

  async scanForDevices() {
    try {
      this.devices = await this.bluetoothService.startDeviceScan();
    } catch (error) {
      console.error('Error scanning for devices', error);
    }
  }

  async connect(device: BleDevice) {
    try {
      await this.bluetoothService.connectToDevice(device);
      this.connectedDevice = device;
    } catch (error) {
      console.error('Error connecting to device', error);
    }
  }
}
