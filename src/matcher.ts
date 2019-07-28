import { useContext } from "react";
import { Context } from "./context";
import { ParsedRouteMapping } from "./routes";

interface RouteParams {
  [key: string]: string;
}
export type MatchedRoute = [null, RouteParams] | [string, RouteParams];

export const useRoute = (): MatchedRoute => {
  return useContext(Context).foundRoute;
};

const mutator = (
  routes: ParsedRouteMapping,
  setPath: (newPath: string) => void
) => (id: string, params: RouteParams = {}) => {
  const route = routes.find(route => route.identifier === id);
  if (!route) {
    throw new Error(`Failed to find route '${id}'`);
  }
  const reversed = route.route.reverse(params);
  if (!reversed) {
    throw new Error(`Invalid parameters provided to route mutator '${id}'`);
  }
  setPath(reversed);
};

export const useRouteMutator = () => {
  const { routes, setPath } = useContext(Context);
  return mutator(routes, setPath);
};
