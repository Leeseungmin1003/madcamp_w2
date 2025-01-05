import React, { useState } from "react";
import "../Page/css/Login.css";
import { ReactComponent as Logo } from "../assets/logo/logo.svg";
import { ReactComponent as Google } from "../assets/icons/google.svg";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <Logo />
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="login-button" onClick={handleLogin}>
        로그인
      </button>
      <div className="links">
        <span>비밀번호 찾기</span> |{" "}
        <span>
          <Link to="/Signup">회원가입</Link>
        </span>
      </div>

      <div className="divider"></div>

      <a href="http://mcminji-env.eba-x4gm6ig7.ap-northeast-2.elasticbeanstalk.com/login">
        <button className="google-button">
          <Google />
          구글 로그인
        </button>
      </a>
    </div>
  );
}

export default Login;
