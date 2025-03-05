# A savoir

## Créer un nouveau schema
`schematics blank --name=[name]`

## Pour tester le schema
Lancer dans un première invité de commande
```shell
  npm run build:watch
```

Dans un autre invité de commande, deplacer vous déja dans le repertoire _[name]_ contenant le _package.json_ du schematics, puis taper : `schematics .:[name]`

## Lancer les tester
```shell
  npm run test
```

## Pour mettre le projet en local npm
### A savoir :
- Besoin de droit admin
- La commande link va juste créer un lien symbolique vers le projet, donc si le projet est supprimé, le lien ne fonctionnera plus
```shell
  npm run build
  npm link
```

## Pour utiliser le schema via le publish local
### A savoir :
- Besoin de droit admin
- La commande link va juste créer un lien symbolique dans node_modules vers le projet, donc si le projet est supprimé, le lien ne fonctionnera plus
```shell
  npm link @protypangel/schematics
  ng generate @protypangel/schematics:route ...
```