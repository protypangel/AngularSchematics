import {
    testGetParamsAndQueryFromUrl,
    testGetDynamicsParamsAndQueries,
    testGetStaticAndDynamic,
    generateUtilRouteSchematic
} from "./util/Route.spec.util";

describe("Spec Params Queries : ", () => {
    it("obtenir les paramètres et les requêtes", () => {
        testGetParamsAndQueryFromUrl("/test/username/:id", [["id"], []]);
        testGetParamsAndQueryFromUrl("/test/:id/:name/username/", [["id", "name"], []]);
        testGetParamsAndQueryFromUrl("/test/:id/username/:name?age=20&usePassword=false&isActive", [["id", "name"], ["age", "usePassword", "isActive"]]);
        testGetParamsAndQueryFromUrl("/test/username/:name?age=20/:id", [["name"], ["age"]]);
    });
    it("obtenir les paramètres et les requêtes dynamiques", () => {
        testGetDynamicsParamsAndQueries("/test/username/:id/:username?isValid&username='toto'", "id,isValid", {
            dynamics: {
                params: ["id"],
                queries: ["isValid"],
                length: 2
            },
            statics: {
                params: ["username"],
                queries: ["username"],
                length: 2
            }
        });
    });
});

describe("Params Queries : ", () => {
    it("obtenir les paramètres et les requêtes statiques et dynamiques", () => {
        testGetStaticAndDynamic("/test/username/:id/:username?isValid&username='toto'", "id,isValid", {
            dynamics: {
                params: ["id"],
                queries: ["isValid"],
                length: 2
            },
            statics: {
                params: ["username"],
                queries: ["username"],
                length: 2
            }
        });
        testGetStaticAndDynamic("/:continent/:country/:region/:departement/entreprises?people>30&isPME&isOwnerSoftware&CoolEnterprise", "region,departement, people, isPME", {
            dynamics: {
                params: ["region", "departement"],
                queries: ["people", "isPME"],
                length: 4
            },
            statics: {
                params: ["continent", "country"],
                queries: ["isOwnerSoftware", "CoolEnterprise"],
                length: 4
            }
        });
    });
});

describe("Route Schematic -", () => {
    const [exceptContainFile, exceptContain] = generateUtilRouteSchematic();

    it("should generate the correct files name", async () => {
        await exceptContainFile({
            url: "/test/:id/:name"
        }, "/route/test/test.route");
        await exceptContainFile({
            url: "/test/:id/:name",
            name: "testRoute"
        }, "/route/test-route/test-route.route");
        await exceptContainFile({
            url: "/test/:id/:name",
            name: "testRoute",
            path: "/test/path"
        }, "/test/path/route/test-route/test-route.route");
    });



    it("ts file verify contain : contain minimal", async () => {
        await exceptContain({
            url: "/test"
        }, {
            filesPath: "/route/test/test.route.ts",
            contains: [
                "import { Component } from \"@angular/core\";",
                "import { ActivatedRoute} from \"@angular/router\";",
                "",
                "@Component({",
                "  selector: \"route-test\",",
                "  templateUrl: \"./test.html\",",
                "  styleUrls: [\"./test.sass\"],",
                "})",
                "export class TestRoute {",
                "",
                "}"
            ]
        });
    });
    it("ts file verify contain : correct name", async () => {
        await exceptContain({
            url: "/test",
            name: "testRoute"
        }, {
            filesPath: "/route/test-route/test-route.route.ts",
            contains: [
                "import { Component } from \"@angular/core\";",
                "import { ActivatedRoute} from \"@angular/router\";",
                "",
                "@Component({",
                "  selector: \"route-test-route\",",
                "  templateUrl: \"./test-route.html\",",
                "  styleUrls: [\"./test-route.sass\"],",
                "})",
                "export class TestRouteRoute {",
                "",
                "}"
            ]
        });
    });
    it("ts file verify contain : static & dynamics", async () => {
        await exceptContain({
            url: "/:continent/:country/:region/:departement/entreprises?people>30&isPME&isOwnerSoftware&CoolEnterprise",
            dynamics: "region,departement, people, isPME",
            name: "test"
        }, {
            debug:true,
            filesPath: "/route/test/test.route.ts",
            contains: [
                "import { Component } from \"@angular/core\";",
                "import { ActivatedRoute} from \"@angular/router\";",
                "import { OnInit } from \"@angular/core\";",
                "",
                "interface Params {",
                "  continent: string;",
                "  country: string;",
                "  region: string;",
                "  departement: string;",
                "}",
                "interface Queries {",
                "  people: string;",
                "  isPME: string;",
                "  isOwnerSoftware: string;",
                "  CoolEnterprise: string;",
                "}",
                "",
                "@Component({",
                "  selector: \"route-test\",",
                "  templateUrl: \"./test.html\",",
                "  styleUrls: [\"./test.sass\"],",
                "})",
                "export class TestRoute implements OnInit {",
                "  params: Params = {",
                "    continent: \"\",",
                "    country: \"\",",
                "    region: \"\",",
                "    departement: \"\"",
                "  };",
                "  queries: Queries = {",
                "    people: \"\",",
                "    isPME: \"\",",
                "    isOwnerSoftware: \"\",",
                "    CoolEnterprise: \"\"",
                "  };",
                "  constructor(private route: ActivatedRoute) {",
                "    this.params.continent = this.route.snapshot.params[\"continent\"];",
                "    this.params.country = this.route.snapshot.params[\"country\"];",
                "    this.queries.isOwnerSoftware = this.route.snapshot.queryParams[\"isOwnerSoftware\"];",
                "    this.queries.CoolEnterprise = this.route.snapshot.queryParams[\"CoolEnterprise\"];",
                "  }",
                "  ngOnInit() {",
                "    this.route.params.subscribe(params => {",
                "      this.params.region = params[\"region\"];",
                "      this.params.departement = params[\"departement\"];",
                "    });",
                "    this.route.queryParams.subscribe(queryParams => {",
                "      this.queries.people = queryParams[\"people\"];",
                "      this.queries.isPME = queryParams[\"isPME\"];",
                "    });",
                "  }",
                "}"
            ]
        });
    });
});