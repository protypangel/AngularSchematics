# Utilité
Permet d'avoir un projet schematics qui possède des schemas personnalisable
## Route
Créer des routes

|Propriété|Utilité|Require|
|---------|-------|:-----:|
|Name|Nom de la route, si arg vide alors la valeur est le first path dans l'url|||
|Path|Path du projet, si arg vide alors il prend le path ou se trouve le fichier package.json|||
|Dynamics|Noms de query et params séparer par "," qui sont dynamics|||
|url|url qui sera pris en charge par la route, il n'y a pas besoin de spécifié le params||**X**|

### Exemple
|Propriété|Commande : [ng g @protypangel/schematics:route ...]|fichiers (sans format)|queries, params, [X=dynamics]
|---------|-|-|-|
|url|/alpha/:p1/:p2?q1=value&q2|/route/alpha/alpha.route|**queries=** q1,q2 **params=** p1,p2|
|Name|/alpha --name=beta|/route/beta/beta.route||
|Path|/alpha --path=toto|/toto/route/alpha/alpha.route||
|Dynamics|/alpha/:p1/:p2?q1=value&q2 --dynamics=p1,q1|/route/alpha/alpha.route|**queries=** q1[X],q2 **params=** p1[X],p2|

# Commande
## Schematics
```shell
## Creer un projet schematics vide
schematics blank --name=[schematic-name]
## Permettre de tester le schema
## Ce positionner au préalable dans le dossier contenant le package.json
schematics .:[schematic-name]
```
## NPM SCRIPT
```shell
## Build
npm run build
## Test
npm run test
## Link, permet de créer un liens symbolique dans npm du projet schematics pour les projets angular
## Copy, sert pour les autres script
## Permet de copier les fichiers necessaire aux schemas dans le dossier dist
npm run copy 
```

# Run schematics dans un projet angular
## Local:
- Besoin de droit admin dans les projets angular et schematic
### Dans le projet schematics
Créer un lien symbolique de npm vers le projet schematic
```shell
npm run link
```
### Dans le projet angular
La commande link va juste créer un lien symbolique dans node_modules vers le projet schematics
```shell
  npm link @protypangel/schematics
  ng generate @protypangel/schematics:route ...
```