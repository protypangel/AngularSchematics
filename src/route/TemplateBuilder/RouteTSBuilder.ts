import { RouteDefinition } from "@Schema-Route/RouteDefinition/RouteDefinition";
import { SchemaRoute } from "@Schema-Route/SchemaRoute";
import { DecoratedAdder } from "@Schema-Route/TemplateStrategy/TemplateDecorator";
import { RouteTS } from "@Schema-Route/TemplateStrategy/TemplateFile";
import { Builder } from "./RouteBuilder";

export class RouteTSBuilder extends Builder<RouteTS> {
  
  constructor(protected readonly schema: SchemaRoute, protected readonly routeDefinition: RouteDefinition) {
    super(schema, routeDefinition);
  }

  private generateVariables(): { Interfaces: string; Variables: string } {
    const { params, queries } = this.routeDefinition;
    
    const generateCustomVariable = (key: string, type: string, items: string[]): string =>
      items.length ? `  ${key}: ${type} = {\n${this.generateStringTemplate(items, item => `    ${item}: ""`)},\n  };\n` : "";
      const Interfaces = this.generateInterfaces();
  
    return {
      Interfaces: Interfaces.Interfaces,
      Variables: generateCustomVariable("params", "Params", params) + generateCustomVariable("queries", "Queries", queries),
    };
  }
  private generateConstructorDetection(): string {
    const { statics, dynamics } = this.routeDefinition;
    if (statics.length + dynamics.length === 0) return "";
  
    const generateStatic = (type: string, typeSnapshot: string, items: string[]): string =>
      items.length ? this.generateStringTemplate(items, key => `    this.${type}.${key} = this.route.snapshot.${typeSnapshot}["${key}"];`) + "\n" : "";
  
    const staticParams = generateStatic("params", "params", statics.params);
    const staticQueries = generateStatic("queries", "queryParams", statics.queries);
  
    return `  constructor(private route: ActivatedRoute) {\n${staticParams}${staticQueries}  }`;
  }
  private generateOnInit(): string {
    const { dynamics } = this.routeDefinition;
    if (dynamics.length === 0) return "";
  
    const generateDynamic = (container: string, type: string, items: string[]): string =>
      items.length ? `    this.route.${container}.subscribe(${container} => {\n${this.generateStringTemplate(items, key => `      this.${type}.${key} = ${container}["${key}"];`)}\n    });\n` : "";
  
    return `  ngOnInit() {\n${generateDynamic("params", "params", dynamics.params)}${generateDynamic("queryParams", "queries", dynamics.queries)}  }`;
  }

  get build() {
    const { Interfaces, Variables } = this.generateVariables();
    const construct = this.generateConstructorDetection();
    const onInit = this.generateOnInit();
    const hasOnInit = onInit.length > 0;

    const ImportAndInterfaces = hasOnInit ? 'import { OnInit } from "@angular/core";' + Interfaces : Interfaces;
    const contents = Variables + construct + (construct && onInit ? '\n' : '') + onInit;
    const Implements = hasOnInit ? ' implements OnInit ' : ' ';

    return new RouteTS(this.folderName, ImportAndInterfaces, contents, Implements) as unknown as DecoratedAdder<RouteTS>;
  }
}
