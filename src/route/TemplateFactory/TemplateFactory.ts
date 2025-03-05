import {
  DecoratedAdder,
} from "@Schema-Route/TemplateStrategy/TemplateDecorator";
import {
  RouteSpecTs,
  RouteTemplate,
  RouteTS,
  TypeofRouteTemplate,
} from "@Schema-Route/TemplateStrategy/TemplateFile";
import { SchemaRoute } from "@Schema-Route/SchemaRoute";
import { RouteDefinitionFacade } from "@Schema-Route/RouteDefinition/RouteDefinition";
import { RouteTSBuilder } from "@Schema-Route/TemplateBuilder/RouteTSBuilder";
import { RouteSpecTsBuilder } from "@Schema-Route/TemplateBuilder/RouteSpecTsBuilder";

export function TemplateFileFactory(schema: SchemaRoute) {
  // Initialisation unique des données partagées pour cette génération
  const routeDefinition = RouteDefinitionFacade(
    schema.url,
    schema.dynamics?.split(",") ?? []
  );

  const routeTSDecorator = new RouteTSBuilder(schema, routeDefinition).build;
  const routeSpecTsDecorator = new RouteSpecTsBuilder(schema, routeDefinition).build;
  // On utilise une simple closure pour partager les données
  return function templateBuilder(
    Constructor: TypeofRouteTemplate
  ): DecoratedAdder<RouteTemplate> {
    switch (Constructor) {
      case RouteTS:
        return routeTSDecorator;
      case RouteSpecTs:
        return routeSpecTsDecorator;
      default:
        throw new Error("Type de constructeur non supporté");
    }
  };
}
