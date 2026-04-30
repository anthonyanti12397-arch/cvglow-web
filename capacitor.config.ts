import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cvglow.app',
  appName: 'CVGlow',
  webDir: 'out',
  server: {
    // Points to live Vercel — swap to local build for App Store submission
    url: 'https://cvglow-web.vercel.app',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
  },
};

export default config;
