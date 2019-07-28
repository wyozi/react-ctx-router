import * as React from "react";
import { mount } from "enzyme";
import { RawProvider } from "./context";
import { useRoute } from "./matcher";

function Wrapper(props: any) {
  return (
    <RawProvider
      path={props.path || ""}
      setPath={jest.fn()}
      routes={props.routes || []}
    >
      {props.children}
    </RawProvider>
  );
}
function Dummy() {
  const route = useRoute();
  return <div matched={route} />;
}

describe("Context", () => {
  let component;
  let wrapper;
  beforeEach(() => {
    // mount needed until https://github.com/airbnb/enzyme/issues/2176 is fixed
    component = mount(<Dummy />, { wrappingComponent: Wrapper });
    wrapper = component.getWrappingComponent();
  });

  const matchedRoute = () => component.find("div").prop("matched");

  describe("with empty routes", () => {
    beforeEach(() => wrapper.setProps({ routes: [] }));

    it("passes empty routes", () => {
      expect(wrapper.prop("routes")).toEqual([]);
    });

    it("does not match any route", () => {
      expect(matchedRoute()).toEqual([null, {}]);
    });
  });

  describe("with a simple route", () => {
    const routes = [{ identifier: "simple", route: "/foo" }];
    beforeEach(() => wrapper.setProps({ routes }));

    it("passes parsed simple route", () => {
      expect(wrapper.prop("routes")).toEqual([
        expect.objectContaining({
          identifier: "simple",
          route: expect.anything()
        })
      ]);
    });

    it("does not match any route", () => {
      expect(matchedRoute()).toEqual([null, {}]);
    });

    describe("when path matches route", () => {
      beforeEach(() => {
        wrapper.setProps({ path: "/foo" });
      });

      it("passes parsed simple route", () => {
        expect(matchedRoute()).toEqual(["simple", {}]);
      });
    });
  });

  describe("with route containing path variables", () => {
    const routes = [{ identifier: "vars-1", route: "/items/:id" }];
    beforeEach(() => wrapper.setProps({ routes }));

    describe("and path matches route", () => {
      beforeEach(() => {
        wrapper.setProps({ path: "/items/123" });
      });

      it("passes parsed simple route", () => {
        expect(matchedRoute()).toEqual(["vars-1", { id: "123" }]);
      });
    });
  });

  describe("with route containing many path variables", () => {
    const routes = [{ identifier: "vars-2", route: "/items/:id/tags/:tag" }];
    beforeEach(() => wrapper.setProps({ routes }));

    describe("and path matches route", () => {
      beforeEach(() => {
        wrapper.setProps({ path: "/items/123/tags/blue" });
      });

      it("passes parsed simple route", () => {
        expect(matchedRoute()).toEqual(["vars-2", { id: "123", tag: "blue" }]);
      });
    });
  });

  describe("with route containing query parameter variable", () => {
    const routes = [
      { identifier: "vars-3", route: "/items/:id?search=:query" }
    ];
    beforeEach(() => wrapper.setProps({ routes }));

    describe("and path matches route", () => {
      beforeEach(() => {
        wrapper.setProps({ path: "/items/123?search=foo+bar" });
      });

      it("passes parsed simple route", () => {
        expect(matchedRoute()).toEqual([
          "vars-3",
          { id: "123", query: "foo+bar" }
        ]);
      });
    });
  });
});
