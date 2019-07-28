import * as Route from "route-parser";

export interface RouteDefinition {
  identifier: string;
  route: string;
}

export type RouteMapping = RouteDefinition[];

export interface ParsedRoute {
  identifier: string;
  route: any;
}

export type ParsedRouteMapping = ParsedRoute[];

export const parseRoutes = (mapping: RouteMapping): ParsedRouteMapping =>
  mapping.map(def => ({
    identifier: def.identifier,
    route: new Route(def.route)
  }));
