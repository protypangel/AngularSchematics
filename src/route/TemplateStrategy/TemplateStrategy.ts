import { SchemaRoute } from "@src/Route/SchemaRoute";
import { strings } from "@angular-devkit/core";
import {
  Default,
  RouteTemplate,
  ArrayRouteTemplate,
  TypeofRouteTemplate
} from "./TemplateFile";
import {TemplateFileFactory} from "./TemplateFileFactory";

export class TemplateStrategy {
  private readonly templates: { [key: string]: RouteTemplate };
  private readonly default: Default;
  constructor(schema: SchemaRoute) {
    const TemplateFactory = TemplateFileFactory(
        schema
    );
    this.default = new Default("");
    this.templates = ArrayRouteTemplate.reduce<{
      [key: string]: RouteTemplate;
    }>((previous, Current: TypeofRouteTemplate) => {
      const current = TemplateFactory(Current);
      const template: RouteTemplate =
        current.Template() as unknown as RouteTemplate;
      const name = current.Option().name;
      previous[name] = template;
      return previous;
    }, {});
  }
  private findTemplateFromUrl(url: string): RouteTemplate {
    const templateIndex = Object.keys(this.templates).findIndex((key) =>
      url.endsWith(key)
    );
    return this.templates[templateIndex] || this.default;
  }
  public getTemplateConfigFromUrl(url: string): Object {
    return {
      ...strings,
      ...this.findTemplateFromUrl(url),
    };
  }
}
