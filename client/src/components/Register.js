import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";

const Register = () => {
  const nagivate = useNavigate();
  const [lastname, setLastName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleImageChange = (e) => {
    const uploadFileAvatar = e.target.files[0];
    if (uploadFileAvatar) {
      setAvatar(uploadFileAvatar);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("lastname", lastname);
    formData.append("firstname", firstname);
    formData.append("school", school);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await fetch("http://localhost:8081/api/v1/auth/register", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(`Server Error: ${error.message}`);
        return;
      }

      const result = await res.json();
      toast.success(result.message);
      // Thực hiện các hành động tiếp theo sau khi đăng ký thành công, ví dụ như chuyển hướng người dùng đến trang đăng nhập
      nagivate("/login");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <div className="form-login">
      <form onSubmit={handleSubmitForm} encType="multipart/form-data">
        <div className="form-group">
          <h2 className="title">Register</h2>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your lastname here"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your firstname here"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your school here"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your username here"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            name="avatar"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <div>
          <span>Already have an account?</span> <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
