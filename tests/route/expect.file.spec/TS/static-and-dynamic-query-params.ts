import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OnInit } from "@angular/core";

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
export class TestRoute implements OnInit {
  params: Params = {
    param1: "",
    param2: "",
  };
  queries: Queries = {
    query1: "",
    query2: "",
  };
  constructor(private route: ActivatedRoute) {
    this.params.param2 = this.route.snapshot.params["param2"];
    this.queries.query2 = this.route.snapshot.queryParams["query2"];
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params.param1 = params["param1"];
    });
    this.route.queryParams.subscribe(queryParams => {
      this.queries.query1 = queryParams["query1"];
    });
  }
}