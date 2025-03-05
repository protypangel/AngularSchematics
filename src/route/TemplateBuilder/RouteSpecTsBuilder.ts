import { RouteDefinition } from "@Schema-Route/RouteDefinition/RouteDefinition";
import { SchemaRoute } from "@Schema-Route/SchemaRoute";
import { DecoratedAdder } from "@Schema-Route/TemplateStrategy/TemplateDecorator";
import { RouteSpecTs } from "@Schema-Route/TemplateStrategy/TemplateFile";
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
