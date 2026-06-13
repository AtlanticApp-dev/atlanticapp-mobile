# 🛠️ Setup et Développement Local - AtlanticApp

> *Guide complet pour configurer votre environnement de développement et lancer le projet localement.*

---

## 📖 **Sommaire**

1. [Prérequis](#-prérequis)
2. [Installation du Projet](#-installation-du-projet)
3. [Configuration Firebase](#-configuration-firebase)
4. [Lancement du Projet](#-lancement-du-projet)
5. [Outils de Développement](#-outils-de-développement)
6. [Débogage](#-débogage)
7. [Build et Déploiement](#-build-et-déploiement)
8. [Configuration Multi-Environnement](#-configuration-multi-environnement)

---

**[← Retour à l'accueil](./Home.md) | [Frontend React Native ←](./Frontend-React-Native.md) | [Contribution →](./Contribution.md)**

---

## 📋 **Prérequis**

### 💻 **Environnement de Développement**

| Outil | Version Requise | Lien | Description |
|-------|-----------------|------|-------------|
| **Node.js** | ≥ 18.0.0 | [nodejs.org](https://nodejs.org/) | Runtime JavaScript |
| **npm** ou **yarn** | ≥ 8.0.0 | Inclus avec Node.js | Gestionnaire de paquets |
| **Git** | - | [git-scm.com](https://git-scm.com/) | Contrôle de version |
| **Expo CLI** | ~55.0.15 | [docs.expo.dev](https://docs.expo.dev/) | Outil en ligne de commande Expo |

### 📱 **Outils Spécifiques aux Plateformes**

#### **Android**

| Outil | Version | Lien | Description |
|-------|---------|------|-------------|
| **Android Studio** | Latest | [developer.android.com](https://developer.android.com/studio) | IDE Android |
| **Java JDK** | 11 ou 17 | [oracle.com](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) | Kit de développement Java |
| **Android SDK** | API 33+ | - | SDK Android |
| **Android Emulator** | - | - | Émulateur Android |

**⚠️ Configuration Android** :
1. Installez **Android Studio**
2. Ouvrez **SDK Manager** (Tools → SDK Manager)
3. Installez :
   - Android SDK Platform (API 33 ou supérieur)
   - Android SDK Command-line Tools
   - Android Emulator
   - Android Virtual Device (AVD) pour les émulateurs

#### **iOS (macOS uniquement)**

| Outil | Version | Lien | Description |
|-------|---------|------|-------------|
| **Xcode** | ≥ 14.0 | Mac App Store | IDE iOS |
| **Command Line Tools** | - | - | Outils en ligne de commande |
| **CocoaPods** | ≥ 1.11.0 | [cocoapods.org](https://cocoapods.org/) | Gestionnaire de dépendances iOS |

**⚠️ Configuration iOS** :
1. Installez **Xcode** depuis le Mac App Store
2. Ouvrez Xcode et acceptez les licences
3. Installez CocoaPods :
   ```bash
   sudo gem install cocoapods
   ```

### 🔥 **Compte Firebase**

> *Vous avez besoin d'un compte Firebase pour accéder aux projets de test et de production.*

1. **Créez un compte Google** si vous n'en avez pas : [accounts.google.com](https://accounts.google.com/)
2. **Accédez à Firebase** : [console.firebase.google.com](https://console.firebase.google.com/)
3. **Demandez l'accès** au projet AtlanticApp :
   - Contactez l'administrateur du projet (victor.aribaud@imt-atlantique.net)
   - ou créez votre propre projet Firebase pour le développement local

---

## 🚀 **Installation du Projet**

### 📥 **Cloner le Repository**

```bash
# 1. Cloner le dépôt
cd /chemin/vers/vos/projets
git clone https://github.com/AtlanticApp-dev/Collab-AtlanticApp-mobile.git

# 2. Aller dans le dossier du projet
cd Collab-AtlanticApp-mobile

# 3. Créer une nouvelle branche (recommandé)
git checkout -b dev/nom-de-votre-branche
```

**✅ Résultat** : Vous avez maintenant une copie locale du projet.

### 📦 **Installer les Dépendances**

```bash
# Avec npm (recommandé)
npm install

# Ou avec yarn
yarn install
```

**⚠️ Note** : Cela installera toutes les dépendances listées dans `package.json`. Cela peut prendre quelques minutes.

**✅ Résultat** : Toutes les dépendances sont installées dans `node_modules/`.

### 🔄 **Installer les Pods iOS (si vous développez pour iOS)**

```bash
# Aller dans le dossier ios
cd ios

# Installer les pods
pod install

# Retour à la racine
cd ..
```

---

## 🔥 **Configuration Firebase**

> *AtlanticApp utilise Firebase pour le backend. Vous devez configurer Firebase pour votre environnement local.*

### 📁 **Structure des Projets Firebase**

Le projet utilise **plusieurs projets Firebase** :
- **Production** : Pour l'application en production
- **Test** : Pour le développement et les tests

### 🔧 **Configuration via `app.config.js`**

Le fichier `app.config.js` à la racine du projet contient la configuration Firebase :

```javascript
// app.config.js
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export default {
  expo: {
    name: 'AtlanticApp',
    slug: 'atlanticapp',
    // ...
    extra: {
      firebase: firebaseConfig,
    },
  },
};
```

### 🌍 **Variables d'Environnement**

Créez un fichier `.env` à la racine du projet (ne pas commiter ce fichier !) :

```bash
# .env
REACT_APP_APP_VARIANT=test
REACT_APP_FIREBASE_API_KEY=votre_api_key_ici
REACT_APP_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=votre-projet-id
REACT_APP_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=votre-sender-id
REACT_APP_FIREBASE_APP_ID=1:votre-app-id:web:votre-app-id
```

**⚠️ IMPORTANT** :
- Ne **comitez jamais** le fichier `.env`
- Le fichier `.env` est dans `.gitignore`
- Demandez les valeurs à l'administrateur du projet

### 📁 **Fichier `firebase-config/index.ts`**

Ce fichier contient la configuration pour les différents environnements :

```typescript
// firebase-config/index.ts
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID } from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY || 'default-api-key',
  authDomain: FIREBASE_AUTH_DOMAIN || 'default.auth.domain',
  projectId: FIREBASE_PROJECT_ID || 'default-project-id',
  // ...
};

export default firebaseConfig;
```

### 📱 **Configuration Spécifique par Plateforme**

#### **Android**

1. **Fichier `android/app/google-services.json`** :
   - Ce fichier doit être placé dans `android/app/`
   - Demandez-le à l'administrateur ou téléchargez-le depuis la console Firebase
   - **Ne pas commiter** ce fichier

2. **Vérifier `android/build.gradle`** :
   ```gradle
   buildscript {
     ext {
       firebaseVersion = '32.7.0'  // Version à jour
     }
   }
   ```

3. **Vérifier `android/app/build.gradle`** :
   ```gradle
   dependencies {
     implementation platform('com.google.firebase:firebase-bom:32.7.0')
     implementation 'com.google.firebase:firebase-analytics'
     implementation 'com.google.firebase:firebase-firestore'
     implementation 'com.google.firebase:firebase-auth'
     implementation 'com.google.firebase:firebase-messaging'
   }
   ```

#### **iOS**

1. **Fichier `ios/GoogleService-Info.plist`** :
   - Ce fichier doit être placé dans `ios/`
   - Demandez-le à l'administrateur ou téléchargez-le depuis la console Firebase
   - **Ne pas commiter** ce fichier

2. **Vérifier `ios/Podfile`** :
   ```ruby
   # Required by Firebase
   pod 'Firebase', '~> 10.0'
   pod 'FirebaseCore', '~> 10.0'
   pod 'FirebaseFirestore', '~> 10.0'
   pod 'FirebaseAuth', '~> 10.0'
   pod 'FirebaseMessaging', '~> 10.0'
   ```

3. **Installer les pods après modification** :
   ```bash
   cd ios
   pod install
   cd ..
   ```

---

## 🚀 **Lancement du Projet**

### 🌐 **Démarrer le Serveur de Développement**

```bash
# Démarrer avec Expo
npx expo start --clear
```

**Options utiles** :
- `--clear` : Efface le cache (utile si vous avez des problèmes)
- `--port 19000` : Spécifie un port différent
- `--offline` : Mode hors ligne (ne vérifie pas les mises à jour)

**✅ Résultat** : Un serveur de développement démarrera et ouvrira une page dans votre navigateur.

### 📱 **Exécuter sur un Appareil ou Émulateur**

#### **Sur Android**

**Option 1 : Sur un émulateur**
```bash
# Démarrer un émulateur Android
npx expo start --android

# Ou démarrer le serveur puis lancer l'émulateur séparément
npx expo start
# Dans un autre terminal
npx expo run:android
```

**Option 2 : Sur un appareil physique**
1. Activez le **mode développeur** sur votre appareil
2. Activez **USB Debugging** dans les options développeur
3. Connectez votre appareil via USB
4. Exécutez :
   ```bash
   npx expo run:android
   ```

**Option 3 : Via l'application Expo Go**
1. Installez **Expo Go** depuis le Play Store
2. Scannez le QR code affiché dans le terminal ou la page web

#### **Sur iOS**

**Option 1 : Sur simulateur iOS**
```bash
# Démarrer le simulateur iOS
npx expo start --ios

# Ou
npx expo run:ios
```

**Option 2 : Sur un appareil physique**
1. Installez **Expo Go** depuis l'App Store
2. Connectez votre iPhone via USB ou utilisez le même réseau WiFi
3. Scannez le QR code affiché dans le terminal ou la page web

### 🌍 **Exécuter dans le Navigateur (Web)**

```bash
# Démarrer en mode web
npx expo start --web
```

> *⚠️ Note : Certaines fonctionnalités native (comme Firebase Messaging) peuvent ne pas fonctionner en mode web.*

---

## 🛠️ **Outils de Développement**

### 🔍 **Débogage et Inspection**

| Outil | Installation | Utilisation |
|-------|-------------|-------------|
| **React DevTools** | `npm install -g react-devtools` | [Extension navigateur](https://react.dev/learn/react-developer-tools) |
| **Flipper** | [flipperzero.com](https://fbflipper.com/) | `npm install --save-dev flipper` |
| **React Native Debugger** | `npm install -g react-native-debugger` | Application standalone |

#### **React DevTools**

1. Installez l'extension navigateur :
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

2. **Pour React Native avec Expo** :
   ```bash
   npm install --save-dev react-devtools-core
   ```

3. **Connecter au serveur** :
   - Dans votre app, secouez le téléphone ou appuyez sur `⌘ + D` (iOS) / `Ctrl + M` (Android)
   - Sélectionnez **Debug Remote JS**

#### **Flipper**

1. Installez Flipper :
   ```bash
   # macOS
   brew install flipper
   
   # Windows/Linux
   Voir https://fbflipper.com/docs/features/installed-apps/
   ```

2. Démarrez Flipper :
   ```bash
   flipper
   ```

3. Activez Flipper dans votre app :
   - Secouez le téléphone ou appuyez sur `⌘ + D` (iOS) / `Ctrl + M` (Android)
   - Sélectionnez **Flipper**

**Fonctionnalités utiles de Flipper** :
- Inspection du réseau (requêtes HTTP)
- Stockage local (AsyncStorage)
- Logs
- Layout
- Performance

### 📊 **Outils de Monitoring**

| Outil | Description | Lien |
|-------|-------------|------|
| **Firebase Console** | Monitoring du backend | [console.firebase.google.com](https://console.firebase.google.com/) |
| **Expo Dashboard** | Monitoring des builds | [expo.dev](https://expo.dev/) |

---

## 🐛 **Débogage**

### 📝 **Logs et Console**

#### **Afficher des logs**

```typescript
// Utilisez console.log pour afficher des messages
console.log('Message de log');

// Pour afficher des objets
console.log('Utilisateur:', user);

// Pour afficher avec style
console.log('%c message stylisé', 'color: blue; font-weight: bold;');
```

#### **Logs Firestore**

```typescript
import { enableFirestoreLogging } from '@react-native-firebase/firestore';

// Activez les logs Firestore (développement uniquement)
if (__DEV__) {
  enableFirestoreLogging();
}
```

#### **Logs FCM**

```typescript
import messaging from '@react-native-firebase/messaging';

// Écoutez les messages en avant-plan
messaging().onMessage((remoteMessage) => {
  console.log('Notification reçue:', JSON.stringify(remoteMessage, null, 2));
});
```

### ⚠️ **Problèmes Courants et Solutions**

#### **1. Erreur : "Unable to resolve module"**

```bash
# Solution : Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

#### **2. Erreur : "Firebase app not initialized"**

```bash
# Vérifiez que :
# 1. Le fichier .env est présent avec les bonnes valeurs
# 2. Les fichiers google-services.json et GoogleService-Info.plist sont en place
# 3. Vous avez redémarré l'application
```

#### **3. Erreur : "No emulator found"**

```bash
# Lister les émulateurs disponibles
emulator -list-avds

# Créer un nouvel émulateur via Android Studio
# ou utiliser un appareil physique
```

#### **4. Erreur : "iOS simulator not found"**

```bash
# Lister les simulateurs iOS disponibles
xcrun simctl list

# Créer un nouveau simulateur via Xcode
# (Xcode → Preferences → Locations → Command Line Tools)
```

#### **5. Problème : L'application ne se recharge pas**

```bash
# Forcer le rafraîchissement
npx expo start --clear --reset-cache
```

#### **6. Problème : Les modifications ne sont pas prises en compte**

```bash
# Vérifiez que vous êtes sur la bonne branche
# et que les fichiers sont bien enregistrés

# Redémarrez le bundle
npx expo start --clear
```

#### **7. Erreur : "Missing GoogleService-Info.plist" (iOS)**

```bash
# Vérifiez que le fichier existe dans ios/
# Si non, téléchargez-le depuis la console Firebase
# ou demandez-le à l'administrateur
```

#### **8. Erreur : "Missing google-services.json" (Android)**

```bash
# Vérifiez que le fichier existe dans android/app/
# Si non, téléchargez-le depuis la console Firebase
# ou demandez-le à l'administrateur
```

### 🛠️ **Mode Développement vs Production**

| Environnement | Commande | Comportement |
|---------------|----------|--------------|
| **Développement** | `npx expo start` | Hot reload, source maps, debug |
| **Test** | `APP_VARIANT=test npx expo start` | Connexion au projet Firebase test |
| **Production** | `APP_VARIANT=production npx expo start` | Connexion au projet Firebase production |

**⚠️ Attention** :
- Ne jamais utiliser la configuration de **production** en développement local
- Toujours tester avec la configuration **test** avant de déployer

---

## 🏗️ **Build et Déploiement**

### 📦 **Build Local (APK/IPA)**

#### **Android**

**Build APK de debug** :
```bash
# Build APK pour le test local
npx expo run:android

# Build APK avec variante test
APP_VARIANT=test npx expo run:android
```

**Build APK de production** :
```bash
# Build via Expo
npx expo build:android --release-channel production

# Ou build local (nécessite Android Studio)
APP_VARIANT=production npx expo run:android --no-install
```

#### **iOS**

**Build Simulator** :
```bash
npx expo run:ios
```

**Build IPA de production** :
```bash
# Build via Expo
npx expo build:ios --release-channel production

# Ou build local (nécessite Xcode)
APP_VARIANT=production npx expo run:ios --no-install
```

### ☁️ **Build via Expo (EAS)**

> *Expo Application Services (EAS) permet de builder votre app dans le cloud.*

#### **1. Configurer EAS**

```bash
# Se connecter à Expo
npx expo login

# Initialiser EAS
npx eas build:init
```

#### **2. Configurer `eas.json`**

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "distribution": "store",
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "simulator": false
      }
    }
  }
}
```

#### **3. Builder avec EAS**

```bash
# Build Android (development)
npx eas build --platform android --profile development

# Build iOS (development)
npx eas build --platform ios --profile development

# Build pour production
npx eas build --platform all --profile production
```

#### **4. Télécharger le Build**

```bash
# Lister les builds
npx eas build:list

# Télécharger un build spécifique
npx eas build:download --id BUILD_ID
```

### 🚀 **Déploiement sur les Stores**

#### **Android (Google Play Store)**

1. **Créer un App Bundle** :
   ```bash
   npx eas build --platform android --profile production
   ```

2. **Télécharger le .aab** :
   ```bash
   npx eas build:download --id BUILD_ID
   ```

3. **Upload sur Google Play Console** :
   - Allez sur [play.google.com/console](https://play.google.com/console/)
   - Sélectionnez votre app
   - Allez dans **Production** → **Créer une nouvelle version**
   - Upload le fichier `.aab`

#### **iOS (App Store)**

1. **Créer un Archive IPA** :
   ```bash
   npx eas build --platform ios --profile production
   ```

2. **Télécharger le .ipa** :
   ```bash
   npx eas build:download --id BUILD_ID
   ```

3. **Upload via Transporter** :
   - Utilisez l'application **Transporter** de Apple
   - ou upload via Xcode → Organizer

---

## 🌍 **Configuration Multi-Environnement**

> *AtlanticApp supporte plusieurs environnements : test et production.*

### 📁 **Structure des Environnements**

```
project/
├── .env                    # Variables locales (ne pas commiter)
├── firebase-config/
│   ├── test.ts            # Configuration Firebase test
│   └── production.ts      # Configuration Firebase production
└── app.config.js          # Configuration Expo avec variables d'environnement
```

### 🔧 **Changer d'Environnement**

#### **En Développement Local**

```bash
# Utiliser l'environnement test (recommandé pour le développement)
APP_VARIANT=test npx expo start --clear

# Utiliser l'environnement production (à éviter en développement)
APP_VARIANT=production npx expo start --clear
```

#### **Dans le Code**

```typescript
// Lire la variable d'environnement
const appVariant = process.env.REACT_APP_APP_VARIANT || 'test';

// Importer la configuration appropriée
import firebaseConfig from `@/firebase-config/${appVariant}`;

// Ou utiliser des conditions
if (appVariant === 'test') {
  // Configuration test
} else if (appVariant === 'production') {
  // Configuration production
}
```

### 📦 **Configuration Firebase par Environnement**

```typescript
// firebase-config/test.ts
export default {
  apiKey: 'API_KEY_TEST',
  authDomain: 'PROJET_TEST.firebaseapp.com',
  projectId: 'PROJET_TEST',
  storageBucket: 'PROJET_TEST.appspot.com',
  messagingSenderId: 'SENDER_ID_TEST',
  appId: 'APP_ID_TEST',
};

// firebase-config/production.ts
export default {
  apiKey: 'API_KEY_PRODUCTION',
  authDomain: 'PROJET_PRODUCTION.firebaseapp.com',
  projectId: 'PROJET_PRODUCTION',
  storageBucket: 'PROJET_PRODUCTION.appspot.com',
  messagingSenderId: 'SENDER_ID_PRODUCTION',
  appId: 'APP_ID_PRODUCTION',
};
```

### ⚠️ **Bonnes Pratiques**

1. **Toujours utiliser `test` en développement local**
2. **Ne jamais commiter les clés de production**
3. **Utiliser des variables d'environnement** pour tout ce qui est sensible
4. **Vérifier les permissions Firebase** avant de switcher d'environnement

---

## 📚 **Ressources Utiles**

### 📖 **Documentations**

- [Expo Documentation](https://docs.expo.dev/)
- [Expo EAS Build](https://docs.expo.dev/eas/)
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Flipper Documentation](https://fbflipper.com/docs/)

### 🎥 **Tutoriels**

- [Expo Setup Guide](https://docs.expo.dev/get-started/installation/)
- [Expo EAS Build Guide](https://docs.expo.dev/eas/get-started/)
- [React Native Debugging Guide](https://reactnative.dev/docs/debugging)
- [Firebase Local Emulator](https://firebase.google.com/docs/emulator-suite)

### 🛠️ **Outils Recommandés**

- **Éditeur de code** : [VS Code](https://code.visualstudio.com/) avec l'extension React Native Tools
- **Émulateurs** : Android Studio Emulator ou Xcode Simulator
- **Test sur appareils** : Expo Go pour le développement rapide

---

## 🔄 **Navigation**

```
┌─────────────────────────────────────────────────────────────┐
│                   SETUP & DÉVELOPPEMENT LOCAL                     │
├─────────────────────────────────────────────────────────────┤
│  [Prérequis]  │  [Installation]  │  [Firebase]  │  [Lancement]     │
├─────────────────────────────────────────────────────────────┤
│  [Outils]  │  [Débogage]  │  [Build]  │  [Environnements]      │
└─────────────────────────────────────────────────────────────┘
```

**[← Retour à l'accueil](./Home.md) | [Frontend React Native ←](./Frontend-React-Native.md) | [Contribution →](./Contribution.md)**

---

*Dernière mise à jour : 13 juin 2026*
