# ❓ FAQ / Dépannage - AtlanticApp

> *Réponses aux questions courantes, solutions aux problèmes courants, et astuces pour les développeurs.*

---

## 📖 **Sommaire**

1. [Problèmes de Setup](#-problèmes-de-setup)
2. [Problèmes Firebase](#-problèmes-firebase)
3. [Problèmes de Développement](#-problèmes-de-développement)
4. [Problèmes Spécifiques à Android](#-problèmes-spécifiques-à-android)
5. [Problèmes Spécifiques à iOS](#-problèmes-spécifiques-à-ios)
6. [Problèmes de Fonctionnalités](#-problèmes-de-fonctionnalités)
7. [Questions sur le Code](#-questions-sur-le-code)
8. [Où Poser des Questions ?](#-où-poser-des-questions)

---

**[← Retour à l'accueil](./Home.md) | [Contribution ←](./Contribution.md) | [Ressources →](./Resources.md)**

---

## 🛠️ **Problèmes de Setup**

### 🔥 **"Erreur : Unable to resolve module"**

#### **Symptômes** :
```
Error: Unable to resolve module @react-native-firebase/firestore
```

#### **Solutions** :
1. **Réinstaller les dépendances** :
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Vérifier le cache npm** :
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Si vous utilisez Yarn** :
   ```bash
   yarn cache clean
   rm -rf node_modules yarn.lock
   yarn install
   ```

4. **Vérifier les versions** :
   - Assurez-vous que Node.js ≥ 18.0.0
   - Assurez-vous que npm ≥ 8.0.0

---

### 📱 **"Erreur : No emulator found / No simulator found"**

#### **Sur Android** :

**Symptômes** :
```
Error: No emulator found. Please start an emulator or connect a device.
```

**Solutions** :
1. **Lister les émulateurs** :
   ```bash
   emulator -list-avds
   ```

2. **Démarrer un émulateur** :
   ```bash
   # Lister les AVD disponibles
   emulator -list-avds
   
   # Démarrer un émulateur spécifique
   emulator -avd Pixel_6_API_33
   ```

3. **Créer un nouvel émulateur** :
   - Ouvrez **Android Studio**
   - Allez dans **AVD Manager** (Tools → Device Manager)
   - Cliquez sur **Create Virtual Device**
   - Sélectionnez un appareil et une version d'Android
   - Téléchargez l'image système si nécessaire
   - Créez l'AVD et démarrez-le

4. **Utiliser un appareil physique** :
   - Activez le **mode développeur**
   - Activez **USB Debugging**
   - Connectez votre appareil via USB
   - Exécutez :
     ```bash
     adb devices  # Vérifier que l'appareil est détecté
     npx expo run:android
     ```

#### **Sur iOS** :

**Symptômes** :
```
Error: No simulator found. Please install Xcode and a simulator.
```

**Solutions** :
1. **Vérifier que Xcode est installé** :
   ```bash
   xcode-select --install
   ```

2. **Lister les simulateurs** :
   ```bash
   xcrun simctl list
   ```

3. **Créer un simulateur** :
   - Ouvrez **Xcode**
   - Allez dans **Xcode → Preferences → Locations**
   - Vérifiez que **Command Line Tools** pointe vers Xcode
   - Ouvrez **Window → Devices and Simulators**
   - Créez un nouveau simulateur

4. **Démarrer le simulateur** :
   ```bash
   open -a Simulator
   ```

---

### 🔐 **"Erreur : Firebase app not initialized"**

#### **Symptômes** :
```
Error: Firebase app not initialized
```

#### **Solutions** :
1. **Vérifier le fichier `.env`** :
   - Assurez-vous que le fichier `.env` existe à la racine
   - Vérifiez que toutes les variables sont présentes :
     ```
     REACT_APP_FIREBASE_API_KEY
     REACT_APP_FIREBASE_AUTH_DOMAIN
     REACT_APP_FIREBASE_PROJECT_ID
     REACT_APP_FIREBASE_STORAGE_BUCKET
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID
     REACT_APP_FIREBASE_APP_ID
     ```

2. **Vérifier les fichiers de configuration plateforme** :
   - **Android** : `android/app/google-services.json` doit exister
   - **iOS** : `ios/GoogleService-Info.plist` doit exister

3. **Redémarrer l'application** :
   ```bash
   npx expo start --clear
   ```

4. **Vérifier l'initialisation Firebase** :
   - Dans `app/_layout.tsx` ou le composant racine, vérifiez que Firebase est bien initialisé
   - Vérifiez que vous utilisez le bon projet (test vs production)

---

### 📦 **"Erreur : Missing GoogleService-Info.plist / google-services.json"**

#### **Sur iOS** :

**Symptômes** :
```
Error: Missing GoogleService-Info.plist
```

**Solutions** :
1. **Télécharger le fichier** :
   - Allez dans la [console Firebase](https://console.firebase.google.com/)
   - Sélectionnez votre projet
   - Cliquez sur l'icône ⚙️ → **Paramètres du projet**
   - Sous **Vos applications**, sélectionnez votre app iOS
   - Téléchargez **GoogleService-Info.plist**

2. **Placer le fichier** :
   - Copiez le fichier dans `ios/`
   - Ne le commitez pas (il est dans `.gitignore`)

3. **Installer les pods** :
   ```bash
   cd ios
   pod install
   cd ..
   ```

#### **Sur Android** :

**Symptômes** :
```
Error: Missing google-services.json
```

**Solutions** :
1. **Télécharger le fichier** :
   - Allez dans la [console Firebase](https://console.firebase.google.com/)
   - Sélectionnez votre projet
   - Cliquez sur l'icône ⚙️ → **Paramètres du projet**
   - Sous **Vos applications**, sélectionnez votre app Android
   - Téléchargez **google-services.json**

2. **Placer le fichier** :
   - Copiez le fichier dans `android/app/`
   - Ne le commitez pas (il est dans `.gitignore`)

---

### ⚡ **"L'application ne se recharge pas automatiquement"**

#### **Symptômes** :
- Les modifications ne sont pas visibles sans redémarrer manuellement

#### **Solutions** :
1. **Forcer le rafraîchissement** :
   ```bash
   npx expo start --clear --reset-cache
   ```

2. **Vérifier Hot Module Replacement (HMR)** :
   - Secouez votre appareil ou appuyez sur `R` dans le terminal
   - Sélectionnez **Enable Hot Reloading**

3. **Vérifier le cache Metro** :
   ```bash
   # Effacer le cache
   npx expo start -c
   
   # Ou
   rm -rf .metro/cache
   ```

4. **Redémarrer le bundle** :
   - Dans l'appareil, secouez ou appuyez sur `⌘ + D` (iOS) / `Ctrl + M` (Android)
   - Sélectionnez **Reload**

---

## 🔥 **Problèmes Firebase**

### 📁 **"Erreur : The query requires an index"**

#### **Symptômes** :
```
FirebaseError: The query requires an index that is not present
```

#### **Solution** :
1. **Cliquer sur le lien** dans le message d'erreur
2. **Créer l'index composite** dans la console Firebase :
   - Allez dans [Firestore Indexes](https://console.firebase.google.com/project/_/database/firestore/indexes)
   - Cliquez sur **Ajouter un index**
   - Configurez l'index selon les champs de votre requête
3. **Attendre que l'index soit prêt** (peut prendre quelques minutes)
4. **Redémarrer l'application**

**Exemple** :
Si vous avez cette requête :
```typescript
const q = query(
  collection(db, 'matches'),
  where('sport_id', '==', sportId),
  orderBy('start_time', 'asc'),
  limit(10)
);
```

Vous devez créer un index sur :
- Collection : `matches`
- Champs : `sport_id` (ascendant) + `start_time` (ascendant)

---

### 🔐 **"Erreur : Permission denied" (Firestore)**

#### **Symptômes** :
```
FirebaseError: Permission denied
```

#### **Solutions** :
1. **Vérifier les règles Firestore** :
   - Allez dans [Firestore Rules](https://console.firebase.google.com/project/_/database/firestore/rules)
   - Assurez-vous que les règles permettent l'accès

2. **Règles de base pour le développement** :
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   ⚠️ **Attention** : Ces règles sont **trop permissives** pour la production !

3. **Vérifier l'authentification** :
   ```typescript
   // Vérifiez que l'utilisateur est connecté
   import auth from '@react-native-firebase/auth';
   
   const user = auth().currentUser;
   if (!user) {
     console.log('Utilisateur non connecté');
   }
   ```

---

### 📬 **"Les notifications ne fonctionnent pas"**

#### **Symptômes** :
- Les notifications ne sont pas reçues
- Le token FCM n'est pas affichée dans les logs

#### **Solutions** :

1. **Vérifier les permissions** :
   - **Android** :
     ```bash
     # Vérifier dans les paramètres de l'appareil
     # Autorisations → AtlanticApp → Notifications
     ```
   - **iOS** :
     ```bash
     # Vérifier dans Réglages → Notifications → AtlanticApp
     ```

2. **Tester le token FCM** :
   - Lancez l'application et regardez les logs :
     ```
     FCM Token: cLQ2aBcD...
     ```
   - Si aucun token n'est affiché :
     - Vérifiez que vous avez appelé `getFcmToken()` ou `exportFcmToken()`
     - Vérifiez que les permissions sont accordées

3. **Tester l'envoi de notification** :
   - Allez dans [Firebase Cloud Messaging](https://console.firebase.google.com/project/_/notification)
   - Cliquez sur **Nouvelle campagne** → **Tester sur un appareil**
   - Entrez le token FCM affiché dans vos logs
   - Envoyez une notification de test

4. **Vérifier l'abonnement aux topics** :
   ```typescript
   // Dans votre code, vérifiez que vous êtes bien abonné
   await messaging().subscribeToTopic('delegation_imt');
   
   // Vérifiez les abonnements
   const topics = await messaging().getSubscribedTopics();
   console.log('Topics:', topics);
   ```

5. **Problèmes courants Android** :
   - **OEMs chinois (Xiaomi, Huawei, etc.)** : Ces appareils ont souvent des restrictions sur les notifications
   - **Mode économie d'énergie** : Désactivez-le pour l'application
   - **Optimisation de la batterie** : Désactivez l'optimisation pour AtlanticApp

6. **Problèmes courants iOS** :
   - **App en background** : Les notifications peuvent ne pas déclencher les gestionnaires
   - **App fermée** : Utilisez `getInitialNotification()` pour gérer
   - **Simulator** : Les notifications push ne fonctionnent pas sur simulateur

---

### 📊 **"Les données Firestore ne se mettent pas à jour"**

#### **Symptômes** :
- Les modifications dans Firestore ne sont pas visibles dans l'app
- Le cache semble obsolète

#### **Solutions** :

1. **Désactiver le cache (pour le développement)** :
   ```typescript
   import { getFirestore, enableIndexedDbPersistence } from '@react-native-firebase/firestore';
   
   const db = getFirestore();
   
   // Désactiver le cache pour le développement
   if (__DEV__) {
     db.settings({ cacheSizeBytes: 0 });
   }
   ```

2. **Forcer le rafraîchissement** :
   ```typescript
   // Utiliser { source: 'server' } pour ignorer le cache
   const q = query(
     collection(db, 'matches'),
     where('status', '==', 'scheduled')
   );
   
   const snapshot = await getDocs(q, { source: 'server' });
   ```

3. **Écouter les changements en temps réel** :
   ```typescript
   // Utiliser onSnapshot au lieu de getDocs
   const unsubscribe = onSnapshot(
     query(collection(db, 'matches')),
     (snapshot) => {
       const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       setMatches(matches);
     }
   );
   
   // N'oubliez pas de vous désabonner
   return () => unsubscribe();
   ```

---

## 💻 **Problèmes de Développement**

### 🎨 **"Le style ne s'applique pas"**

#### **Symptômes** :
- Les styles ne sont pas appliqués
- L'application a une apparence incorrecte

#### **Solutions** :

1. **Vérifier les noms de classes** :
   - Assurez-vous que les noms de styles correspondent
   - Vérifiez les fautes de frappe

2. **Vérifier les priorités** :
   - Les styles inline ont une priorité plus élevée
   - L'ordre des styles dans StyleSheet compte

3. **Utiliser StyleSheet** :
   ```typescript
   // ✅ Bien
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: '#fff',
     },
   });
   
   // ❌ À éviter (performance)
   const containerStyle = {
     flex: 1,
     backgroundColor: '#fff',
   };
   ```

4. **Vérifier les dimensions** :
   - Assurez-vous que les composants ont des dimensions définies
   - Utilisez `flex: 1` pour remplir l'espace disponible

5. **Problèmes avec SafeArea** :
   - Utilisez `SafeAreaView` pour gérer les safe areas :
     ```typescript
     import { SafeAreaView } from 'react-native-safe-area-context';
     
     <SafeAreaView style={{ flex: 1 }}>
       {/* Votre contenu */}
     </SafeAreaView>
     ```

---

### 🧭 **"La navigation ne fonctionne pas"**

#### **Symptômes** :
- `router.navigate()` ne fait rien
- L'application plante lors de la navigation

#### **Solutions** :

1. **Vérifier le nom de la route** :
   - Assurez-vous que le nom de la route est correct
   - Vérifiez la structure des fichiers dans `app/`

2. **Vérifier les paramètres** :
   ```typescript
   // ✅ Bien
   router.navigate('/matches/head_to_head/abc123');
   
   // ✅ Bien avec paramètres
   router.navigate({
     pathname: '/matches/head_to_head/[id]',
     params: { id: 'abc123' }
   });
   
   // ❌ À éviter
   router.navigate('/matches/head_to_head', { id: 'abc123' });
   ```

3. **Vérifier le Linking** :
   - Sur Android, assurez-vous que le package est correct dans `AndroidManifest.xml`
   - Sur iOS, vérifiez `Info.plist`

4. **Déboguer la navigation** :
   ```typescript
   import { router } from 'expo-router';
   
   console.log('Route actuelle:', router.currentRoute);
   ```

5. **Vérifier les écrans manquants** :
   - Si vous avez une erreur "No screen found", vérifiez que le fichier existe
   - Vérifiez que le nom du fichier correspond à la route

---

### 📱 **"L'application plante au lancement"**

#### **Symptômes** :
- L'application crash avant de s'ouvrir
- Erreur blanche ou rouge à l'écran

#### **Solutions** :

1. **Vérifier les logs** :
   - **Android** :
     ```bash
     adb logcat
     ```
   - **iOS** :
     ```bash
     # Connectez votre appareil et utilisez Xcode
     # ou
     idevicesyslog | grep AtlanticApp
     ```

2. **Erreur de syntaxe** :
   - Vérifiez que vous n'avez pas d'erreur de syntaxe TypeScript
   - Exécutez :
     ```bash
     npx tsc --noEmit
     ```

3. **Module manquant** :
   - Vérifiez que tous les modules sont bien installés
   - Vérifiez les imports

4. **Problème de compatibilité** :
   - Vérifiez les versions des dépendances dans `package.json`
   - Comparez avec les versions recommandées dans ce wiki

5. **Problème de font** :
   - Si l'erreur mentionne une font manquante, vérifiez que les fonts sont bien liées :
     ```bash
     npx expo prebuild
     ```

---

### 🗃️ **"AsyncStorage ne sauvegarde pas les données"**

#### **Symptômes** :
- Les préférences utilisateur ne sont pas sauvegardées
- `getItem()` retourne toujours `null`

#### **Solutions** :

1. **Vérifier l'initialisation** :
   - AsyncStorage est inclus par défaut avec React Native
   - Aucune initialisation n'est nécessaire

2. **Vérifier les clés** :
   ```typescript
   // ✅ Bien
   await AsyncStorage.setItem('supported_delegation', 'imt');
   const delegation = await AsyncStorage.getItem('supported_delegation');
   
   // ❌ À éviter - Clé différente
   await AsyncStorage.setItem('supported_delegation', 'imt');
   const delegation = await AsyncStorage.getItem('delegation'); // ❌ Clé différente
   ```

3. **Vérifier le type de données** :
   - AsyncStorage ne supporte que les **strings**
   - Pour stocker des objets, utilisez `JSON.stringify()` :
     ```typescript
     // Stocker un objet
     const user = { id: '123', name: 'John' };
     await AsyncStorage.setItem('user', JSON.stringify(user));
     
     // Récupérer un objet
     const userString = await AsyncStorage.getItem('user');
     const user = userString ? JSON.parse(userString) : null;
     ```

4. **Problèmes sur Android** :
   - Certains appareils Android ont des problèmes avec AsyncStorage
   - Essayez avec `react-native-async-storage` (déjà installé dans le projet)

---

## 🤖 **Problèmes Spécifiques à Android**

### ⚡ **"L'application est lente sur Android"**

#### **Symptômes** :
- L'application met du temps à démarrer
- Les animations saccadent
- L'interface est laggy

#### **Solutions** :

1. **Activer Hermès** :
   - Hermès est un moteur JavaScript qui améliore les performances
   - Vérifiez dans `app.config.js` :
     ```javascript
     export default {
       expo: {
         jsEngine: 'hermes',
       },
     };
     ```

2. **Optimiser les images** :
   - Utilisez des images optimisées (WebP au lieu de PNG)
   - Réduisez la taille des images
   - Utilisez `resizeMode` :
     ```typescript
     <Image
       source={require('@/assets/images/logo.png')}
       style={{ width: 200, height: 200 }}
       resizeMode="contain"
     />
     ```

3. **Éviter les re-rendus inutiles** :
   - Utilisez `React.memo` :
     ```typescript
     const MyComponent = React.memo(({ data }) => {
       return <View>{/* ... */}</View>;
     });
     ```

4. **Utiliser FlatList pour les longues listes** :
   ```typescript
   // ✅ Bien
   <FlatList
     data={items}
     renderItem={({ item }) => <Item item={item} />}
     keyExtractor={(item) => item.id}
   />
   
   // ❌ À éviter
   <ScrollView>
     {items.map(item => <Item key={item.id} item={item} />)}
   </ScrollView>
   ```

5. **Problèmes avec le bridge native** :
   - Évitez de faire trop d'appels natifs
   - Batchez les opérations quand c'est possible

---

### 📱 **"L'application ne s'installe pas sur mon appareil Android"**

#### **Symptômes** :
- Le message "App not installed" apparaît
- L'installation échoue

#### **Solutions** :

1. **Désinstaller l'ancienne version** :
   ```bash
   adb uninstall fr.atlanticapp.atlanticup
   ```

2. **Vérifier le package name** :
   - Dans `app.config.js` :
     ```javascript
     export default {
       expo: {
         android: {
           package: 'fr.atlanticapp.atlanticup',
         },
       },
     };
     ```

3. **Activer "Unknown Sources"** :
   - Allez dans **Paramètres → Sécurité**
   - Activez **Sources inconnues**

4. **Vérifier les permissions** :
   - Assurez-vous que vous avez les permissions pour installer des APK

5. **Essayer avec un autre appareil** :
   - Certains appareils ont des restrictions

---

### 🔊 **"Les sons ne fonctionnent pas sur Android"**

#### **Symptômes** :
- Les notifications sonores ne sont pas jouées
- Les sons de l'application ne fonctionnent pas

#### **Solutions** :

1. **Vérifier le volume** :
   - Assurez-vous que le volume des notifications est activé

2. **Vérifier les permissions** :
   - Assurez-vous que l'application a la permission de lire les fichiers audio

3. **Problèmes avec les fichiers audio** :
   - Les fichiers audio doivent être dans le bon format
   - Utilisez `.mp3` ou `.wav`
   - Placez les fichiers dans `assets/sounds/`

4. **Vérifier la configuration** :
   - Dans `app.config.js` :
     ```javascript
     export default {
       expo: {
         android: {
           audio: {
             // Configuration audio
           },
         },
       },
     };
     ```

---

## 🍎 **Problèmes Spécifiques à iOS**

### ⚠️ **"L'application crash sur iOS"**

#### **Symptômes** :
- L'application plante au lancement
- Erreur sigabrt

#### **Solutions** :

1. **Vérifier les pods** :
   ```bash
   cd ios
   pod install --repo-update
   cd ..
   ```

2. **Nettoyer le projet Xcode** :
   - Ouvrez le projet dans Xcode (`ios/AtlanticApp.xcworkspace`)
   - **Product → Clean Build Folder** (⇧⌘K)
   - **Product → Build** (⌘B)

3. **Vérifier les permissions** :
   - Dans `ios/AtlanticApp/Info.plist` :
     ```xml
     <key>NSAppTransportSecurity</key>
     <dict>
       <key>NSAllowsArbitraryLoads</key>
       <true/>
     </dict>
     ```

4. **Problèmes de memory** :
   - Réduisez la taille des images
   - Évitez de charger trop de données en mémoire

5. **Vérifier le deployment target** :
   - Dans Xcode, vérifiez que **iOS Deployment Target** ≥ 14.0

---

### 📍 **"La localisation ne fonctionne pas sur iOS"**

#### **Symptômes** :
- Impossible de récupérer la position de l'utilisateur
- La carte ne montre pas la position actuelle

#### **Solutions** :

1. **Vérifier les permissions** :
   - Dans `ios/AtlanticApp/Info.plist` :
     ```xml
     <key>NSLocationWhenInUseUsageDescription</key>
     <string>Cette application a besoin d'accéder à votre position pour afficher les lieux de compétition à proximité.</string>
     
     <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
     <string>Cette application a besoin d'accéder à votre position pour afficher les lieux de compétition à proximité.</string>
     ```

2. **Demander les permissions** :
   - Sur iOS, vous devez demander explicitement les permissions :
     ```typescript
     import * as Location from 'expo-location';
     
     const requestLocationPermission = async () => {
       const { status } = await Location.requestForegroundPermissionsAsync();
       if (status !== 'granted') {
         Alert.alert('Permission refusée', 'Impossible d\'accéder à votre position');
       }
     };
     ```

3. **Tester sur un appareil physique** :
   - La localisation ne fonctionne pas sur simulateur
   - Utilisez un iPhone ou iPad réel

---

### 🔔 **"Les notifications ne s'affichent pas sur iOS"**

#### **Symptômes** :
- Les notifications push ne sont pas affichées
- Le badge de notification ne s'affiche pas

#### **Solutions** :

1. **Vérifier les permissions** :
   - Dans `ios/AtlanticApp/Info.plist` :
     ```xml
     <key>UIBackgroundModes</key>
     <array>
       <string>remote-notification</string>
     </array>
     ```

2. **Demander les permissions** :
   ```typescript
   import messaging from '@react-native-firebase/messaging';
   
   const requestPermission = async () => {
     const authStatus = await messaging().requestPermission();
     const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
     
     if (!enabled) {
       console.log('Permission refusée');
     }
   };
   ```

3. **Vérifier l'app ID** :
   - Dans Xcode, vérifiez que **Bundle Identifier** correspond à celui dans Firebase

4. **Tester sur un appareil physique** :
   - Les notifications push ne fonctionnent pas sur simulateur

5. **Vérifier les certificates** :
   - Dans la console Firebase, vérifiez que les certificates iOS sont bien configurés

---

### 🎨 **"Les icônes ne s'affichent pas sur iOS"**

#### **Symptômes** :
- Les icônes de l'application ne s'affichent pas
- Les icônes des onglets ne s'affichent pas

#### **Solutions** :

1. **Vérifier les polices d'icônes** :
   - Le projet utilise `@expo/vector-icons`
   - Assurez-vous que la police est bien liée :
     ```bash
     npx expo prebuild
     ```

2. **Vérifier les assets** :
   - Les icônes doivent être dans `assets/images/`
   - Les chemins doivent être corrects

3. **Nettoyer et reconstruire** :
   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   cd ..
   npx expo start --clear
   ```

---

## 🏆 **Problèmes de Fonctionnalités**

### 📅 **"Pourquoi le filtre 'Filtrer mon école' ne fonctionne pas ?"**

#### **Symptômes** :
- Le filtre "Filtrer mon école" ne filtre pas correctement les matchs
- Aucun match n'est affiché après l'activation du filtre

#### **Solutions** :

1. **Vérifier que vous avez sélectionné une école** :
   - Allez dans **Menu → Préférences → Sélectionner une école à soutenir**
   - Sélectionnez une école

2. **Vérifier le stockage local** :
   ```typescript
   // Vérifiez que l'école est bien sauvegardée
   const delegation = await AsyncStorage.getItem('supported_delegation');
   console.log('École soutenue:', delegation);
   ```

3. **Vérifier l'abonnement FCM** :
   - Assurez-vous que vous êtes abonné au topic de votre école :
     ```typescript
     await messaging().subscribeToTopic(delegationId);
     ```

4. **Vérifier le filtrage dans calendar.tsx** :
   - Dans `app/(tabs)/calendar.tsx`, vérifiez que :
     ```typescript
     const { docs } = await fetchNextPage({
       lastDoc: null,
       selectedSchool: seeSchoolOnly ? selectedTeam : null,
       blackList,
       placeId: null
     });
     ```
   - `seeSchoolOnly` doit être `true`
   - `selectedTeam` doit contenir l'ID de votre école

5. **Vérifier les données Firestore** :
   - Assurez-vous que les matchs ont bien le champ `delegations_id` :
     ```json
     {
       "delegations_id": ["delegation_imt", "delegation_centrale"]
     }
     ```

---

### 🗺️ **"La carte ne montre pas les lieux"**

#### **Symptômes** :
- La carte est vide
- Aucun marqueur n'est affiché

#### **Solutions** :

1. **Vérifier la récupération des lieux** :
   - Dans `app/(tabs)/map/index.tsx` :
     ```typescript
     const [places, setPlaces] = useState<Place[]>([]);
     
     useEffect(() => {
       const fetchPlaces = async () => {
         const placesData = await getAllPlaces();
         setPlaces(placesData);
       };
       fetchPlaces();
     }, []);
     ```
   - Vérifiez que `getAllPlaces()` retourne bien des données

2. **Vérifier les données Firestore** :
   - Assurez-vous que la collection `places` existe
   - Assurez-vous que les documents ont les bons champs :
     ```json
     {
       "id": "place_1",
       "name": "Stade Municipal",
       "location": {
         "latitude": 47.2184,
         "longitude": -1.5536
       }
     }
     ```

3. **Vérifier les permissions de localisation** :
   - Sur mobile, vérifiez que l'application a la permission d'accéder à la localisation

4. **Vérifier la région initiale** :
   - Dans `map/index.tsx` :
     ```typescript
     const [region, setRegion] = useState({
       latitude: 47.2184,  // Brest
       longitude: -1.5536,
       latitudeDelta: 0.0922,
       longitudeDelta: 0.0421,
     });
     ```
   - Si vous n'êtes pas à Brest, ajustez les coordonnées

---

### 🏆 **"Le classement n'est pas mis à jour"**

#### **Symptômes** :
- Le classement général ne se met pas à jour
- Les points des équipes ne sont pas corrects

#### **Solutions** :

1. **Forcer le rafraîchissement** :
   - Dans `generalRankingScreen.tsx`, tirez vers le bas pour rafraîchir

2. **Vérifier les données Firestore** :
   - Assurez-vous que la collection `ranking` existe
   - Vérifiez que les délégations ont bien un champ `points` :
     ```json
     {
       "id": "delegation_imt",
       "name": "IMT Atlantique",
       "points": 150,
       "ranking": 1
     }
     ```

3. **Vérifier le calcul des points** :
   - Dans `rankingService.ts`, vérifiez que le calcul est correct
   - Les points doivent être calculés à partir des matchs terminés

4. **Vérifier les abonnements** :
   - Utilisez `onSnapshot` pour écouter les changements en temps réel :
     ```typescript
     const unsubscribe = onSnapshot(
       query(collection(db, 'ranking')),
       (snapshot) => {
         const ranking = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         setRanking(ranking);
       }
     );
     ```

---

### 🔄 **"Le pull-to-refresh ne fonctionne pas"**

#### **Symptômes** :
- Tirer vers le bas ne rafraîchit pas la liste
- Le spinner de rafraîchissement ne s'affiche pas

#### **Solutions** :

1. **Vérifier l'implémentation** :
   - Dans `calendar.tsx` :
     ```typescript
     <FlatList
       data={events}
       renderItem={renderItem}
       refreshControl={
         <RefreshControl
           refreshing={refreshing}
           onRefresh={refreshEvents}
           tintColor="#1d4966"
         />
       }
     />
     ```
   - Assurez-vous que `refreshEvents` est bien définie

2. **Vérifier l'état `refreshing`** :
   ```typescript
   const refreshEvents = async () => {
     setRefreshing(true);  // ⚠️ À ne pas oublier
     try {
       // Récupérer les données
     } catch (err) {
       // Gérer l'erreur
     } finally {
       setRefreshing(false);  // ⚠️ À ne pas oublier
     }
   };
   ```

3. **Vérifier que la liste est scrollable** :
   - Assurez-vous que le `FlatList` a assez de contenu pour être scrollable
   - Si le contenu est trop court, le pull-to-refresh peut ne pas fonctionner

---

### 🔊 **"Les notifications sonores ne fonctionnent pas"**

#### **Symptômes** :
- Aucune notification sonore pour les matchs
- Le son est activé mais rien ne se joue

#### **Solutions** :

1. **Vérifier les permissions** :
   - Sur Android : Autorisations → AtlanticApp → Son
   - Sur iOS : Réglages → AtlanticApp → Notifications → Sons

2. **Vérifier que le son est activé dans l'application** :
   - Allez dans **Menu → Préférences → Notifications**
   - Assurez-vous que les notifications sont activées

3. **Vérifier le payload de la notification** :
   - Les notifications doivent inclure un champ `sound` :
     ```json
     {
       "notification": {
         "title": "Nouveau match",
         "body": "IMT vs Centrale à 14h",
         "sound": "default"
       }
     }
     ```

4. **Problèmes spécifiques Android** :
   - Certains appareils (surtout chinois) désactivent les sons des notifications
   - Essayez avec un autre appareil

---

## 💬 **Questions sur le Code**

### ❓ **"Comment ajouter un nouveau type de match ?"**

#### **Étapes** :

1. **Créer un nouveau composant de carte** :
   ```typescript
   // src/components/Match/NewTypeMatchCard.tsx
   export const NewTypeMatchCard = ({ match }: { match: Match }) => {
     return (
       <View style={styles.card}>
         {/* Implémentez votre carte */}
       </View>
     );
   };
   ```

2. **Ajouter le type dans le modèle** :
   ```typescript
   // types/models.ts
   type MatchKind = 'head_to_head' | 'ranked' | 'new_type';
   
   interface Match {
     kind: MatchKind;
     // ...
   }
   ```

3. **Mettre à jour le service** :
   ```typescript
   // src/api/services/firestore/matchService.ts
   export const getNewTypeMatches = async (params: any) => {
     // Implémentez la récupération des matchs de ce type
   };
   ```

4. **Ajouter l'écran de détails** :
   ```typescript
   // app/matches/new_type/[id].tsx
   export default function NewTypeMatchScreen() {
     const { id } = useLocalSearchParams();
     // Implémentez l'écran
   }
   ```

5. **Mettre à jour la navigation** :
   - Dans `app/_layout.tsx` ou le layout approprié

---

### ❓ **"Comment tester une nouvelle fonctionnalité ?"**

#### **Étapes** :

1. **Créer une branche** :
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

2. **Implémenter la fonctionnalité** :
   - Faites vos modifications
   - Testez localement

3. **Tester sur différents appareils** :
   - Test sur Android (émulateur et physique)
   - Test sur iOS (simulateur et physique)

4. **Tester avec différents scénarios** :
   - Tester avec des données vides
   - Tester avec beaucoup de données
   - Tester avec des erreurs

5. **Vérifier les performances** :
   - Utilisez Flipper ou React DevTools
   - Mesurez le temps de chargement

6. **Faire une PR** :
   - Créez une Pull Request
   - Demandez une review

---

### ❓ **"Comment ajouter une nouvelle collection Firestore ?"**

#### **Étapes** :

1. **Définir l'interface** :
   ```typescript
   // types/models.ts
   interface NewModel {
     id: string;
     name: string;
     // ...
   }
   ```

2. **Créer le service** :
   ```typescript
   // src/api/services/firestore/newModelService.ts
   import { getFirestore, collection, getDocs, addDoc } from '@react-native-firebase/firestore';
   
   const db = getFirestore();
   
   export const getAllNewModels = async (): Promise<NewModel[]> => {
     const snapshot = await getDocs(collection(db, 'newModels'));
     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewModel));
   };
   
   export const createNewModel = async (data: Omit<NewModel, 'id'>): Promise<string> => {
     const docRef = await addDoc(collection(db, 'newModels'), data);
     return docRef.id;
   };
   ```

3. **Configurer les règles Firestore** :
   - Allez dans [Firestore Rules](https://console.firebase.google.com/project/_/database/firestore/rules)
   - Ajoutez les règles pour la nouvelle collection

4. **Tester** :
   - Testez avec des données de test
   - Vérifiez que les règles sont correctes

---

### ❓ **"Comment utiliser un nouveau hook personnalisé ?"**

#### **Étapes** :

1. **Créer le hook** :
   ```typescript
   // src/hooks/useCustomHook.ts
   import { useState, useEffect } from 'react';
   
   export const useCustomHook = (param: string) => {
     const [state, setState] = useState(null);
     
     useEffect(() => {
       // Logique du hook
     }, [param]);
     
     return { state, setState };
   };
   ```

2. **Utiliser le hook** :
   ```typescript
   import { useCustomHook } from '@/src/hooks/useCustomHook';
   
   const MyComponent = () => {
     const { state, setState } = useCustomHook('param');
     
     return (
       <View>
         <Text>{state}</Text>
       </View>
     );
   };
   ```

3. **Tester le hook** :
   - Testez le hook dans différents scénarios
   - Vérifiez que le hook ne cause pas de re-rendus inutiles

---

## 🆘 **Où Poser des Questions ?**

### 📌 **Canaux de Communication**

| Canal | Usage | Lien |
|-------|-------|------|
| **GitHub Issues** | Bugs, fonctionnalités, questions techniques | [Issues](https://github.com/AtlanticApp-dev/Collab-AtlanticApp-mobile/issues) |
| **GitHub Discussions** | Questions générales, idées, discussions | [Discussions](https://github.com/AtlanticApp-dev/Collab-AtlanticApp-mobile/discussions) |
| **Email** | Questions urgent/privées | victor.aribaud@imt-atlantique.net |
| **Instagram** | Annonces, news | [@atlanticup_bzh](https://www.instagram.com/atlanticup_bzh/) |

### 💡 **Comment Poser une Bonne Question ?**

#### ✅ **Bonne question** :
```markdown
## 🐛 Problème avec le filtre par école

**Description** :
Le filtre "Filtrer mon école" ne fonctionne pas. Quand je l'active, aucun match n'est affiché.

**Étapes pour reproduire** :
1. Sélectionner une école dans Menu → Préférences
2. Retourner au calendrier
3. Activer le filtre "Filtrer mon école"
4. Résultat : Aucun match n'est affiché

**Comportement attendu** :
Les matchs de mon école devraient être affichés.

**Environnement** :
- Appareil : Pixel 6
- OS : Android 13
- Version de l'app : 1.0.0

**Logs** :
```
[Error] : selectedTeam is null
```

**Ce que j'ai déjà essayé** :
- J'ai vérifié que l'école est bien sauvegardée dans AsyncStorage
- J'ai redémarré l'application
```

#### ❌ **Mauvaise question** :
```markdown
❌ "Ça marche pas"
❌ "J'ai un bug"
❌ "Aidez-moi !"
❌ "Pourquoi mon code ne fonctionne pas ?" (sans détails)
```

### 📝 **Checklist avant de Poser une Question**

- [ ] J'ai cherché dans ce **FAQ**
- [ ] J'ai cherché dans les **Issues GitHub**
- [ ] J'ai cherché sur **Google/Stack Overflow**
- [ ] J'ai vérifié les **logs**
- [ ] J'ai testé sur **plusieurs appareils/émulateurs**
- [ ] J'ai inclus **toutes les informations nécessaires** :
  - Description du problème
  - Étapes pour reproduire
  - Comportement attendu
  - Environnement (appareil, OS, version)
  - Logs erreurs
  - Ce que j'ai déjà essayé

---

## 🔄 **Navigation**

```
┌─────────────────────────────────────────────────────────────┐
│                        FAQ / DÉPANNAGE                            │
├─────────────────────────────────────────────────────────────┤
│  [Setup]  │  [Firebase]  │  [Dev]  │  [Android]  │  [iOS]      │
├─────────────────────────────────────────────────────────────┤
│  [Fonctionnalités]  │  [Code]  │  [Poser des questions]        │
└─────────────────────────────────────────────────────────────┘
```

**[← Retour à l'accueil](./Home.md) | [Contribution ←](./Contribution.md) | [Ressources →](./Resources.md)**

---

*Dernière mise à jour : 13 juin 2026*
*Besoin d'aide ? N'hésitez pas à poser une question !*
