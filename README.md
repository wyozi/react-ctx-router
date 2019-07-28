## react-ctx-router

Simple React router for simple SPAs. Uses React Context and Hooks for maximum simplicity

`yarn add react-ctx-router`

```tsx
// index.tsx
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
// inside your components
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
