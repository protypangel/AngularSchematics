import { SchematicTestRunner } from "@angular-devkit/schematics/testing";
import { RouteDefinitionFacade } from "@src/Route/RouteDefinition/RouteDefinition";
import { SchemaRoute } from "@src/Route/SchemaRoute";
import * as path from "path";

async function RouteUtilBuilder (options: SchemaRoute) {
  const runner = new SchematicTestRunner(
    "schematics", 
    path.join(__dirname, "../../config/collection.json")
  )
  return await runner.runSchematic("route", options); // Changed "Route" to "route" to match schematic name
}

class Files {
  static async getFiles(options: SchemaRoute) {
    const tree = await RouteUtilBuilder(options);
    return tree.files;
  }
  static async getFileContent(options: SchemaRoute, path: string) {
    const tree = await RouteUtilBuilder(options);
    return tree.readContent(path).replace("\r", "");
  }
  static getExtensions(): string[] {
    return ["ts", "spec.ts", "sass", "html"];
  }
}

class RouteDefinition {
  static getRouteDefinition(url: string, dynamics: string = ""): RouteDefinition {
    return RouteDefinitionFacade(url, dynamics.split(","));
  }
}

export const RouteUtil = {
  Files,
  RouteDefinition,
  RouteUtilBuilder,
}