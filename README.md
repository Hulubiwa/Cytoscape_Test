# 🚀 Projet Cytoscape Angular

Ce projet est une application **Angular** permettant de visualiser et manipuler des graphes d'ontologies via **Cytoscape.js**.  
Elle inclut une interface de recherche et des interactions riches sur les nœuds et les arêtes.

---

## ✨ Fonctionnalités

- **Affichage dynamique d'ontologies**  
  Chargement d'un fichier JSON (`ontology.json`) décrivant les classes et relations.  
  Génération automatique des éléments du graphe.

- **Mise en forme personnalisée**  
  Styles spécifiques pour les nœuds et les arêtes :  
  - Équivalence (`≡`)  
  - Héritage (`inherits`)  
  - Disjonction (`disjoint`)  
  Clignotement visuel lors de la recherche.

- **Recherche**  
  Par **nom** ou **ID**.  
  Recentre et zoome automatiquement sur l'élément trouvé.

- **Dialogues interactifs**  
  Double-clic sur un nœud : ouverture d'un dialogue d'informations.  
  Double-clic sur une arête : édition du type de relation ou suppression.

- **Mise en page automatique**  
  Layout basé sur `cose-bilkent`.

---

## 🧩 Technologies utilisées

- [Angular](https://angular.io/)
- [Cytoscape.js](https://js.cytoscape.org/)
- [cytoscape-cose-bilkent](https://github.com/cytoscape/cytoscape.js-cose-bilkent)
- [Angular Material](https://material.angular.io/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## ⚙️ Prérequis

- Node.js >= 18.x
- npm
- Docker
- Docker Compose

---

## 📥 Installation

Clonez le dépôt :

\`\`\`bash
git clone <URL_DE_VOTRE_DEPOT>
cd <nom_du_dossier>
\`\`\`

Installez les dépendances npm :

\`\`\`bash
npm install
\`\`\`

---

## 🛠️ Build de l'application

Générez la version de production d'Angular :

\`\`\`bash
npm run build
\`\`\`

Le build sera disponible dans :

\`dist/projet-cytoscape/\`

---

## 🐳 Utilisation avec Docker Compose

> **💡 Conseil** : vérifiez que votre \`docker-compose.yml\` est bien configuré (exemple ci-dessous).

### Exemple \`docker-compose.yml\`

\`\`\`yaml
version: "3.9"

services:
  angular-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    container_name: projet-cytoscape
\`\`\`

---

### 📦 Construction de l'image

Depuis la racine du projet :

\`\`\`bash
docker compose build
\`\`\`

---

### ▶️ Démarrage de l'application

\`\`\`bash
docker compose up
\`\`\`

L'application est accessible sur :

\`http://localhost:8080\`

---

### 🛑 Arrêt du conteneur

\`\`\`bash
docker compose down
\`\`\`

---

## 🧭 Commandes principales

| Action                          | Commande                                       |
|---------------------------------|------------------------------------------------|
| Installation des dépendances    | \`npm install\`                                  |
| Build Angular                   | \`npm run build\`                                |
| Build de l'image Docker         | \`docker compose build\`                         |
| Lancer le conteneur             | \`docker compose up\`                            |
| Arrêter le conteneur            | \`docker compose down\`                          |

---

## 📁 Structure du projet

\`\`\`
src/
  app/
    graph/           # Composant principal du graphe
    node-dialog/     # Composant de dialogue des nœuds
    edge-dialog/     # Composant de dialogue des arêtes
assets/
  ontology.json      # Ontologie chargée au démarrage
Dockerfile           # Build de l'image Nginx
docker-compose.yml   # Orchestration du conteneur
\`\`\`

---

## ✨ Exemple d'utilisation

- **Rechercher un nœud par nom ou ID** depuis l'interface.
- **Double-cliquer** sur un nœud ou une arête pour afficher ou modifier ses propriétés.
- **Supprimer** une arête en choisissant \`NONE_TYPE\` dans le dialogue.

---

## 📝 Licence

Ce projet est distribué sous licence MIT.  
Vous pouvez l'utiliser, le modifier et le redistribuer librement.

---

## 💡 Auteur

Projet développé par **[Votre Nom ou Organisation]**.

---

## 🙌 Contributions

Les contributions sont les bienvenues !  
N'hésitez pas à ouvrir une issue ou une pull request.