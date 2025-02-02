import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";

import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router";
import Home from "./Home.tsx";
import Detail, { action, loader } from "./Detail.tsx";

const LegacyRouteProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route hydrateFallbackElement={<h1>하이드레이션중</h1>}>
      <Route path="/" element={<Home />} />
      <Route
        path="/detail"
        element={<Detail />}
        action={action}
        loader={loader}
      />
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
