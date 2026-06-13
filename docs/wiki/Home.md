# 🏠 Accueil - Wiki AtlanticApp

> *Le guide complet pour contribuer au projet AtlanticApp, conçu pour les débutants en développement mobile.*

---

## 📌 **À propos de ce Wiki**

Ce wiki est conçu pour **tout nouveau collaborateur**, même sans expérience préalable en développement mobile. Il couvre :

✅ **Comprendre le projet** - Contexte, technologies, structure
✅ **Maîtriser le backend Firebase** - Firestore, Auth, Cloud Functions, Messaging
✅ **Développer le frontend** - React Native, Expo, composants clés
✅ **Contribuer efficacement** - Setup, workflow Git, bonnes pratiques
✅ **Résoudre les problèmes** - FAQ, dépannage, exemples concrets

---

## 🚀 **Sommaire**

### [1. 📁 Introduction](#1--introduction)
### [2. 🗂️ Structure du Projet](./Project-Structure.md)
### [3. 🔥 Backend : Firebase](./Backend-Firebase.md)
### [4. 📱 Frontend : React Native](./Frontend-React-Native.md)
### [5. 🛠️ Setup et Développement Local](./Setup.md)
### [6. 🤝 Contribution](./Contribution.md)
### [7. ❓ FAQ / Dépannage](./FAQ.md)
### [8. 📚 Ressources Supplémentaires](./Resources.md)

---

## 1. 📁 **Introduction**

### 🎯 **À quoi sert AtlanticApp ?**

**AtlanticApp** est une application mobile **open-source** développée pour améliorer l'expérience des participants et supporters pendant l'**Atlanticup** - une compétition sportive annuelle réunissant **700 étudiants ingénieurs** organisée par les élèves d'**IMT Atlantique**.

#### 🎯 **Objectifs principaux**

| Objectif | Description |
|----------|-------------|
| 📅 **Suivi des matchs** | Consulter le calendrier, les résultats et le classement en temps réel |
| 🗺️ **Navigation** | Localiser les lieux de compétition via une carte interactive |
| 📊 **Classements** | Voir les rankings par sport, par équipe, général |
| 🔔 **Notifications** | Recevoir des alertes pour les matchs de son école ou sports suivis |
| 🏆 **Expérience utilisateur** | Interface intuitive et adaptée aux besoins des participants |

#### 👥 **Public cible**

- **Participants** à l'Atlanticup (étudiants ingénieurs)
- **Supporters** (autres étudiants, famille, amis)
- **Organisateurs** (équipe IMT Atlantique)

---

### 🛠️ **Technologies Utilisées**

#### **Frontend (Application Mobile)**

| Technologie | Version | Rôle |
|-------------|---------|------|
| **React Native** | 0.83.4 | Framework principal pour les applications mobiles |
| **Expo** | ~55.0.15 | Outilchain pour React Native (simplifie le développement) |
| **Expo Router** | ~55.0.12 | Navigation basée sur le système de fichiers |
| **TypeScript** | ^5.3.3 | Langage typé pour plus de sécurité |
| **React Navigation** | ^7.x | Navigation entre écrans |
| **React Native Paper** | ^5.12.5 | bibliothèque UI Material Design |
| **React Native Firebase** | ^24.0.0 | SDK Firebase pour React Native |

#### **Backend (Services)**

| Technologie | Rôle |
|-------------|------|
| **Firebase Firestore** | Base de données NoSQL en temps réel |
| **Firebase Auth** | Gestion de l'authentification (email/mot de passe) |
| **Firebase Cloud Messaging (FCM)** | Notifications push |
| **Firebase Storage** | Stockage de fichiers (images, etc.) |

#### **Outils & DevOps**

| Outil | Rôle |
|-------|------|
| **GitHub** | Hébergement du code, gestion des issues et PRs |
| **Git** | Versionnement du code |
| **ESLint** | Linting (détection d'erreurs de code) |
| **Prettier** | Formatage automatique du code |
| **Jest** | Tests unitaires |

---

### 🔗 **Liens Utiles**

| Ressource | Lien | Description |
|-----------|------|-------------|
| **Site officiel** | [atlanticapp.fr](https://www.atlanticapp.fr) | Site de la compétition |
| **Instagram** | [@atlanticup_bzh](https://www.instagram.com/atlanticup_bzh/) | Actualités et annonces |
| **Repository GitHub** | [AtlanticApp-dev/Collab-AtlanticApp-mobile](https://github.com/AtlanticApp-dev/Collab-AtlanticApp-mobile) | Code source du projet |
| **Documentation React Native** | [reactnative.dev](https://reactnative.dev/) | Docs officielle RN |
| **Documentation Firebase** | [firebase.google.com](https://firebase.google.com/) | Docs officielle Firebase |
| **Documentation Expo** | [docs.expo.dev](https://docs.expo.dev/) | Docs officielle Expo |

---

## 📖 **Comment utiliser ce Wiki ?**

### 🎯 **Par où commencer ?**

| Votre profil | Recommandation |
|--------------|----------------|
| **Complètement débutant** | Commencez par [Introduction](#1--introduction) → [Setup](./Setup.md) → [Structure du Projet](./Project-Structure.md) |
| **Connaissez React Native** | [Structure du Projet](./Project-Structure.md) → [Frontend](./Frontend-React-Native.md) → [Backend](./Backend-Firebase.md) |
| **Connaissez Firebase** | [Backend](./Backend-Firebase.md) → [Frontend](./Frontend-React-Native.md) → [FAQ](./FAQ.md) |
| **Problème spécifique** | Consultez directement la [FAQ](./FAQ.md) |

### 💡 **Conseils pour apprendre**

1. **Lisez le code** : Le projet est bien structuré et commenté
2. **Testez localement** : Suivez le guide [Setup](./Setup.md) pour faire tourner l'app
3. **Posez des questions** : Utilisez les canaux dédiés (voir [FAQ](./FAQ.md))
4. **Commencez petit** : Corriguez une typo, améliorez un commentaire, ajoutez un test
5. **Documentez** : Si vous apprenez quelque chose, ajoutez-le au wiki !

---

## 🔄 **Navigation**

```
┌─────────────────────────────────────────────────────────────┐
│                     WIKI ATLANTICAPP                           │
├─────────────────────────────────────────────────────────────┤
│  [Accueil]  │  [Structure]  │  [Backend]  │  [Frontend]  │  [Setup]  │
├─────────────────────────────────────────────────────────────┤
│  [Contribution]  │  [FAQ]  │  [Ressources]                      │
└─────────────────────────────────────────────────────────────┘
```

[← Retour au sommet](#)

---

*Dernière mise à jour : 13 juin 2026*
*Contributeurs : Bienvenue ! N'hésitez pas à améliorer ce wiki.*
