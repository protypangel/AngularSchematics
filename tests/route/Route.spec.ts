import { RouteUtil } from "./Route.util";
import * as path from "path";

// Verifié que les fichiers sont créés
describe("Path with no name argument", () => {
    const extensions = RouteUtil.Files.getExtensions();
    function hasAllFiles(url: string, fileName: string) {
        return function () {
            return RouteUtil.Files.getFiles({
                url
            }).then(files => {
                expect(files.length).toBe(extensions.length);
                extensions.forEach(extension => {
                    expect(files).toContain(`/route/${fileName}/${fileName}.route.${extension}`);
                });
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
