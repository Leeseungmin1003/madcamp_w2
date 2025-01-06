import React, { useState } from "react";
import "../Page/css/Login.css";
import { ReactComponent as Logo } from "../assets/logo/logo.svg";
import { ReactComponent as Google } from "../assets/icons/google.svg";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Email:", email, "Password:", password);
    try {
      const response = await axios.post(
        "http://mcminji-env.eba-x4gm6ig7.ap-northeast-2.elasticbeanstalk.com/auth/login", // API 엔드포인트
        {
          userid: email,
          password: password,
        }
      );

      // 서버로부터 받은 데이터를 처리
      console.log("Login successful:", response.data);

      // 로그인 성공 시 다음 페이지로 이동하거나 상태를 업데이트
      alert("로그인 성공!");
    } catch (error) {
      console.error("Login failed:", error);
      alert("로그인 실패: 아이디와 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <Link to="/">
          <Logo />
        </Link>
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
