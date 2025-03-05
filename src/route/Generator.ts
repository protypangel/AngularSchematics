import {
  StaticDynamicRouteParams,
  RouteParameters,
  RouteDefinition, BaseRouteParams,
} from "./interface/ParamsQueries";
import {RouteTemplateOutput} from "./interface/Generator";

function generateVariables({params, queries}: BaseRouteParams): RouteTemplateOutput {
  function generateInterface(type: string, array: string[]): string {
    if (array.length === 0) return "";
    return `interface ${type} {\n` +
        `${array.map((param) => `  ${param}: string;`).join("\n")}` +
        `\n}\n`;
  }
  function generateCustomVariable(key: string, type: string, keys: string[]): string {
    if (keys.length === 0) return "";
    return `  ${key}: ${type} = {\n` +
        keys.map((k) => `    ${k}: ""`).join(",\n") +
        `\n  };\n`;
  }
  const InterfaceParams = generateInterface("Params", params);
  const InterfaceQueries = generateInterface("Queries", queries);
  const containAtLeastOneInterface = !!InterfaceParams || !!InterfaceQueries;

  return {
    Interfaces: (containAtLeastOneInterface ? "\n\n" : "") + (InterfaceParams || "") + (InterfaceQueries || ""),
    Variables:
      generateCustomVariable("params", "Params", params) +
      generateCustomVariable("queries", "Queries", queries),
  };
}
//TODO: Optimize because when statics.length == 0, the function should return constructor only
function generateConstructorDetection({
  statics,
  dynamics,
}: StaticDynamicRouteParams): string {
  if (statics.length + dynamics.length === 0) return "";
  function generateStatic (type: string, typeSnapshot: string, keys: string[]) {
    if (keys.length === 0) return "";
    return (
      keys.map((key) => `    this.${type}.${key} = this.route.snapshot.${typeSnapshot}["${key}"];`).join("\n") + "\n"
    );
  }
  const staticParams = generateStatic("params", "params", statics.params);
  const staticQueries = generateStatic("queries", "queryParams", statics.queries);

  return (
    "  constructor(private route: ActivatedRoute) {\n" +
      staticParams + staticQueries +
    "  }"
  );
}
function generateOnInit(dynamics: RouteParameters): string {
  if (dynamics.length === 0) return "";
  function dynamic(container: string, type: string, keys: string[]): string {
    if (keys.length === 0) return "";
    return (
      `    this.route.${container}.subscribe(${container} => {\n` +
      keys
        .map((key) => `      this.${type}.${key} = ${container}["${key}"];`)
        .join("\n") + "\n" +
      "    });\n"
    );
  }
  return (
    "  ngOnInit() {\n" +
    dynamic("params", "params", dynamics.params) +
    dynamic("queryParams", "queries", dynamics.queries) +
    "  }"
  );
}

export function generatorFacade(routeDef: RouteDefinition) {
  const {Interfaces, Variables} = generateVariables(routeDef);
  const construct: string = generateConstructorDetection(routeDef);
  const onInit: string = generateOnInit(routeDef.dynamics);
  const dashLineBetweenConstructAndOnInit: string = !construct || !onInit ? '' : '\n';
  const Import: string = !onInit ? '' : 'import { OnInit } from "@angular/core";';
  return {
    ImportAndInterfaces: Import + Interfaces,
    Contents: Variables + construct + dashLineBetweenConstructAndOnInit + onInit,
    implements: onInit.length > 0 ? ' implements OnInit ' : ' ',
  };
}