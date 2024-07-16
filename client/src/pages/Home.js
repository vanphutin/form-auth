import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider, { AuthContext } from "../context/AuthProvider";

const Home = (props) => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log("user", user);

  const onButtonClick = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="mainContainer">
      {user ? (
        <div className="avatar" style={{ height: "300px", width: "300px" }}>
          <img
            src={`data:image/jpeg;base64,${user?.avatar}`}
            alt={user?.lastname + " " + user?.firstname}
            className="avatar-user"
            style={{
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "50%",
            }}
          />
        </div>
      ) : (
        ""
      )}
      <div className={"titleContainer"}>
        <div>Welcome, {user?.firstname}</div>
      </div>
      <div>This is the home page.</div>
      <div className={"buttonContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={user ? "Log out" : "Log in"}
        />
        {user ? (
          <div>
            Your email address is <strong>{user?.email}</strong>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default Home;
