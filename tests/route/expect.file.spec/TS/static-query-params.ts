import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";


interface Params {
  param1: string;
  param2: string;
}
interface Queries {
  query1: string;
  query2: string;
}

@Component({
  selector: "route-test",
  templateUrl: "./test.html",
  styleUrls: ["./test.sass"],
})
export class TestRoute {
  params: Params = {
    param1: "",
    param2: "",
  };
  queries: Queries = {
    query1: "",
    query2: "",
  };
  constructor(private route: ActivatedRoute) {
    this.params.param1 = this.route.snapshot.params["param1"];
    this.params.param2 = this.route.snapshot.params["param2"];
    this.queries.query1 = this.route.snapshot.queryParams["query1"];
    this.queries.query2 = this.route.snapshot.queryParams["query2"];
  }
}