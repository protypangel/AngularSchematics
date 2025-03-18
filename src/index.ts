import { join, Path, strings } from "@angular-devkit/core";
import {
  apply,
  Rule,
  SchematicContext,
  Tree,
  url,
  template,
  chain,
  EmptyTree,
  source,
  Source,
  mergeWith,
  move
} from "@angular-devkit/schematics";
import { SchemaRoute } from "@src/route/SchemaRoute";
import { TemplateStrategy } from "@src/route/TemplateStrategy/TemplateStrategy";

/**
 * Create a custom tree for each path
 * @param context The schematic context
 * @param options.path The path of the file to create
 * @param options.routeTemplateStrategy The route template strategy
 * @returns A custom tree for each path
 */
function createACustomTreeForEachPath(
  context: SchematicContext,
  tree: Tree,
  {
    path, 
    routeTemplateStrategy
  }: {
    path: string;
    routeTemplateStrategy: TemplateStrategy
  }
): Source {
  const templateRule = { ...routeTemplateStrategy.getTemplateConfigFromUrl(path), ...strings};

  const customTree: Tree =  new EmptyTree();
  customTree.create(path, tree.read(path) || "");

  return apply(
    source(customTree),
    [
      template(templateRule),
    ]
  );
}

export function route(options: SchemaRoute): Rule {
  const routeTemplateStrategy = new TemplateStrategy(options);

  return (_tree: Tree, _context: SchematicContext) => {
    const rootPath = (options.path || _tree.root.path);
    const rootPathVerify = [".", "/"].includes(rootPath) ? "" : rootPath;
    const projectPath = `${rootPathVerify}/route`;

    return apply(
      url("../templates/route"),
      [
        // Create a custom tree for each path and add it to the custom source
        (tree: Tree, context: SchematicContext) => {
          let customSource: Source = source(new EmptyTree());
          tree.visit(path => {
            const newNodetree = createACustomTreeForEachPath(context, tree,{path, routeTemplateStrategy});
            // Add the new node to the custom source
            customSource = apply(
              customSource,
              [
                mergeWith(newNodetree),
              ]
            );
          });
          return customSource(_context);
        },
        move(projectPath)
      ]
    )(_context);
  };
}
