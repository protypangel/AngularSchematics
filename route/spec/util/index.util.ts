import {getStaticAndDynamicFacade, RouteParamsArray, spec, StaticDynamicRouteParams} from "../../src/ParamsQueries";
import {Schema} from "../../src/schema";
import {SchematicTestRunner, UnitTestTree} from "@angular-devkit/schematics/testing";

export function testGetParamsAndQueryFromUrl (url: string, tobeEquals: RouteParamsArray) {
    const result = spec.getParamsAndQueryFromUrl(url);
    expect(result).toEqual(tobeEquals);
}
export function testGetDynamicsParamsAndQueries (url: string, dynamics: string, toBeEquals: StaticDynamicRouteParams) {
    const paramQueryInArray = spec.getParamsAndQueryFromUrl(url);
    const dynamicsArray = dynamics.split(",");
    const result = spec.getDynamicsParamsAndQueries(dynamicsArray, paramQueryInArray);
    expect(result).toEqual(toBeEquals);
}
export function testGetStaticAndDynamic(url: string, dynamics: string, toBeEquals: StaticDynamicRouteParams) {
    const result = getStaticAndDynamicFacade(url, dynamics.split(","));
    expect({
        statics: result.statics,
        dynamics: result.dynamics,
    }).toEqual(toBeEquals);
}


type generateUtilRouteSchematicReturn1 = (options: Schema, filesPath: string) => Promise<void>;
type generateUtilRouteSchematicReturn2 = (options: Schema, { filesPath, contains, debug }: { filesPath: string, contains: string[], debug?: boolean }) => Promise<void>;
type generateUtilRouteSchematicReturn = [generateUtilRouteSchematicReturn1, generateUtilRouteSchematicReturn2];
export function generateUtilRouteSchematic (): generateUtilRouteSchematicReturn {
    const extensions = [".ts", ".sass", ".html"];
    const schematicRunner = new SchematicTestRunner("schematics", "./config/collection.json");
    type SchemaCustom = {filesPath: string, contains: string[], debug?: boolean};

    async function exceptContainFile(options: Schema, filesPath: string) {
        const tree: UnitTestTree = await schematicRunner.runSchematic("route", options);
        const files = tree.files;
        extensions.forEach(extension => expect(files).toContain(filesPath + extension));
    }
    async function exceptContain(options: Schema, { filesPath, contains, debug = false}: SchemaCustom) {
        const tree: UnitTestTree = await schematicRunner.runSchematic("route", options);
        if (debug) console.log(tree.readContent(filesPath));
        const contentExcept = tree.readContent(filesPath).replace(/[\r]+/g, "");
        expect(contentExcept).toEqual(contains.join("\n"));
    }
    return [
        exceptContainFile,
        exceptContain
    ]
}