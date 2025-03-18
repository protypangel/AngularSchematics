import {
  DecoratedAdder,
  Option,
} from "@src/route/TemplateStrategy/TemplateDecorator";
import {
  RouteSpecTs,
  RouteTemplate,
  RouteTS,
  TypeofRouteTemplate,
  Default,
} from "@src/route/TemplateStrategy/TemplateFile";
import { SchemaRoute } from "@src/route/SchemaRoute";
import { RouteDefinition, RouteDefinitionFacade } from "@src/route/RouteDefinition/RouteDefinition";
import { RouteTSBuilder } from "@src/route/TemplateBuilder/RouteTSBuilder";
import { RouteSpecTsBuilder } from "@src/route/TemplateBuilder/RouteSpecTsBuilder";
import { Builder } from "@src/route/TemplateBuilder/RouteBuilder";

class DefaultTemplateBuilder extends Builder<Default> {
  private template: Default;
  private option: Option;
  constructor(schema: SchemaRoute, routeDefinition: RouteDefinition) {
    super(schema, routeDefinition);
    this.template = new Default(this.folderName);
    this.option = {
      name: ""
    };
  }
  get build() {
    const template = this.template;
    const option = this.option;
    return {
      Template(): Default {
        return template;
      },
      Option(): Option {
        return option;
      }
    };
  }
}

export function TemplateFileFactory(schema: SchemaRoute) {
  // Initialisation unique des données partagées pour cette génération
  const routeDefinition = RouteDefinitionFacade(
    schema.url,
    schema.dynamics?.split(",") ?? []
  );

  const routeTSDecorator = new RouteTSBuilder(schema, routeDefinition).build;
  const routeSpecTsDecorator = new RouteSpecTsBuilder(schema, routeDefinition).build;
  const defaultTemplate = new DefaultTemplateBuilder(schema, routeDefinition).build;
  // On utilise une simple closure pour partager les données
  return function templateBuilder(
    Constructor: TypeofRouteTemplate | typeof Default
  ): DecoratedAdder<RouteTemplate | Default> {
    switch (Constructor.prototype) {
      case RouteTS.prototype:
        return routeTSDecorator;
      case RouteSpecTs.prototype:
        return routeSpecTsDecorator;
      default:
        return defaultTemplate;
    }
  };
}
