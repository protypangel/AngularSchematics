import { RouteUtil } from "./Route.util";
import * as fs from 'fs';
import { diffChars } from "diff";
import { SchemaRoute } from "@src/route/SchemaRoute";

// Verifié que les fichiers sont créés
describe("Path with no name argument", () => {
    const extensions = RouteUtil.Files.getExtensions();
    function hasAllFiles(url: string, fileName: string) {
        return function () {
            return RouteUtil.Files.getFiles({
                url
            }).then(files => {
                expect(files.length).toBe(extensions.length);
                const haventFiles = RouteUtil.Files.haventFiles(`/route/${fileName}/${fileName}.route`, files);
                expect(haventFiles).toEqual([]);
            });
        };
    }
    it("Path with only one dash", hasAllFiles("/test", "test"));
    it("Path with no dash", hasAllFiles("test", "test"));
    it("Path with two dashes", hasAllFiles("/first/second", "first"));
    it("Path with three dashes", hasAllFiles("/first/second/third", "first"));
    it("Path with one query params", hasAllFiles("/test?param=value", "test"));
    it("Path with two query params", hasAllFiles("/test?param=value&param2=value2", "test"));
    it("Path with one dynamic param", hasAllFiles("/test/:param", "test"));
    it("Path with two dynamic params", hasAllFiles("/test/:param/:param2", "test"));
    it("Path with one dynamic param and one query param", hasAllFiles("/test/:param?param=value", "test"));
    it("Path with two dynamic params and one query param", hasAllFiles("/test/:param/:param2?param=value", "test"));
    it("Path with one dynamic param and two query params", hasAllFiles("/test/:param?param=value&param2=value2", "test"));
    it("Path with two dynamic params and two query params", hasAllFiles("/test/:param/:param2?param=value&param2=value2", "test"));
    it("Path with only one dash dasherize", hasAllFiles("/FirstSecond", "first-second"));    
});
// Verifié que les fichiers sont créés avec le name argument
describe("Path with name argument", () => {
    const extensions = RouteUtil.Files.getExtensions();
    function hasAllFiles(url: string, name: string, excptedFileName: string) {
        return function () {
            return RouteUtil.Files.getFiles({
                url,
                name
            }).then(files => {
                extensions.forEach(extension => {
                    expect(files).toContain(`/route/${excptedFileName}/${excptedFileName}.route.${extension}`);
                });
            });
        };
    }
    it("Path with name argument", hasAllFiles("/first", "second", "second"));
    it("Path with name argument and dasherize", hasAllFiles("/FirstSecond", "ThirdFourth", "third-fourth"));
    it("Dasherized path with two dashes and two dynamic params and two query params", hasAllFiles("/first-second/custom-route/:param/:param2?param=value&param2=value2", "third-fourth", "third-fourth"));
})
// Vérifier le contenue des fichiers
describe("Content of the files", () => {
    function hasContent(schema: SchemaRoute, [fileName, fileNameUnderExceptedFile]: [string, string], extension: string) {
        function replaceCarriageReturn(content: string, boolean: boolean = true) {
            return content.replace(/\r/g, "");
        }
        function showAscii(str: string): string {
            return str.split('').map(char => /[\.\w,{}()@;]/.test(char) ? char : `${char}(${char.charCodeAt(0)})`).join('');
        }
        return function () {
            return RouteUtil.Files.getFileContent(schema, `/route/${fileName}/${fileName}.route.${extension}`).then(content => {
                expect(content).toBeDefined();
                const expectedContent = fs.readFileSync(`./tests/route/expect.file.spec/${fileNameUnderExceptedFile}.${extension}`, 'utf8');
                const normalizedContent = replaceCarriageReturn(content);
                const normalizedExpected = replaceCarriageReturn(expectedContent, false);
                const diff = diffChars(normalizedContent, normalizedExpected);
                const hasDiff = diff.some(part => part.added || part.removed);
                expect(hasDiff).toBe(false);
                if (hasDiff) {
                    console.log();
                    console.log("------------CONTENT ASCII-----------------");
                    console.log(content);
                    console.log("------------EXPECTED CONTENT ASCII--------");
                    console.log(expectedContent);
                    console.log("-------------DIFFERENCES FOUND------");
                    diff.forEach(part => {
                        if (part.added || part.removed) {
                            const prefix = part.added ? "+ " : "- ";
                            console.log(`${prefix}: ${showAscii(part.value)}`);
                        }
                    });
                    console.log("--------------------------------");
                }
            });
        }
    }
    it("TS Default", hasContent({
        url: "/defaultTest"
    }, ["default-test", "TS/default"], "ts"));
    it("TS Default Change Name", hasContent({
        url: "/defaultTest",
        name: "other-name"
    }, ["other-name", "TS/other-name"], "ts"));
    it("TS Contains static query params", hasContent({
        url: "/test/:param1/:param2?query1=value1&query2"
    }, ["test", "TS/static-query-params"], "ts"));
    it("TS Contains dynamic query params", hasContent({
        url: "/test/:param1/:param2?query1=value1&query2",
        dynamics: "param1,param2,query1,query2"
    }, ["test", "TS/dynamic-query-params"], "ts"));    
    it("TS Contains static and dynamic params", hasContent({
        url: "/test/:param1/:param2?query1=value1&query2",
        dynamics: "param1,query1"
    }, ["test", "TS/static-and-dynamic-query-params"], "ts"));
});
