import {
  RouteParamsArray,
  StaticDynamicRouteParams,
} from "@src/Route/RouteDefinition/RouteDefinition.d";
import { SchemaRoute } from "@src/Route/SchemaRoute";
import {
  SchematicTestRunner,
  UnitTestTree,
} from "@angular-devkit/schematics/testing";
import {
  RouteDefinitionFacade,
  spec,
} from "@src/Route/RouteDefinition/RouteDefinition";

export function testGetParamsAndQueryFromUrl(
  url: string,
  tobeEquals: RouteParamsArray
) {
  const result = spec.getParamsAndQueryFromUrl(url);
  expect(result).toEqual(tobeEquals);
}
export function testGetDynamicsParamsAndQueries(
  url: string,
  dynamics: string,
  toBeEquals: StaticDynamicRouteParams
) {
  const paramQueryInArray = spec.getParamsAndQueryFromUrl(url);
  const dynamicsArray = dynamics.split(",");
  const result = spec.getDynamicsParamsAndQueries(
    dynamicsArray,
    paramQueryInArray
  );
  expect(result).toEqual(toBeEquals);
}
export function testGetStaticAndDynamic(
  url: string,
  dynamics: string,
  toBeEquals: StaticDynamicRouteParams
) {
  const result = RouteDefinitionFacade(url, dynamics.split(","));
  expect({
    statics: result.statics,
    dynamics: result.dynamics,
  }).toEqual(toBeEquals);
}

type generateUtilRouteSchematicReturn1 = (
  options: SchemaRoute,
  filesPath: string
) => Promise<void>;
type generateUtilRouteSchematicReturn2 = (
  options: SchemaRoute,
  {
    filesPath,
    contains,
    debug,
  }: { filesPath: string; contains: string[]; debug?: boolean }
) => Promise<void>;
type generateUtilRouteSchematicReturn = [
  generateUtilRouteSchematicReturn1,
  generateUtilRouteSchematicReturn2
];
export function generateUtilRouteSchematic(): generateUtilRouteSchematicReturn {
  const extensions = [".ts", ".sass", ".html"];
  const schematicRunner = new SchematicTestRunner(
    "schematics",
    "./config/collection.json"
  );
  type SchemaCustom = {
    filesPath: string;
    contains: string[];
    debug?: boolean;
  };

  async function exceptContainFile(options: SchemaRoute, filesPath: string) {
    const tree: UnitTestTree = await schematicRunner.runSchematic(
      "route",
      options
    );
    const files = tree.files;
    extensions.forEach((extension) =>
      expect(files).toContain(filesPath + extension)
    );
  }
  async function exceptContain(
    options: SchemaRoute,
    { filesPath, contains, debug = false }: SchemaCustom
  ) {
    const tree: UnitTestTree = await schematicRunner.runSchematic(
      "route",
      options
    );
    if (debug) console.log(tree.readContent(filesPath));
    const contentExcept = tree.readContent(filesPath).replace("\r", "");
    expect(contentExcept).toEqual(contains.join("\n"));
  }
  return [exceptContainFile, exceptContain];
}
