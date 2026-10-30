import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.natadata.app',
  appName: 'NataData',
  webDir: 'www',
  android: {
    allowMixedContent: false
  }
};

export default config;
