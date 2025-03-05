import {
  apply,
  Rule,
  SchematicContext,
  Tree,
  url,
  template,
  mergeWith,
  move,
} from "@angular-devkit/schematics";
import { SchemaRoute } from "@src/Route/SchemaRoute";
import { TemplateStrategy } from "@src/Route/TemplateStrategy/TemplateStrategy";

export function route(options: SchemaRoute): Rule {
  const routeTemplateStrategy = new TemplateStrategy(options);
  // const staticAndDynamic = getStaticAndDynamicFacade(
  //   options.url,
  //   (options.dynamics || "").split(",")
  // );
  return (tree: Tree, _context: SchematicContext) => {
    const projectPath = (options.path || tree.root.path) + "/route";

    // Créer le template avec ses propres infos personalisé
    const sourceFiles = apply(url("../templates/route"), [
      (entry: Tree) => {
        entry.visit((filePath) => {
          const content = entry.read(filePath);
          const templateConfig =
            routeTemplateStrategy.getTemplateConfigFromUrl(filePath);
          if (content) {
            const transformedContent = template(templateConfig)(
              entry,
              _context
            );
            const treeResult = transformedContent as Tree;
            const result = treeResult.read(filePath);
            entry.overwrite(filePath, result ? result.toString() : "");
          }
        });
        return entry;
      },
      move(projectPath),
    ]);

    tree = mergeWith(sourceFiles)(tree, _context) as Tree;
    return tree;
  };
}
