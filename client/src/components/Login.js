import React, { useState, useContext } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Login = () => {
  const { setUser } = useContext(AuthContext); // Lấy setUser từ AuthContext
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const login = {
      email,
      password,
    };

    try {
      const res = await fetch("http://localhost:8081/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(`Server Error: ${error.message}`);
        return;
      }

      const result = await res.json();

      localStorage.setItem("token", result.token);
      localStorage.setItem("userEmail", result.user.email);
      localStorage.setItem("userName", result.user.username);

      // Lưu thông tin người dùng vào context
      setUser(result.user);

      if (result.code === 200) {
        navigate("/");
      }

      console.log("result", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="form-login">
      <form onSubmit={handleSubmitForm}>
        <div className="form-group">
          <h2 className="title">Login</h2>
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Enter your password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <Link to="">Forgot password?</Link>
        <div>
          <span>Don't have an account </span>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
