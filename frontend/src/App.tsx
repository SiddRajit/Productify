import { createRouter, RouterProvider } from "@tanstack/react-router";
import useAuthReq from "./hooks/useAuthReq";
import { routeTree } from "./routeTree.gen";
import { getRouter } from "./router";

const router = getRouter();

export default function App() {
  const { isSignedIn, isClerkLoaded } = useAuthReq();
  return (
    <RouterProvider router={router} context={{ isSignedIn, isClerkLoaded }} />
  );
}
