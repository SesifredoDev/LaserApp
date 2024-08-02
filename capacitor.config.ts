import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pchaffey.queenlaser',
  appName: 'Queen Laser',
  webDir: 'www',
  server:{
    
    androidScheme: 'http',
  },
  plugins: {
    "plugins": {
    "BluetoothLe": {
      "displayStrings": {
        "scanning": "Scanning...",
        "cancel": "Cancel",
        "availableDevices": "Available devices",
        "noDeviceFound": "No device found"
      }
    },
    "FirebaseAuthentication": {
      "skipNativeAuth": false,
      "providers": [
        "apple.com",
        "facebook.com",
        "github.com",
        "google.com",
        "microsoft.com",
        "playgames.google.com",
        "twitter.com",
        "yahoo.com",
        "phone"
      ]
    }
  }
},
};

export default config;
