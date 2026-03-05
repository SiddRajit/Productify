import { RouterProvider } from "@tanstack/react-router";
import useAuthReq from "./hooks/useAuthReq";
import { getRouter } from "./router";

const router = getRouter();

export default function App() {
  const { isSignedIn, isClerkLoaded } = useAuthReq();
  return (
    <RouterProvider router={router} context={{ isSignedIn, isClerkLoaded }} />
  );
}
