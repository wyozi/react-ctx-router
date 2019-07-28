import * as React from "react";
import { mount } from "enzyme";
import { RawProvider } from "./context";
import { useRouteMutator, useRoute } from "./matcher";

function Wrapper(props: any) {
  return (
    <RawProvider
      path={props.path || ""}
      setPath={props.setPath || jest.fn()}
      routes={props.routes || []}
    >
      {props.children}
    </RawProvider>
  );
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Mutator = (_: { matched: any; mutator: any }) => null;
function Dummy() {
  const matched = useRoute();
  const mutator = useRouteMutator();
  return <Mutator matched={matched} mutator={mutator} />;
}

describe("Route mutator", () => {
  let component;
  let mutator;
  let setPath;
  beforeEach(() => {
    component = mount(<Dummy />, {
      wrappingComponent: Wrapper,
      wrappingComponentProps: {
        setPath: setPath = jest.fn(),
        routes: [
          { identifier: "foobar", route: "/foo" },
          { identifier: "hello", route: "/worlds/:id" }
        ]
      }
    });
    mutator = component.find(Mutator).prop("mutator");
  });

  describe("without existing routes", () => {
    it("always errors", () => {
      expect(() => mutator("abc")).toThrowError("Failed to find route 'abc'");
    });
  });

  describe("with a simple route", () => {
    it("sets location", () => {
      mutator("foobar");
      expect(setPath).toHaveBeenCalledWith("/foo");
    });
  });

  describe("with a parameterized route", () => {
    it("errors if parameter is missing", () => {
      expect(() => mutator("hello")).toThrowError(
        "Invalid parameters provided to route mutator 'hello'"
      );
    });

    it("sets location with parameter", () => {
      mutator("hello", { id: "a24" });
      expect(setPath).toHaveBeenCalledWith("/worlds/a24");
    });
  });
});
