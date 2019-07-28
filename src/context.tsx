import * as React from "react";
import { ParsedRouteMapping, RouteMapping, parseRoutes } from "./routes";
import { MatchedRoute } from "./matcher";

interface ContextType {
  foundRoute: MatchedRoute;
  routes: ParsedRouteMapping;
  setPath: (newPath: string) => void;
}
export const Context = React.createContext<ContextType>();

interface DeepProps {
  path: string;
  setPath: (newPath: string) => void;
  routes: ParsedRouteMapping;
  children?: React.ReactNode;
}

export const ParsedProvider = ({
  path,
  setPath,
  routes,
  children
}: DeepProps) => {
  let foundRoute = [null, {}];
  for (const parsedRoute of routes) {
    const result = parsedRoute.route.match(path);
    if (result) {
      foundRoute = [parsedRoute.identifier, result];
      break;
    }
  }

  return (
    <Context.Provider value={{ foundRoute, routes, setPath }}>
      {children}
    </Context.Provider>
  );
};

export const RawProvider = ({ path, setPath, routes, children }: DeepProps) => (
  <ParsedProvider path={path} setPath={setPath} routes={parseRoutes(routes)}>
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
    <RawProvider
      path={strippedHash}
      setPath={path => (window.location.hash = path)}
      routes={routes}
    >
      {children}
    </RawProvider>
  );
};
