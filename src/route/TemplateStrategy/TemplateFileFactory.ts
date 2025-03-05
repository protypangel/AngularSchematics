import {
  DecoratedAdder,
  DecoratedConstructor,
} from "@src/Route/TemplateStrategy/TemplateDecorator";
import {
  RouteSpecTs,
  RouteTemplate,
  RouteTS,
  TypeofRouteTemplate,
} from "@src/Route/TemplateStrategy/TemplateFile";
import { SchemaRoute } from "@src/Route/SchemaRoute";
import { RouteDefinitionFacade } from "@src/Route/RouteDefinition/RouteDefinition";
import { RouteDefinition } from "@src/Route/RouteDefinition/RouteDefinition";

export function TemplateFileFactory(
  schema: SchemaRoute
): (Constructor: TypeofRouteTemplate) => DecoratedAdder<RouteTemplate> {
  const routeDefinition = RouteDefinitionFacade(
    schema.url,
    schema.dynamics?.split(",") ?? []
  );
  return (Constructor: TypeofRouteTemplate) =>
    TemplateFileBuilderStrategy(schema, routeDefinition, Constructor);
}
function TemplateFileBuilderStrategy<T>(
  schema: SchemaRoute,
  routeDefinition: RouteDefinition,
  Constructor: TypeofRouteTemplate
): DecoratedAdder<RouteTemplate> {
  switch (Constructor) {
    case RouteTS:
      return new RouteTS(
        "",
        "",
        "",
        ""
      ) as unknown as DecoratedAdder<RouteTS>;
    case RouteSpecTs:
      return new RouteSpecTs(
        "",
        "",
        "",
        ""
      ) as unknown as DecoratedAdder<RouteTemplate>;
    default:
      throw new Error("Type de constructeur non supporté");
        
  }
}

class SingletonData {
  private static instance: SingletonData | null = null;
  private readonly schema: SchemaRoute;
  private readonly routeDefinition: RouteDefinition;

  private constructor(schema: SchemaRoute, routeDefinition: RouteDefinition) {
    this.schema = schema;
    this.routeDefinition = routeDefinition;
  }

  public static getInstance(
    schema: SchemaRoute,
    routeDefinition: RouteDefinition
  ): SingletonData {
    if (!SingletonData.instance) {
      SingletonData.instance = new SingletonData(schema, routeDefinition);
    }
    return SingletonData.instance;
  }

  public getSchema(): SchemaRoute {
    return this.schema;
  }

  public getRouteDefinition(): RouteDefinition {
    return this.routeDefinition;
  }
}

// new Current(schema, routeDefinition) as InstanceType<typeof Current> & DecoratedAdder<typeof Current>;
//   return new Constructor(
//     schema,
//     routeDefinition
//   ) as InstanceType<TypeofRouteTemplateForFiles> &
//     DecoratedAdder<TypeofRouteTemplateForFiles>;

//   private getFolderNameFromSchema(schema: Schema): string {
//     if (!!schema.name) return schema.name;
//     let url = schema.url;
//     if (url.startsWith("/")) {
//       url = url.substring(1);
//     }
//     return (url.split("/")[0] || "").split("?")[0];
//   }
