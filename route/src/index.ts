import {
  apply,
  Rule,
  SchematicContext,
  Tree,
  url,
  template,
  mergeWith, move,
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { Schema } from "./schema";
import { getStaticAndDynamicFacade } from "./ParamsQueries";
import { generatorFacade } from "./generator";

function getNameFromPath(path: string): string {
  if (path.startsWith("/")) {
    path = path.substring(1);
  }
  return (path.split("/")[0] || "").split("?")[0];
}

export function route(options: Schema): Rule {
  const staticAndDynamic = getStaticAndDynamicFacade(
    options.url,
    (options.dynamics || "").split(",")
  );
  const folderName = options.name || getNameFromPath(options.url);

  return (tree: Tree, _context: SchematicContext) => {
    const projectPath = (options.path || tree.root.path) + "/route";

    // Créer le fichier TypeScript avec templating
    const templateTS = apply(url("../files"), [
      template({
        ...strings,
        folderName,
        ...generatorFacade(staticAndDynamic)
      }),
      move(projectPath)
    ]);

    tree = mergeWith(templateTS)(tree, _context) as Tree;
    return tree;
  };
}
