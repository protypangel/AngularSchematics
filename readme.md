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