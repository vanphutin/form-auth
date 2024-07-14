import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EnterOtp from "./EnterOtp";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:8081/api/v1/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (res.status !== 200) {
        toast.error("Server error");
        return;
      }
      const result = await res.json();
      console.log("result", result);
      toast.success(result.message);
      setOtpSent(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  return (
    <div>
      {!otpSent ? (
        <div className="form-login">
          <form onSubmit={handleSubmitForm}>
            <div className="form-group">
              <h2 className="title">Forgot Password</h2>
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
      ) : (
        <EnterOtp email={email} />
      )}
    </div>
  );
};

export default ForgotPassword;
