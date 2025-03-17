import { SchemaRoute } from "@Schema-Route/SchemaRoute";
import { strings } from "@angular-devkit/core";
import {
  Default,
  RouteTemplate,
  ArrayRouteTemplate,
  TypeofRouteTemplate,
  RouteSpecTs,
  RouteTS
} from "./TemplateFile";
import {TemplateFileFactory} from "@src/Route/TemplateFactory/TemplateFactory";

type Template = RouteTemplate | Default;

export class TemplateStrategy {
  private readonly templates: { [key: string]: RouteTemplate };
  private readonly default: Default;
  constructor(schema: SchemaRoute) {
    const TemplateFactory = TemplateFileFactory(
        schema
    );
    this.default = TemplateFactory(Default).Template() as unknown as Default;
    this.templates = ArrayRouteTemplate.reduce<{
      [key: string]: RouteTemplate;
    }>((previous, Current: TypeofRouteTemplate) => {
      const current = TemplateFactory(Current);
      const template: RouteTemplate = current.Template() as unknown as RouteTemplate;

      const name = current.Option().name;
      previous[name] = template;


      return previous;
    }, {});

  }
  private findTemplateFromUrl(url: string): Template {
    const entry = Object.entries(this.templates).find(([key, value]) => url.trim().endsWith(key));
    const template = entry ? entry[1] : this.default;
    return template;
  }
  // TODO: findTemplateFromUrl ne fait pas son travail
  public getTemplateConfigFromUrl(url: string): Object {
    const template = this.findTemplateFromUrl(url);
    return {
      ...strings,
      ...template
    }
  }
}
