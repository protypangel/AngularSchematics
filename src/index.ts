import { Path, strings } from "@angular-devkit/core";
import {
  apply,
  Rule,
  SchematicContext,
  Tree,
  url,
  template,
  mergeWith,
  move,
  chain,
  source
} from "@angular-devkit/schematics";
import { SchemaRoute } from "@src/route/SchemaRoute";
import { TemplateStrategy } from "@src/route/TemplateStrategy/TemplateStrategy";
import { Observable } from "rxjs";

export function route(options: SchemaRoute): Rule {
  const routeTemplateStrategy = new TemplateStrategy(options);

  return (tree: Tree, _context: SchematicContext) => {
    const projectPath = (options.path || tree.root.path) + "/route";
    const sourceTemplate = url("../../templates/route");
    
    // Créer une source pour un seul fichier
    const createSingleFileSource = (content: Buffer, path: string): Tree => {
      const tree = Tree.empty();
      tree.create(path, content);
      return tree;
    };

    return apply(
      sourceTemplate,
      [
        (tree: Tree, context: SchematicContext) => {
          const rules: Rule[] = [];
          
          tree.visit(path => {
            const content = tree.read(path);
            if (content) {
              const singleFileTree = createSingleFileSource(content, path);
              tree.delete(path);
              rules.push(
                mergeWith(
                  apply(source(singleFileTree), [
                    template(routeTemplateStrategy.getTemplateConfigFromUrl(path)),
                    move(projectPath)
                  ])
                )
              );
            }
          });

          return chain(rules)(tree, context);
        }
      ]
    )(_context);
  };
}
