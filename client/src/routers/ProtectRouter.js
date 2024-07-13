import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
  }, []);

  return <Outlet />;
};

export default ProtectRouter;
