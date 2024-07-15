import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetsPassword = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  // console.log("email", email);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [againPassword, setAgainPassword] = useState("");
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (password !== againPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:8081/api/v1/auth/reset-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (res.status !== 200) {
        toast.error("Server error");
        return;
      }
      const result = await res.json();
      console.log("result", result);
      toast.success(result.message);
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed . Please try again.");
    }
  };

  return (
    <div>
      <div className="form-login">
        <form onSubmit={handleSubmitForm}>
          <div className="form-group">
            <h2 className="title">New Password</h2>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your password here (again)"
              value={againPassword}
              onChange={(e) => setAgainPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <p>
            Back{" "}
            <i>
              <strong>
                <Link to="/login">Login</Link>
              </strong>
            </i>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetsPassword;
