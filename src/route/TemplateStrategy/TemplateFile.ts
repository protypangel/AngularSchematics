import {TemplateDecorator} from "./TemplateDecorator";
import {
  DefaultDefinition,
  RouteSpecTsDefinition,
  RouteTSDefinition,
} from "./TemplateFile.d";

export class Default implements DefaultDefinition {
  constructor(readonly folderName: string) {
  }
}

@TemplateDecorator({
  name: ".route.spec.ts",
})
export class RouteSpecTs extends Default implements RouteSpecTsDefinition {
  constructor(
      readonly folderName: string,
      readonly url: string,
      readonly ImportInterface: string
  ) {
    super(folderName);
  }
}
@TemplateDecorator({
  name: ".route.ts",
})
export class RouteTS extends Default implements RouteTSDefinition {
  constructor(
      readonly folderName: string,
      readonly ImportAndInterfaces: string,
      readonly Contents: string,
      readonly Implements: string
  ) {
    super(folderName);
  }
}

export type RouteTemplate = RouteTS | RouteSpecTs;
export type TypeofRouteTemplate = typeof RouteTS | typeof RouteSpecTs;
export const ArrayRouteTemplate = [RouteTS, RouteSpecTs];
