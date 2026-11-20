iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii

# Soneya Delivery — Refonte visuelle 2.0

Cette version conserve l'architecture React + TypeScript + Vite et les composants métier existants. La refonte porte sur le système visuel, les largeurs responsive, la page d'entrée et l'identité graphique propre à chaque espace.

## Les quatre espaces

| Espace | URL locale | Composant principal | Usage |
|---|---|---|---|
| Client | `/client` | `src/components/client/ClientHome.tsx` | Découverte, recherche, panier, commandes et suivi |
| Rider / Livreur | `/livreur` | `src/components/courier/CourierView.tsx` | Missions, disponibilité, suivi GPS navigateur, revenus et dossier |
| Business / Partenaire | `/partenaire` | `src/components/partner/PartnerDashboard.tsx` | Commandes, catalogue, stock, partage et services |
| Admin / Control | `/admin` | `src/components/admin/AdminDashboard.tsx` | Pilotage, finances, partenaires, livreurs et vérification KYC |

La page `/` est le portail de sélection des quatre espaces.

## Direction artistique

- Base commune : typographie Manrope / DM Sans, surfaces claires, bordures discrètes, contrastes accessibles et responsive mobile-first.
- Client : vert Soneya, parcours commercial simple et chaleureux.
- Rider : bleu opérationnel pour distinguer les missions et la navigation.
- Business : accent olive pour l'espace de gestion commerciale.
- Admin : vert profond / graphite pour l'espace de supervision.
- Les espaces partagent les composants et le système de design, mais ont des routes et des accents distincts.

## Fichiers modifiés

- `src/index.css` : système visuel global, règles responsive, styles distincts par espace.
- `src/App.tsx` : titres de page selon la route, sans changer le routage existant.
- `src/components/admin/AdminDashboard.tsx` : ouverture par défaut sur le tableau de pilotage.

Les écrans métier client, livreur et partenaire sont conservés afin de ne pas casser leurs interactions existantes.

## Lancer le projet sur Windows

1. Décompresser l'archive.
2. Installer Node.js LTS si nécessaire.
3. Ouvrir un terminal dans le dossier du projet.
4. Exécuter :

```bash
npm install
npm run lint
npm run build
npm run dev
```

Vite affiche ensuite l'adresse locale à ouvrir dans le navigateur.

## Important avant une mise en production

Cette refonte ne crée pas de backend. Le projet contient encore des données locales/de démonstration et des simulations pour certains parcours (authentification OTP, paiement, statistiques et synchronisation). Les quatre URL ne constituent pas à elles seules une sécurité d'accès : il faudra connecter une authentification serveur et des règles d'autorisation par rôle avant d'exposer les espaces réels. Ne pas publier l'accès Admin en libre-service.

Supabase n'est volontairement pas configuré dans cette livraison.
