export type PathParams = string[];
export type QueryParams = string[];
export interface StaticDynamicRouteParams {
    statics: RouteParameters;
    dynamics: RouteParameters;
}
export type RouteDefinition = StaticDynamicRouteParams & BaseRouteParams;
export interface BaseRouteParams {
    params: PathParams;
    queries: QueryParams;
}
export interface RouteParameters extends BaseRouteParams {
    length: number;
}
export type RouteParamsArray = [PathParams, QueryParams];