import { useContext } from "react";
import { Context } from "./context";

interface RouteParams {
  [key: string]: string;
}
export type MatchedRoute = [null, RouteParams] | [string, RouteParams];

export const useRoute = (): MatchedRoute => {
  return useContext(Context).foundRoute;
};

export const useRouteMutator = () => {
  const { routes } = useContext(Context);
  const mutator = (id: string, params: RouteParams) => {
    const route = routes.find(route => route.identifier === id);
    if (!route) {
      throw new Error(`Failed to find route '${id}'`);
    }
    window.location.hash = route.route.reverse(params);
  };
  return [mutator];
};
