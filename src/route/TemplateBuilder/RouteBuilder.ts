import { RouteDefinition } from "@Schema-Route/RouteDefinition/RouteDefinition";
import { SchemaRoute } from "@Schema-Route/SchemaRoute";
import { DecoratedAdder } from "@Schema-Route/TemplateStrategy/TemplateDecorator";

export interface InterfaceResult {
  Interfaces: string;
  Imports: string;
}

export class Builder<T> {
  protected readonly folderName: string;
  constructor(protected readonly schema: SchemaRoute, protected readonly routeDefinition: RouteDefinition) {
    this.folderName = schema.name || this.getFolderNameFromSchema(schema);
  }

  protected generateStringTemplate(items: string[], template: (item: string) => string): string {
    return items.map(template).join("\n");
  }

  private generateInterface(type: string, items: string[]): string {
    return items.length ? `interface ${type} {\n${this.generateStringTemplate(items, (item: string) => `  ${item}: string;`)}\n}\n` : "";
  }
  protected generateInterfaces(): InterfaceResult {
    const Params = this.generateInterface("Params", this.routeDefinition.params);
    const Queries = this.generateInterface("Queries", this.routeDefinition.queries);
    const hasParams = !!Params;
    const hasQueries = !!Queries;
    const hasInterfaces = hasParams || hasQueries;
    return {
      Interfaces: (hasInterfaces ? "\n\n" : "") + Params + Queries,
      Imports: (hasParams ? ", Params" : "") + (hasQueries ? ", Queries" : ""),
    };
  }

  private getFolderNameFromSchema(schema: SchemaRoute): string {
    if (!!schema.name) return schema.name;
    let url = schema.url;
    if (url.startsWith("/")) {
      url = url.substring(1);
    }
    return (url.split("/")[0] || "").split("?")[0];
  }
  get build(): DecoratedAdder<T> {
    throw new Error("Not implemented");
  }
}