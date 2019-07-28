import * as React from "react";
import { ParsedRouteMapping, RouteMapping, parseRoutes } from "./routes";

export const Context = React.createContext<ParsedRouteMapping>();

export const ParsedProvider = ({
  path,
  routes,
  children
}: {
  path: string;
  routes: ParsedRouteMapping;
  children?: React.ReactNode;
}) => {
  let foundRoute = [null];
  for (const parsedRoute of routes) {
    const result = parsedRoute.route.match(path);
    if (result) {
      foundRoute = [parsedRoute.identifier, result];
      break;
    }
  }

  return (
    <Context.Provider value={{ foundRoute, routes }}>
      {children}
    </Context.Provider>
  );
};

export const RawProvider = ({
  path,
  routes,
  children
}: {
  path: string;
  routes: RouteMapping;
  children?: React.ReactNode;
}) => (
  <ParsedProvider path={path} routes={parseRoutes(routes)}>
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
  const [hash, setHash] = React.useState<string>(window.location.hash);

  React.useEffect(() => {
    window.addEventListener("hashchange", () => {
      setHash(window.location.hash);
    });
  }, []);

  const strippedHash = hash.length > 0 ? hash.substring(1) : "/";

  return (
    <RawProvider path={strippedHash} routes={routes}>
      {children}
    </RawProvider>
  );
};
