import * as React from "react";
import { ParsedRouteMapping, RouteMapping, parseRoutes } from "./routes";

export const Context = React.createContext<ParsedRouteMapping>();

export const ParsedProvider = ({
  hash,
  routes,
  children
}: {
  hash: string;
  routes: ParsedRouteMapping;
  children?: React.ReactNode;
}) => {
  let foundRoute = [null];
  for (const parsedRoute of routes) {
    const result = parsedRoute.route.match(hash);
    if (result) {
      foundRoute = [parsedRoute.identifier, result];
      break;
    }
  }

  return <Context.Provider value={foundRoute}>{children}</Context.Provider>;
};

export const RawProvider = ({
  hash,
  routes,
  children
}: {
  hash: string;
  routes: RouteMapping;
  children?: React.ReactNode;
}) => (
  <ParsedProvider hash={hash} routes={parseRoutes(routes)}>
    {children}
  </ParsedProvider>
);

export const FullProvider = ({
  routes,
  children
}: {
  routes: RouteMapping;
  children?: React.ReactNode;
}) => {
  const [hash, setHash] = React.useState(window.location.hash);

  React.useEffect(() => {
    window.addEventListener("hashchange", () => {
      setHash(window.location.hash);
    });
  }, []);

  return (
    <RawProvider hash={hash} routes={routes}>
      {children}
    </RawProvider>
  );
};
