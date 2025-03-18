import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
<%= ImportAndInterfaces %>
@Component({
  selector: "route-<%= dasherize(folderName) %>",
  templateUrl: "./<%= dasherize(folderName) %>.html",
  styleUrls: ["./<%= dasherize(folderName) %>.sass"],
})
export class <%= classify(folderName) %>Route<%= Implements %>{
<%= Contents %>
}