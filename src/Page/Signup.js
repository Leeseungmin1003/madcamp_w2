import React, { useState } from "react";
import "../Page/css/Signup.css";

function Signup() {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 정보:", form);
    // 추가 로직 (백엔드 요청 등)
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원가입</h1>
      <p className="signup-subtitle">
        YouWithMe와 함께 크리에이터가 되어보세요!
      </p>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="lastName"
          placeholder="성"
          value={form.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="firstName"
          placeholder="이름"
          value={form.firstName}
          onChange={handleChange}
        />
        <div className="username-container">
          <input
            className="username-input"
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
          />
          <button type="button" className="check-button">
            중복확인
          </button>
        </div>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit" className="signup-button">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Signup;
