# Soneya Delivery : dossier complet de conception
Version du 22 novembre 2026. Une application, un site web, trois comptes publics (Client, Entreprise, Livreur) et un espace interne Control.

## Contenu du dossier
```
Soneya-Delivery-Dossier/
├── 00-lisez-moi/               ce fichier
├── 01-identite-et-charte/      icône de l'application (PNG 1024 px et aperçu arrondi), charte de design v2
├── 02-espace-client/           7 images : connexion jusqu'au profil (14 écrans)
├── 03-espace-entreprise/
│   ├── mobile/                 5 images (10 écrans) sur téléphone
│   └── web/                    7 images sur ordinateur (tableau de bord, commandes, catalogue, stock, finances, équipe, catalogue massif)
├── 04-espace-livreur/          5 images : inscription jusqu'au profil (10 écrans)
├── 05-espace-admin-control/    8 images sur ordinateur (vue d'ensemble, commerces, clients, livreurs, commandes, finances, paramètres, sécurité)
├── 06-support/                 3 images : support Client, Entreprise, Livreur et file de tickets Control
├── 07-confidentialite/
│   ├── images/                 2 images : acceptation, utilisation des données, autorisations, Mes données
│   └── code/ConsentGate.tsx    écran d'acceptation bloquant (React)
├── 08-animations/              page d'accueil animée (Welcome.tsx, welcome.css, aperçu HTML) et motion.css (système d'animation commun)
├── 09-contenu-long/            règles anti-débordement (content.css), ProductCard.tsx et défilement infini, image d'exemple
└── 10-regles-et-prompts/       règles obligatoires, inventaire des écrans (ECRANS.md), prompts pour Cline et OpenCode
```
Toutes les images sont en 3840×2160 (4K). Le fichier ECRANS.md indique quelle image montre quel écran.

## Comment s'en servir
1. Ouvre 10-regles-et-prompts/prompts-cline-opencode.md : colle le prompt commun puis le prompt de l'écran voulu.
2. Donne à l'IA de code l'image de référence correspondante, la charte v2, motion.css et content.css.
3. Travaille un écran à la fois, sur ta branche, puis compare ta capture (360 px et ordinateur) à l'image.

## État réel : ce qui est fait et ce qui reste
FAIT
- Maquettes visuelles de l'application complète (environ 80 écrans), icône, charte v2.
- Page d'accueil animée, système d'animation, règles anti-débordement, composants de départ (ProductCard, ConsentGate).
- Règles produit : support dans chaque espace, confidentialité et consentement, liste des documents juridiques à rédiger.

PAS ENCORE FAIT
- L'application elle-même : ce sont des images et des composants de départ, pas une application qui fonctionne. Il reste à coder chaque écran.
- Le backend : comptes et rôles, base de données (Supabase non configuré), temps réel, notifications, chat, appels, paiements Orange Money et MTN MoMo (clés, webhooks, tests, rapprochement).
- Les textes juridiques (conditions d'utilisation, politique de confidentialité, etc.) : à rédiger et à faire relire par un juriste guinéen.
- Les décisions métier : commissions, tarifs au kilomètre, frais, durées de conservation, délais et numéros du support.
- Les vraies photos de produits en haute résolution, et le nom de domaine.

## Précautions
- Noms, prix, chiffres et avis dans les images sont des exemples. Les crochets [ ] marquent les valeurs à définir.
- Les photos des maquettes viennent du web, sont petites (certaines 225 px) et de licence incertaine : à remplacer par tes propres photos avant toute publication.
- Les polices des images sont DM Sans (Manrope n'était pas disponible pour le rendu).
- Cadre légal à vérifier avec un juriste : loi L/2016/037/AN (cybersécurité et protection des données) et loi L/2016/035/AN (transactions électroniques). Ce dossier n'est pas un avis juridique.
