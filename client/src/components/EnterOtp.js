import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ResetsPassword from "./ResetsPassword";

const EnterOtp = ({ email }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [resetsPasswordSend, setResetsPasswordSend] = useState(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8081/api/v1/auth/enter-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, email }),
      });
      if (res.status !== 200) {
        toast.error("Server error");
        return;
      }
      const result = await res.json();
      console.log("result", result);
      toast.success(result.message);
      setResetsPasswordSend(true);
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to verify OTP. Please try again.");
    }
  };
  return (
    <div className="enter-otp">
      {!resetsPasswordSend ? (
        <div className="form-login">
          <form onSubmit={handleSubmitForm}>
            <div className="form-group">
              <h2 className="title">Enter OTP</h2>
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your OTP here"
                style={{ fontWeight: "bold", color: "red" }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <p>
              Back{" "}
              <i>
                <strong>
                  <Link to="/forgot-password">Send email</Link>
                </strong>
              </i>
            </p>
          </form>
        </div>
      ) : (
        <ResetsPassword email1={email} />
      )}
    </div>
  );
};

export default EnterOtp;
