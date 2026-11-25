# Soneya Delivery : règles obligatoires pour toute l'application
Version 1 · 22 novembre 2026. À lire par toutes les IA de code avant chaque tâche.

## 1. Animations dans toute l'application
- Un seul système : `motion.css` (durées 150, 250, 400 ms ; mouvement doux ; pas de rebond excessif).
- Chaque espace (Client, Entreprise, Livreur, Control) l'utilise. Aucune animation inventée à côté.
- Obligatoire : page d'accueil animée (`Welcome.tsx`), apparition des écrans (`m-reveal`), listes en cascade (`m-stagger`), squelettes à la place des roues (`m-skeleton`), feuilles du bas (`m-sheet`), appui sur bouton (`m-press`), succès avec coche dessinée (`m-check`), nouvelle commande qui pulse (`m-pulse`).
- Listes très longues : la cascade est plafonnée aux 10 premiers éléments, pour ne jamais ralentir.
- Respect du réglage « réduire les animations » du téléphone (déjà géré dans `motion.css`).
- On n'anime que `transform` et `opacity` (fluide sur téléphones modestes et sur PC 8 Go).

## 2. Milliers de produits : rien ne déborde
Règles de mise en page (`content.css`) :
1. Tout élément dans une ligne ou une grille a `min-width: 0`. Sans cela, le texte déborde.
2. Noms de produits : 2 lignes maximum, puis « … » (`t-2`). Le nom complet reste dans `title` et sur la fiche.
3. Descriptions : 2 lignes dans les listes ; sur la fiche, 4 lignes puis « Voir plus » qui déplie avec animation.
4. Mots très longs ou sans espace : coupés automatiquement (`overflow-wrap: anywhere`).
5. Prix : jamais coupés, jamais à la ligne (`price`), format `35 000 GNF`.
6. Images : ratio carré fixe, chargement différé, fond gris pendant le chargement. Jamais déformées.
7. Grille : colonnes automatiques, jamais plus étroites que 150 px (360 px d'écran = 2 colonnes).
8. Aucune liste n'affiche tout d'un coup : défilement infini par pages de 24 (`ProductGrid`), skeletons, état vide, état erreur avec « Réessayer ».
9. Recherche, filtres (catégorie, disponibilité, prix) et tri toujours présents quand il y a plus de 50 produits.
10. Espace Entreprise sur ordinateur : tableau paginé (50 par page), sélection multiple, actions groupées (prix, disponibilité), import CSV ou Excel, export.
11. Côté serveur : pagination obligatoire (jamais « tous les produits »), index de recherche, limites de taille sur noms (120 caractères) et descriptions (2 000 caractères), avec compteur pendant la saisie.
12. À tester avant validation : nom de 120 caractères, mot de 60 lettres sans espace, description de 2 000 caractères, 12 000 produits, 360 px de large, texte système agrandi.

## 3. Support Soneya Delivery dans chaque espace
Bouton « Aide et support » visible dans le profil ou le menu de chaque espace.
- **Client :** centre d'aide (commande, paiement, livraison, compte), questions fréquentes, discussion avec le support, ticket lié à une commande, appel.
- **Entreprise :** commandes, paiements et versements, catalogue, compte ; liste des tickets avec statut ; ligne prioritaire partenaires.
- **Livreur :** bouton Urgence (accident, agression) en tête, problème de mission, client injoignable, gains, compte.
- **Control :** file de tickets (filtre par type de demandeur, priorité, assigné, délai), conversation, actions (assigner, escalader, résoudre).
- Chaque ticket garde : numéro, demandeur, commande liée, historique, statut. Numéros et délais de réponse : à définir par Soneya.

## 4. Confidentialité, données et consentement
**Avant toute utilisation** (inscription, et nouvelle acceptation à chaque nouvelle version) : écran bloquant `ConsentGate`.
- Documents à lire : Conditions d'utilisation, Politique de confidentialité, Utilisation des données.
- Cases à cocher non pré-cochées : acceptation des conditions et de la politique (obligatoires) ; offres et promotions (facultatif).
- Enregistrement côté serveur : identifiant du compte, version, date et heure, type de consentement. Jamais seulement sur le téléphone.
- Autorisations demandées au moment utile, avec une phrase d'explication : position (pendant une livraison), notifications, appareil photo (ordonnance, documents, photo de remise), micro (note vocale).
- Profil, « Mes données » : copie de mes données, mes consentements (retirer à tout moment), lire les documents, suppression du compte dans l'application.
- Espace Entreprise et Livreur : conditions spécifiques (partenaire, livreur) acceptées à l'inscription, en plus des documents généraux.
- Version web : mêmes documents, bannière pour les cookies et traceurs non essentiels.
- Ne jamais collecter plus que nécessaire. Pièces d'identité et documents des livreurs et commerçants : accès limité aux personnes habilitées, journalisé.

### Documents à rédiger (à faire relire par un juriste guinéen avant publication)
1. Conditions générales d'utilisation (Client)
2. Conditions partenaires (Entreprise)
3. Conditions livreurs
4. Politique de confidentialité
5. Utilisation des données (quelles données, pourquoi, avec qui, combien de temps, droits)
6. Politique cookies et traceurs (web)
7. Politique de remboursement, annulation et litiges
8. Mentions légales (identité de la société, contact)

Informations à fournir pour les rédiger : nom légal de la société, adresse, contact pour les données, durées de conservation, sous-traitants (hébergement, paiement, SMS, cartes).

### Cadre légal
La protection des données en Guinée relève de la loi L/2016/037/AN sur la cybersécurité et la protection des données à caractère personnel. La loi L/2016/035/AN sur les transactions électroniques encadre aussi la publicité numérique. Les boutiques d'applications exigent une politique de confidentialité accessible et la possibilité de supprimer son compte dans l'application (à vérifier sur les pages officielles d'Apple et de Google au moment de publier). Ce document n'est pas un avis juridique.
