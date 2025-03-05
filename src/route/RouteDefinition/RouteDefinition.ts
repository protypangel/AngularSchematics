import {
  RouteDefinition,
  RouteParameters,
  RouteParamsArray,
  StaticDynamicRouteParams,
} from "./RouteDefinition";

function getRouteParamsArray(url: string): RouteParamsArray {
  const [path, queryString] = url.split("?");
  return [
    (path.match(/:(\w+)/g) || []).map((param) => param.slice(1)),
    queryString
      ? queryString
          .split("&")
          .map((query) => (query.match(/^[^=><]*/) ?? [""])[0].trim())
      : [],
  ];
}
function getStaticDynamicRouteParams(
  dynamicsKey: string[],
  [params, queries]: RouteParamsArray
): StaticDynamicRouteParams {
  const dynamicsParams = dynamicsKey.filter((key) => params.includes(key));
  const dynamicsQueries = dynamicsKey.filter((key) => queries.includes(key));

  const dynamics: RouteParameters = {
    params: dynamicsParams,
    queries: dynamicsQueries,
    length: dynamicsParams.length + dynamicsQueries.length,
  };
  return {
    dynamics,
    statics: {
      params: params.filter((param) => !dynamicsParams.includes(param)),
      queries: queries.filter((query) => !dynamicsQueries.includes(query)),
      length: params.length + queries.length - dynamics.length,
    },
  };
}

export const spec = {
  getParamsAndQueryFromUrl: getRouteParamsArray,
  getDynamicsParamsAndQueries: getStaticDynamicRouteParams,
};

export function RouteDefinitionFacade(
  url: string,
  dynamics: string[]
): RouteDefinition {
  const ParamsAndQuery = getRouteParamsArray(url);
  dynamics = dynamics.map((element) => element.trim());
  return {
    ...getStaticDynamicRouteParams(dynamics, ParamsAndQuery),
    params: ParamsAndQuery[0],
    queries: ParamsAndQuery[1],
  };
}
