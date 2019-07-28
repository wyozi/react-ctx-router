import { useContext } from "react";
import { Context } from "./context";

export type MatchedRoute = [null] | [string, object];

export const useRoute = (): MatchedRoute => {
  return useContext(Context);
};
