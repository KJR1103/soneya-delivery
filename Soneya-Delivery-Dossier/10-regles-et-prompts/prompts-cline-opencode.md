# Prompts pour Cline et OpenCode

## A. Prompt commun (à coller au début de chaque tâche)
Projet : Soneya Delivery (React + Vite + TypeScript, Windows 10, PowerShell). Une seule application et un seul site web,
trois comptes publics (Client, Entreprise, Livreur) et un espace interne Control (web). Un compte = un seul rôle.

Avant de modifier quoi que ce soit :
1. `git status`, `git branch --show-current`, `git log -5 --oneline`. Travaille sur ta branche dédiée, jamais sur main.
2. Lis le dépôt (routes, composants, services, types) et ces fichiers : 01-identite-et-charte/charte-design-soneya-v2.txt,
   10-regles-et-prompts/regles-soneya.md, 08-animations/motion.css, 09-contenu-long/content.css.
3. Ne supprime aucune fonctionnalité existante. Ne présente jamais une maquette comme fonctionnelle.
4. Données d'exemple clairement séparées, derrière une interface propre pour brancher le backend (Supabase) plus tard.
5. Aucun secret, clé API ou mot de passe dans le dépôt.
6. Commandes compatibles PowerShell uniquement (pas de `> /dev/null`).

Exigences sur chaque écran : charte v2 respectée, responsive dès 360 px (menu latéral et tableaux sur ordinateur), états chargement / vide /
erreur / hors ligne, animations de motion.css, aucun débordement de texte (noms de 120 caractères, mots de 60 lettres, milliers de produits),
accessibilité (contrastes, zones tactiles de 44 px, réduction des animations).

Livrable : composants réutilisables dans le dossier partagé, thème centralisé (couleurs, espacements, typographie), petits commits explicites,
liste des fichiers modifiés. Ensuite : lance le projet, fais une capture à 360 px et une sur ordinateur, compare-la à l'image de référence.

## B. Prompt par écran (modèle)
« Implémente l'écran [NOM] de l'espace [ESPACE] en reproduisant l'image [CHEMIN DE L'IMAGE]. Utilise les composants partagés. Ne touche pas aux
autres écrans. Respecte le prompt commun. »

## C. Ordre de travail recommandé (une branche par lot)
1. Fondations : thème (charte v2), motion.css, content.css, composants de base (bouton, carte, champ, puce, feuille du bas, navigation, squelette).
2. Démarrage : Welcome.tsx, ConsentGate.tsx, connexion, choix du type de compte, inscription par rôle.
3. Client : accueil, recherche, fiche commerce, fiche plat, panier, paiement, suivi, discussion, commandes, profil, Mes données.
4. Entreprise (téléphone puis ordinateur) : inscription, tableau de bord, commandes, catalogue, stock, finances, équipe, paramètres.
5. Livreur : inscription, journée, mission, collecte, navigation, remise, gains, carte, profil.
6. Support : centre d'aide et tickets dans chaque espace, puis file de tickets dans Control.
7. Control (web) : vue d'ensemble, commerces, clients, livreurs, commandes, finances, paramètres, sécurité et journal.
8. Backend : comptes et rôles, base de données, temps réel, paiements mobiles, chat et appels, notifications, stockage des consentements.

## D. Points à NE PAS inventer (à valider par Soneya avant la production)
Pourcentages de commission, tarifs au kilomètre, frais minimum et supplément nuit, règles fiscales, durées de conservation des données,
délais de réponse du support, numéros de contact, activation des paiements en espèces.
