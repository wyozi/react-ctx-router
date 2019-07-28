import { useContext } from "react";
import { Context } from "./context";

type RouteParams = {[key: string]: string};
export type MatchedRoute = [null, RouteParams] | [string, RouteParams];

export const useRoute = (): MatchedRoute => {
  return useContext(Context);
};
