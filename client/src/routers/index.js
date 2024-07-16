import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import ProtectRouter from "./ProtectRouter";
import ForgotPassword from "../components/ForgotPassword";
import EnterOtp from "../components/EnterOtp";
import ResetsPassword from "../components/ResetsPassword";

const AuthLayout = () => {
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/pasword-forgot",
        element: <ForgotPassword />,
      },
      {
        path: "/password-otp",
        element: <EnterOtp />,
      },
      {
        path: "/reset-password",
        element: <ResetsPassword />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        element: <ProtectRouter />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
        ],
      },
    ],
  },
]);

export default router;
