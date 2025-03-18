import { RouteDefinition } from "@src/route/RouteDefinition/RouteDefinition";
import { SchemaRoute } from "@src/route/SchemaRoute";
import { DecoratedAdder } from "@src/route/TemplateStrategy/TemplateDecorator";
import { RouteSpecTs } from "@src/route/TemplateStrategy/TemplateFile";
import { Builder } from "./RouteBuilder";

export class RouteSpecTsBuilder extends Builder<RouteSpecTs> {
  constructor(protected readonly schema: SchemaRoute, protected readonly routeDefinition: RouteDefinition) {
    super(schema, routeDefinition);
  }

  get build() {
    return new RouteSpecTs(
      this.folderName, 
      this.schema.url,
      this.generateInterfaces().Imports
    ) as unknown as DecoratedAdder<RouteSpecTs>;
  }
}
