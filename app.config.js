import 'dotenv/config';

const IS_PROD = process.env.APP_VARIANT === 'production';

export default ({ config }) => ({
  ...config,
  name: IS_PROD ? "AtlanticApp" : "AtlanticApp (Test)",
  slug: "AtlanticApp",
  version: "2.1.3",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: false,
  entryPoint:"./index.js",

  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_PROD ? "fr.resel.bds.brest.atlanticapp" : "fr.resel.bds.brest.atlanticapp.test",
    googleServicesFile: IS_PROD ? "./firebase-config/prod/GoogleService-Info.plist" : "./firebase-config/test/GoogleService-Info.plist",
    entitlements: {
      "aps-environment": "production"
    },
    infoPlist: {
      UIBackgroundModes: ["remote-notification"]
    }
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#ffffff"
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    package: IS_PROD ? "fr.resel.bds.brest.atlanticapp" : "fr.resel.bds.brest.atlanticapp.test",
    googleServicesFile: IS_PROD ? "./firebase-config/prod/google-services.json" : "./firebase-config/test/google-services.json"
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      }
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          buildReactNativeFromSource: true
        }
      }
    ],
    '@react-native-firebase/app',
    '@react-native-firebase/messaging'
  ],

  router: {
    lazyLoading: false
  },

  experiments: {
    typedRoutes: true
  },

  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: "b09fc55c-54fd-4fda-877c-d1681b72180e"
    },
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  }
});