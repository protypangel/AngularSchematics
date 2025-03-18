import { RouteDefinition } from "@src/route/RouteDefinition/RouteDefinition";
import { SchemaRoute } from "@src/route/SchemaRoute";
import { DecoratedAdder } from "@src/route/TemplateStrategy/TemplateDecorator";
import { RouteTS } from "@src/route/TemplateStrategy/TemplateFile";
import { Builder } from "./RouteBuilder";

export class RouteTSBuilder extends Builder<RouteTS> {
  
  constructor(protected readonly schema: SchemaRoute, protected readonly routeDefinition: RouteDefinition) {
    super(schema, routeDefinition);
  }
  private generateCustomVariable(key: string, type: string, items: string[]): string {
    if (items.length === 0) return "";
    return `  ${key}: ${type} = {\n` + 
      super.split_join(items, `: "",`, "    ") +
    "\n  };\n";
  }

  private generateInterriorVariables(): { Interfaces: string; Variables: string } {
    const { params, queries } = this.routeDefinition;
    
    const Interfaces = super.generateInterfaces();
  
    return {
      Interfaces: Interfaces.Interfaces,
      Variables: this.generateCustomVariable("params", "Params", params) + this.generateCustomVariable("queries", "Queries", queries),
    };
  }
  private generateStatic(type: string, typeSnapshot: string, items: string[]): string {
    if (items.length === 0) return "";
    items = items.map(key => `this.${type}.${key} = this.route.snapshot.${typeSnapshot}["${key}"];`);
    return super.split_join(items, "", "    ") + "\n";
  }
  private generateConstructorDetection(): string {
    const { statics, dynamics } = this.routeDefinition;
    if (statics.length + dynamics.length === 0) return "";
   
    const staticParams = this.generateStatic("params", "params", statics.params);
    const staticQueries = this.generateStatic("queries", "queryParams", statics.queries);
  
    return `  constructor(private route: ActivatedRoute) {\n${staticParams}${staticQueries}  }`;
  }
  private generateDynamic (container: string, type: string, items: string[]): string {
    if (items.length === 0) return "";
    items = items.map(key => `this.${type}.${key} = ${container}["${key}"];`);
    return `    this.route.${container}.subscribe(${container} => {\n` + 
      super.split_join(items, "", "      ") +
    "\n    });\n";
  }
  private generateOnInit(): string {
    const { dynamics } = this.routeDefinition;
    if (dynamics.length === 0) return "";
  
    const dynamicParams = this.generateDynamic("params", "params", dynamics.params);
    const dynamicQueries = this.generateDynamic("queryParams", "queries", dynamics.queries);
    return `  ngOnInit() {\n${dynamicParams}${dynamicQueries}  }`;
  }

  get build() {
    const { Interfaces, Variables } = this.generateInterriorVariables();
    const construct = this.generateConstructorDetection();
    const onInit = this.generateOnInit();
    const hasOnInit = onInit.length > 0;

    const ImportAndInterfaces = hasOnInit ? 'import { OnInit } from "@angular/core";' + Interfaces : Interfaces;
    const contents = Variables + construct + (construct && onInit ? '\n' : '') + onInit;
    const Implements = hasOnInit ? ' implements OnInit ' : ' ';

    return new RouteTS(this.folderName, ImportAndInterfaces, contents, Implements) as unknown as DecoratedAdder<RouteTS>;
  }
}
