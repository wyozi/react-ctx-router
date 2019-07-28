## react-ctx-router

Simple React router for simple SPAs. Uses React Context and Hooks for maximum simplicity

`yarn add react-ctx-router`

```tsx
// setup router
import { Provider } from "react-ctx-router";

const routes = [
  { identifier: "main", route: "/" },
  { identifier: "about", route: "/about" },
  { identifier: "item", route: "/items/:id" }
];

const WrappedApp = (
  <Provider routes={routes}>
    <App />
  </Provider>
);
```
```tsx
// access current route
import { useRoute } from "react-ctx-router";

const Header = () => {
  const [id, params] = useRoute();
  if (id === "item") {
    return <b>You are viewing item {params.id}</b>;
  } else {
    return <i>Please select an item</i>
  }
};
```
```tsx
// modify route
import { useRouteMutator } from "react-ctx-router";

const Page = () => {
  const mutateRoute = useRouteMutator();
  return (
    <>
      <div onClick={() => mutateRoute("item", {id: "1"})}>View item "1"</div>
      <div onClick={() => mutateRoute("item", {id: "2"})}>View item "2"</div>
      <div onClick={() => mutateRoute("about")}>About</div>
    </>
  );
};
```
