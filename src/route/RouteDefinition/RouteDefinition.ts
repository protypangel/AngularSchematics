import {
  RouteDefinition,
  RouteParameters,
  RouteParamsArray,
  StaticDynamicRouteParams,
} from "./RouteDefinition.d";

// KISS: Simplified URL parameter extraction
function getRouteParamsArray(url: string): RouteParamsArray {
  const [path, queryString] = url.split("?");
  const params = (path.match(/:(\w+)/g) || []).map(param => param.slice(1));
  const queries = queryString
    ? queryString.split("&").map(query => (query.match(/^[^=><]*/) ?? [""])[0].trim())
    : [];
  return [params, queries];
}

// KISS: Simplified dynamic parameter filtering
function getStaticDynamicRouteParams(
  dynamicsKey: string[],
  [params, queries]: RouteParamsArray
): StaticDynamicRouteParams {
  const dynamicsParams = dynamicsKey.filter(key => params.includes(key));
  const dynamicsQueries = dynamicsKey.filter(key => queries.includes(key));
  const dynamicsLength = dynamicsParams.length + dynamicsQueries.length;

  const dynamics: RouteParameters = {
    params: dynamicsParams,
    queries: dynamicsQueries,
    length: dynamicsLength,
  };

  return {
    dynamics,
    statics: {
      params: params.filter(param => !dynamicsParams.includes(param)),
      queries: queries.filter(query => !dynamicsQueries.includes(query)),
      length: params.length + queries.length - dynamicsLength,
    },
  };
}

// YAGNI: Removed unnecessary spec export since it's only used internally
function RouteDefinitionFacade(
  url: string,
  dynamics: string[]
): RouteDefinition {
  const ParamsAndQuery = getRouteParamsArray(url);
  const trimmedDynamics = dynamics.map(element => element.trim());
  
  return {
    ...getStaticDynamicRouteParams(trimmedDynamics, ParamsAndQuery),
    params: ParamsAndQuery[0],
    queries: ParamsAndQuery[1],
  };
}

// Internal utilities for testing
export interface RouteSpec {
  getParamsAndQueryFromUrl: (url: string) => RouteParamsArray;
  getDynamicsParamsAndQueries: (dynamicsKey: string[], params: RouteParamsArray) => StaticDynamicRouteParams;
}

export const spec: RouteSpec = {
  getParamsAndQueryFromUrl: getRouteParamsArray,
  getDynamicsParamsAndQueries: getStaticDynamicRouteParams,
};

export type { RouteDefinition };
export { RouteDefinitionFacade };
