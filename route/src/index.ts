import {
  apply,
  Rule,
  SchematicContext,
  Tree,
  url,
  template,
  move,
  mergeWith,
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";

interface StaticDynamic {
  statics: ParamsQueries;
  dynamics: ParamsQueries;
}
interface ParamsQueries {
  params: string[];
  queries: string[];
  length: number;
}
type ParamQueryInArray = [string[], string[]];

function getParamsAndQuery(path: string): ParamQueryInArray {
  const match = path.match(/:(\w+)/g);
  const queries = path.split("?")[1];

  return [
    match ? match.map((param) => param.slice(1)) : [],
    queries ? queries.split("&") : [],
  ];
}

function getDynamicsParamsAndQueries(
  dynamicsKey: string[],
  [params, queries]: ParamQueryInArray
): StaticDynamic {
  const dynamicsParams = dynamicsKey.filter((key) => params.includes(key));
  const dynamicsQueries = dynamicsKey.filter((key) => queries.includes(key));

  return {
    dynamics: {
      params: dynamicsParams,
      queries: dynamicsQueries,
      length: dynamicsParams.length + dynamicsQueries.length,
    },
    statics: {
      params: params.filter((param) => !dynamicsParams.includes(param)),
      queries: queries.filter((query) => !dynamicsQueries.includes(query)),
      length:
        params.length +
        queries.length -
        dynamicsParams.length -
        dynamicsQueries.length,
    },
  };
}

function generateOnInit(dynamics: ParamsQueries): string {
  if (dynamics.length == 0) return "";
  return `ngOnInit() {
    this.route.params.subscribe(params => {
      ${dynamics.params
        .map((param) => `this.${param} = params["${param}"];`)
        .join("\n")}
    });
    this.route.queryParams.subscribe(query => {
      ${dynamics.queries
        .map((query) => `this.${query} = query["${query}"];`)
        .join("\n")}
    });
  }`;
}

function generateConstructorDetection({
  statics,
  dynamics,
}: StaticDynamic): string {
  if (statics.length + dynamics.length == 0) return "";

  return `constructor(private route: ActivatedRoute) {
    ${statics.params
      .map((param) => `this.${param} = this.route.snapshot.params["${param}"];`)
      .join("\n")}
    ${statics.queries
      .map(
        (query) =>
          `this.${query} = this.route.snapshot.queryParams["${query}"];`
      )
      .join("\n")}
  }`;
}

export function route(_options: any): Rule {
  const { dynamics, statics } = getDynamicsParamsAndQueries(
    _options.dynamics || [],
    getParamsAndQuery(_options.path)
  );

  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.info(`Création des fichiers pour ${_options.name}`);

    // Créer le fichier TypeScript avec templating
    const templateTS = apply(url("../files"), [
      template({
        ...strings,
        name: _options.name,
        foldername: _options.name,
        implementsOnInitDetection: dynamics.length > 0,
        ConstructorDetection: generateConstructorDetection({
          statics,
          dynamics,
        }),
        OnInitDetection: generateOnInit(dynamics),
      }),
    ]);

    tree = mergeWith(templateTS)(tree, _context) as Tree;
    return tree;
  };
}
