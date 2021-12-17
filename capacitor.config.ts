import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'my-recipes',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'http',
    allowNavigation: [
      '192.168.1.3:4000'
    ]
  }
};

export default config;
