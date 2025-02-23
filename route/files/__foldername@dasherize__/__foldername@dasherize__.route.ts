import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "route-<%= name %>",
  templateUrl: "./<%= name %>.html",
  styleUrls: ["./<%= name %>.sass"],
})
export class <%= classify(name) %>Route <%= implementsOnInitDetection ? 'implements OnInit' : '' %> {
  <%= ConstructorDetection %>
  <%= OnInitDetection %>
}
