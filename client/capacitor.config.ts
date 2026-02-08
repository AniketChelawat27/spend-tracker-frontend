import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.spendtracker.app',
  appName: 'Spend Tracker',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
  server: {
    // For live reload during dev: uncomment and set to your machine's IP
    // url: 'http://192.168.x.x:5173',
    // cleartext: true,
  },
};

export default config;
