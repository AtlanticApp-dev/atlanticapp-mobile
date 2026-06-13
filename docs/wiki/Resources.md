# 📚 Ressources Supplémentaires - AtlanticApp

> *Tutoriels, glossaire, changelog, et ressources utiles pour approfondir vos connaissances.*

---

## 📖 **Sommaire**

1. [Tutoriels Recommandés](#-tutoriels-recommandés)
2. [Glossaire](#-glossaire)
3. [Changelog](#-changelog)
4. [Premiers Pas : Tutoriel Pas-à-Pas](#-premiers-pas--tutoriel-pas-à-pas)
5. [Ressources par Technologie](#-ressources-par-technologie)
6. [Communauté](#-communauté)
7. [Inspiration](#-inspiration)

---

**[← Retour à l'accueil](./Home.md) | [FAQ ←](./FAQ.md)**

---

## 🎓 **Tutoriels Recommandés**

### 📱 **React Native**

#### 🏆 **Pour Débutants**

| Titre | Description | Durée | Lien |
|-------|-------------|-------|------|
| **React Native Fundamentals** | Tutoriel officiel pour bien commencer | 2h | [reactnative.dev](https://reactnative.dev/docs/getting-started) |
| **React Native - The Practical Guide** | Cours complet sur Udemy | 20h | [Udemy](https://www.udemy.com/course/react-native-the-practical-guide/) |
| **React Native Crash Course** | Introduction rapide | 1h | [YouTube](https://www.youtube.com/watch?v=ur6I5G2MfTk) |
| **Learn React Native** | Tutoriel interactif | 3h | [expo.dev/learn](https://docs.expo.dev/tutorial/introduction/) |

#### 🌟 **Pour Intermédiaires**

| Titre | Description | Durée | Lien |
|-------|-------------|-------|------|
| **React Native Animations** | Maîtriser les animations | 2h | [React Native Animations](https://reactnative.dev/docs/animations) |
| **React Navigation** | Navigation avancée | 1h | [React Navigation Docs](https://reactnavigation.org/docs/getting-started) |
| **State Management in React Native** | Redux, Context API, Zustand | 2h | [YouTube](https://www.youtube.com/watch?v=753Jn461BII) |
| **Performance Optimization** | Optimiser votre app | 1h | [React Native Performance](https://reactnative.dev/docs/performance) |

#### 🚀 **Pour Avancés**

| Titre | Description | Durée | Lien |
|-------|-------------|-------|------|
| **React Native Reanimated** | Animations avancées | 3h | [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/) |
| **React Native Architecture** | Architecture propre | 2h | [YouTube](https://www.youtube.com/watch?v=F8LJjo6q24M) |
| **Testing React Native** | Tests unitaires et E2E | 2h | [Testing Guide](https://reactnative.dev/docs/testing-overview) |
| **CI/CD for React Native** | Intégration continue | 1h | [YouTube](https://www.youtube.com/watch?v=5LgqQp4gE1o) |

---

### 🔥 **Firebase**

#### 🏆 **Pour Débutants**

| Titre | Description | Durée | Lien |
|-------|-------------|-------|------|
| **Firebase for Beginners** | Introduction à Firebase | 2h | [Firebase Docs](https://firebase.google.com/docs) |
| **Firestore Tutorial** | Maîtriser Firestore | 1h | [Firestore Docs](https://firebase.google.com/docs/firestore) |
| **Firebase Authentication** | Authentification | 1h | [Auth Docs](https://firebase.google.com/docs/auth) |
| **Firebase Cloud Messaging** | Notifications push | 1h | [FCM Docs](https://firebase.google.com/docs/cloud-messaging) |

#### 🌟 **Pour Intermédiaires**

| Titre | Description | Durée | Lien |
|-------|-------------|-------|------|
| **Firebase Security Rules** | Règles de sécurité | 1h | [Security Rules](https://firebase.google.com/docs/firestore/security/get-started) |
| **Cloud Functions** | Fonctions serverless | 2h | [Cloud Functions Docs](https://firebase.google.com/docs/functions) |
| **Firebase with React Native** | Intégration RN + Firebase | 1h | [React Native Firebase](https://rnfirebase.io/) |
| **Firebase Emulator Suite** | Développement local | 1h | [Emulator Suite](https://firebase.google.com/docs/emulator-suite) |

---

### 🛠️ **Expo**

| Titre | Description | Durée | Lien |
|-------|-------------|-------|------|
| **Expo Documentation** | Guide officiel | - | [docs.expo.dev](https://docs.expo.dev/) |
| **Expo Router** | Navigation avec Expo | 1h | [Expo Router Docs](https://docs.expo.dev/router/) |
| **Expo EAS** | Build et déploiement | 1h | [EAS Docs](https://docs.expo.dev/eas/) |
| **Expo for Beginners** | Tutoriel débutant | 1h | [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/) |

---

## 📖 **Glossaire**

> *Définitions des termes techniques utilisés dans le projet.*

### 📱 **React Native / Mobile**

| Terme | Définition | Exemple |
|-------|------------|---------|
| **React Native** | Framework JavaScript pour créer des applications mobiles natives | `React Native` utilise des composants natifs |
| **Expo** | Outilchain et framework pour React Native qui simplifie le développement | `expo start` pour démarrer l'app |
| **Expo Router** | Système de navigation basé sur le système de fichiers pour Expo | `app/(tabs)/calendar.tsx` devient `/calendar` |
| **Component** | Bloc de code UI réutilisable | `<Button>`, `<Card>`, `<MatchCard>` |
| **State** | Données qui changent au fil du temps dans un composant | `useState()` |
| **Props** | Données passées d'un composant parent à un enfant | `<MatchCard match={matchData} />` |
| **Hook** | Fonction qui permet d'utiliser des états et effets dans les composants fonctionnels | `useState`, `useEffect`, `useContext` |
| **JSX** | Syntaxe qui permet d'écrire du HTML dans JavaScript | `<View><Text>Hello</Text></View>` |
| **Virtual DOM** | Représentation en mémoire du DOM utilisé par React pour optimiser les mises à jour | - |
| **Re-render** | Processus où React recalcule et met à jour l'interface | Quand l'état ou les props changent |
| **Memoization** | Technique pour éviter les calculs inutiles | `React.memo`, `useMemo`, `useCallback` |
| **FlatList** | Composant optimisé pour afficher des longues listes | Alternative à `ScrollView` |
| **SafeArea** | Zone sûre pour éviter les éléments système (notch, barre de status) | `SafeAreaView` |

### 🔥 **Firebase**

| Terme | Définition | Exemple |
|-------|------------|---------|
| **Firestore** | Base de données NoSQL en temps réel de Firebase | Collection `matches`, document `match_123` |
| **Collection** | Ensemble de documents dans Firestore | `matches`, `users`, `delegations` |
| **Document** | Unité de stockage dans Firestore | `{ id: '123', name: 'Match' }` |
| **Field** | Paire clé-valeur dans un document | `name: 'IMT vs Centrale'` |
| **Timestamp** | Type de données pour les dates dans Firestore | `FirestoreTimestamp` → `Date` |
| **Query** | Requête pour récupérer des documents | `query(collection(db, 'matches'))` |
| **Index** | Structure de données qui améliore les performances des requêtes | Index composite pour `where` + `orderBy` |
| **Firebase Auth** | Service d'authentification de Firebase | Email/Password, Google, Facebook |
| **FCM (Firebase Cloud Messaging)** | Service de notifications push | Envoi de notifications aux appareils |
| **Topic** | Canal de notification dans FCM | `delegation_imt`, `sport_football` |
| **Token FCM** | Identifiant unique d'un appareil pour FCM | `cLQ2aBcD...` |
| **Cloud Functions** | Fonctions serverless qui s'exécutent sur les serveurs Firebase | Déclenchées par des événements Firestore |
| **Security Rules** | Règles de sécurité pour contrôler l'accès aux données | `allow read: if request.auth != null` |

### 🌐 **Git & GitHub**

| Terme | Définition | Exemple |
|-------|------------|---------|
| **Repository (Repo)** | Dépôt de code source | `AtlanticApp-dev/Collab-AtlanticApp-mobile` |
| **Branch** | Version parallèle du code | `main`, `develop`, `feature/xyz` |
| **Commit** | Sauvegarde d'un état du code | `git commit -m "feat: add filter"` |
| **Pull Request (PR)** | Proposition de fusion de code | Fusion de `feature/xyz` dans `develop` |
| **Merge** | Fusion de deux branches | `git merge develop` |
| **Rebase** | Réorganisation des commits | `git rebase develop` |
| **Clone** | Copie locale d'un repository | `git clone https://...` |
| **Fork** | Copie personnelle d'un repository | Pour contribuer à des projets open source |
| **Push** | Envoyer des commits vers un remote | `git push origin feature/xyz` |
| **Pull** | Récupérer les changements d'un remote | `git pull origin main` |
| **Remote** | Référence à un repository distant | `origin` |
| **Issue** | Suivi de bug ou de fonctionnalité | GitHub Issues |
| **Conventional Commits** | Convention de nommage des commits | `feat:`, `fix:`, `docs:` |

### 🛠️ **Outils & Concepts**

| Terme | Définition | Exemple |
|-------|------------|---------|
| **npm/yarn** | Gestionnaires de paquets JavaScript | `npm install`, `yarn add` |
| **Node.js** | Runtime JavaScript côté serveur | Nécessaire pour exécuter React Native |
| **TypeScript** | JavaScript avec typage statique | `interface User { id: string; }` |
| **Async/Await** | Syntaxe pour gérer les opérations asynchrones | `const data = await fetchData()` |
| **Promise** | Objet représentant une opération asynchrone | `.then()`.catch()` |
| **API (Application Programming Interface)** | Interface pour communiquer avec un service | Firebase API, REST API |
| **SDK (Software Development Kit)** | Kit de développement pour une plateforme | React Native Firebase SDK |
| **CRUD** | Opérations de base sur une base de données | Create, Read, Update, Delete |
| **Backend** | Partie serveur d'une application | Firebase, Cloud Functions |
| **Frontend** | Partie client d'une application | React Native, UI |
| **Full Stack** | Développement frontend + backend | AtlanticApp utilise React Native + Firebase |
| **NoSQL** | Base de données non relationnelle | Firestore, MongoDB |
| **JSON** | Format de données léger | `{ "name": "John", "age": 30 }` |

---

## 📜 **Changelog**

> *Historique des mises à jour majeures du projet AtlanticApp.*

### 🚀 **Version 2.0.0 (À venir)**

**Date de sortie** : Q4 2026

#### ✨ **Nouvelles Fonctionnalités**
- [ ] Système de notifications avancé avec FCM
- [ ] Filtrage des matchs par école et sport
- [ ] Interface utilisateur repensée
- [ ] Mode sombre

#### 🔧 **Améliorations**
- [ ] Optimisation des performances
- [ ] Meilleure gestion du cache
- [ ] Amélioration de l'accessibilité

#### 🐛 **Corrections de Bugs**
- [ ] Correction des problèmes de pagination
- [ ] Fix des erreurs de synchronisation

---

### 🎯 **Version 1.0.0 (Avril 2026)**

**Date de sortie** : 15 avril 2026

#### ✨ **Premières Fonctionnalités**
- ✅ Affichage du calendrier des matchs
- ✅ Navigation entre les onglets (Calendrier, Compétition, Carte, Menu)
- ✅ Détails des matchs (head-to-head et ranked)
- ✅ Classement général et par sport
- ✅ Carte interactive avec les lieux de compétition
- ✅ Sélection des préférences (école, sports)
- ✅ Authentification avec email/mot de passe
- ✅ Notifications push basiques

#### 📱 **Technologies Utilisées**
- React Native 0.83.4
- Expo 55.0.15
- Firebase (Firestore, Auth, Messaging)
- React Navigation 7.x
- React Native Paper 5.12.5

---

### 📊 **Version 0.1.0 (Mars 2026 - Alpha)**

**Date de sortie** : 1 mars 2026

#### ✨ **Fonctionnalités de Base**
- ✅ Structure du projet avec Expo Router
- ✅ Connexion à Firestore
- ✅ Récupération des matchs
- ✅ Affichage basique du calendrier

---

### 🔮 **Feuille de Route (Roadmap)**

| Version | Date Prévue | Fonctionnalités |
|---------|-------------|-----------------|
| **2.0.0** | Q4 2026 | Notifications avancées, Mode sombre, Optimisations |
| **2.1.0** | Q1 2027 | Historique des matchs, Statistiques avancées |
| **2.2.0** | Q2 2027 | Chat en temps réel, Partage social |
| **3.0.0** | 2028 | Refonte complète, Nouvelle architecture |

---

## 👣 **Premiers Pas : Tutoriel Pas-à-Pas**

> *Suivez ce tutoriel pour réaliser votre première contribution au projet.*

### 🎯 **Objectif** : Corriger une Faible dans la Documentation

**Durée estimée** : 30 minutes

---

#### 📌 **Étape 1 : Préparer votre Environnement**

1. **Suivre le guide [Setup](./Setup.md)** pour configurer votre environnement
2. **Cloner le repository** :
   ```bash
   git clone https://github.com/AtlanticApp-dev/Collab-AtlanticApp-mobile.git
   cd Collab-AtlanticApp-mobile
   ```
3. **Installer les dépendances** :
   ```bash
   npm install
   ```
4. **Lancer l'application** :
   ```bash
   APP_VARIANT=test npx expo start --clear
   ```

**✅ Validation** : L'application démarre sans erreur dans votre navigateur.

---

#### 📌 **Étape 2 : Trouver une Tâche Simple**

1. Allez sur [GitHub Issues](https://github.com/AtlanticApp-dev/Collab-AtlanticApp-mobile/issues)
2. Filtrez par le label `🏴️ good first issue` ou `📚 documentation`
3. Sélectionnez une issue qui vous intéresse
4. **Exemple** : "Corriger les fautes de frappe dans le README"

**✅ Validation** : Vous avez trouvé une issue adaptée à votre niveau.

---

#### 📌 **Étape 3 : Créer une Branche**

1. **Mettre à jour la branche main** :
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Créer une nouvelle branche** :
   ```bash
   git checkout -b docs/fix-readme-typo
   ```

**✅ Validation** : Vous êtes sur la branche `docs/fix-readme-typo`.

---

#### 📌 **Étape 4 : Faire les Modifications**

1. **Ouvrir le fichier README.md** dans votre éditeur
2. **Corriger les fautes de frappe** que vous avez identifiées
3. **Vérifier les modifications** :
   ```bash
   git diff
   ```

**✅ Validation** : Les fautes de frappe sont corrigées et le diff montre vos changements.

---

#### 📌 **Étape 5 : Commiter les Changements**

1. **Ajouter les fichiers modifiés** :
   ```bash
   git add README.md
   ```
2. **Commiter avec un bon message** :
   ```bash
   git commit -m "docs: corriger fautes de frappe dans le README"
   ```

**✅ Validation** : Le commit est créé avec un message suivant Conventional Commits.

---

#### 📌 **Étape 6 : Pousser sur GitHub**

1. **Pousser la branche** :
   ```bash
   git push origin docs/fix-readme-typo
   ```

**✅ Validation** : Votre branche est sur GitHub.

---

#### 📌 **Étape 7 : Créer une Pull Request**

1. Allez sur [GitHub](https://github.com/AtlanticApp-dev/Collab-AtlanticApp-mobile)
2. Cliquez sur **"Pull requests"** → **"New pull request"**
3. **Base** : `main`
4. **Compare** : `docs/fix-readme-typo`
5. **Remplir le formulaire** avec le template de PR
6. **Créer la PR**

**✅ Validation** : Votre Pull Request est créée et visible sur GitHub.

---

#### 🎉 **Étape 8 : Attendre la Review**

1. **Un reviewer va examiner votre PR**
2. **Répondre aux commentaires** si nécessaire
3. **Fusionner la PR** une fois approuvée

**✅ FÉLICITATIONS** : Vous avez fait votre première contribution à AtlanticApp ! 🎉

---

#### 🚀 **Étape 9 : Continuer à Contribuer**

Maintenant que vous avez réussi, essayez :
- [ ] Un autre bug de documentation
- [ ] Une correction de typo dans le code
- [ ] Une amélioration simple de l'UI
- [ ] Une nouvelle fonctionnalité (si vous vous sentez prêt)

---

## 📚 **Ressources par Technologie**

### 📱 **React Native**

| Type | Ressource | Lien |
|------|-----------|------|
| **Documentation** | React Native Docs | [reactnative.dev](https://reactnative.dev/) |
| **Blog** | React Native Blog | [reactnative.dev/blog](https://reactnative.dev/blog) |
| **Community** | React Native Community | [reactnative.community](https://reactnative.community/) |
| **GitHub** | React Native Repository | [github.com/facebook/react-native](https://github.com/facebook/react-native) |
| **Stack Overflow** | Questions/Réponses | [stackoverflow.com](https://stackoverflow.com/questions/tagged/react-native) |

**Livres recommandés** :
- [Fullstack React Native](https://www.fullstackreactnative.com/) - Devin Abbott
- [React Native in Action](https://www.manning.com/books/react-native-in-action) - Nader Dabit
- [Learning React Native](https://www.oreilly.com/library/view/learning-react-native/9781491929049/) - Bonnie Eisenman

---

### 🔥 **Firebase**

| Type | Ressource | Lien |
|------|-----------|------|
| **Documentation** | Firebase Docs | [firebase.google.com/docs](https://firebase.google.com/docs) |
| **Blog** | Firebase Blog | [firebase.blog](https://firebase.blog/) |
| **GitHub** | Firebase Repository | [github.com/firebase](https://github.com/firebase) |
| **Stack Overflow** | Questions/Réponses | [stackoverflow.com](https://stackoverflow.com/questions/tagged/firebase) |
| **YouTube** | Firebase Channel | [YouTube Firebase](https://www.youtube.com/c/Firebase) |

**Livres recommandés** :
- [Firebase for Web Developers](https://www.oreilly.com/library/view/firebase-for/9781788629836/) - Anshul Ahir
- [The Complete Firebase Course](https://www.udemy.com/course/the-complete-firebase-course/) - Udemy

---

### 🛠️ **Expo**

| Type | Ressource | Lien |
|------|-----------|------|
| **Documentation** | Expo Docs | [docs.expo.dev](https://docs.expo.dev/) |
| **Blog** | Expo Blog | [blog.expo.dev](https://blog.expo.dev/) |
| **GitHub** | Expo Repository | [github.com/expo/expo](https://github.com/expo/expo) |
| **Community** | Expo Discord | [Discord Expo](https://chat.expo.dev/) |
| **Forums** | Expo Forums | [forums.expo.dev](https://forums.expo.dev/) |

---

### ✅ **TypeScript**

| Type | Ressource | Lien |
|------|-----------|------|
| **Documentation** | TypeScript Docs | [typescriptlang.org](https://www.typescriptlang.org/docs/) |
| **Handbook** | TypeScript Handbook | [typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/) |
| **GitHub** | TypeScript Repository | [github.com/microsoft/TypeScript](https://github.com/microsoft/TypeScript) |
| **Stack Overflow** | Questions/Réponses | [stackoverflow.com](https://stackoverflow.com/questions/tagged/typescript) |

**Livres recommandés** :
- [Programming TypeScript](https://www.oreilly.com/library/view/programming-typescript/9781492037644/) - Boris Cherny
- [TypeScript in 50 Lessons](https://typescript-book.com/) - Dan Vanderkam

---

### 🎨 **UI/UX**

| Type | Ressource | Lien |
|------|-----------|------|
| **Design** | Material Design | [material.io](https://material.io/) |
| **Icônes** | Material Icons | [material.io/resources/icons](https://material.io/resources/icons/) |
| **Couleurs** | Color Tools | [material.io/resources/color](https://material.io/resources/color/) |
| **Inspiration** | Dribbble | [dribbble.com](https://dribbble.com/) |
| **Prototypage** | Figma | [figma.com](https://www.figma.com/) |

---

## 👥 **Communauté**

### 🌍 **Communauté AtlanticApp**

| Plateforme | Usage | Lien |
|-----------|-------|------|
| **GitHub** | Code source, Issues, PRs | [AtlanticApp Repository](https://github.com/AtlanticApp-dev/Collab-AtlanticApp-mobile) |
| **Instagram** | Annonces, News | [@atlanticup_bzh](https://www.instagram.com/atlanticup_bzh/) |
| **Site Web** | Informations officielles | [atlanticapp.fr](https://www.atlanticapp.fr) |

### 💬 **Communauté React Native**

| Plateforme | Description | Lien |
|-----------|-------------|------|
| **Discord** | Communauté officielle React Native | [Reactiflux](https://www.reactiflux.com/) |
| **Reddit** | Discussions React Native | [r/reactnative](https://www.reddit.com/r/reactnative/) |
| **Twitter** | News et mises à jour | [@ReactNative](https://twitter.com/ReactNative) |
| **Stack Overflow** | Questions/Réponses | [stackoverflow.com](https://stackoverflow.com/questions/tagged/react-native) |

### 🔥 **Communauté Firebase**

| Plateforme | Description | Lien |
|-----------|-------------|------|
| **Stack Overflow** | Questions/Réponses | [stackoverflow.com](https://stackoverflow.com/questions/tagged/firebase) |
| **Google Groups** | Discussions Firebase | [Firebase Google Group](https://groups.google.com/g/firebase-talk) |
| **Twitter** | News et mises à jour | [@Firebase](https://twitter.com/Firebase) |
| **YouTube** | Tutoriels vidéo | [Firebase YouTube](https://www.youtube.com/c/Firebase) |

---

## 🌟 **Inspiration**

### 🏆 **Projets Open Source à Étudier**

| Projet | Description | Lien |
|--------|-------------|------|
| **Expo** | Outilchain React Native | [github.com/expo/expo](https://github.com/expo/expo) |
| **React Navigation** | Navigation pour React Native | [github.com/react-navigation](https://github.com/react-navigation/react-navigation) |
| **React Native Paper** | Composants Material Design | [github.com/callstack/react-native-paper](https://github.com/callstack/react-native-paper) |
| **React Native Firebase** | SDK Firebase pour React Native | [github.com/invertase/react-native-firebase](https://github.com/invertase/react-native-firebase) |
| **WaterMelon** | Framework full-stack React Native | [github.com/Nozbe/WaterMelon](https://github.com/Nozbe/WaterMelon) |

### 🎨 **Design Inspiration**

| Site | Description | Lien |
|------|-------------|------|
| **Dribbble** | Designs inspirants | [dribbble.com](https://dribbble.com/) |
| **Behance** | Projets créatifs | [behance.net](https://www.behance.net/) |
| **Pinterest** | Idées de design | [pinterest.com](https://www.pinterest.com/) |
| **Mobbin** | Designs d'applications mobiles | [mobbin.com](https://mobbin.com/) |

### 📱 **Applications Mobiles Inspirantes**

| Application | Description | Pourquoi c'est intéressant |
|-------------|-------------|-----------------------------|
| **Twitter** | Réseau social | Architecture scalable, performances |
| **Instagram** | Réseau social photo | UI/UX excellente, animations |
| **Spotify** | Streaming musical | Gestion de gros volumes de données |
| **Airbnb** | Location de logements | Design élégant, expérience utilisateur |
| **Discord** | Messagerie vocale/textuelle | Architecture temps réel |

---

## 📌 **Navigation**

```
┌─────────────────────────────────────────────────────────────┐
│                  RESSOURCES SUPPLÉMENTAIRES                    │
├─────────────────────────────────────────────────────────────┤
│  [Tutoriels]  │  [Glossaire]  │  [Changelog]  │  [Premiers Pas]   │
├─────────────────────────────────────────────────────────────┤
│  [Par Technologie]  │  [Communauté]  │  [Inspiration]          │
└─────────────────────────────────────────────────────────────┘
```

**[← Retour à l'accueil](./Home.md) | [FAQ ←](./FAQ.md)**

---

*Dernière mise à jour : 13 juin 2026*
*Continuez à apprendre et à contribuer !* 🚀
