import { RouteTemplate } from "./TemplateFile";

export interface TemplateStrategy {
  createTemplate(): RouteTemplate;
}
