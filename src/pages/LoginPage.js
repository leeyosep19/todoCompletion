
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 이미 로그인한 상태일 경우, 자동으로 홈 페이지로 리디렉션
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/"); // 이미 로그인된 상태면 홈으로 리디렉션
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/user/login", { email, password });
      console.log("Response:", response);
      if (response.status === 200) {
        // 로그인 성공
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userId", response.data.userId);   ///추가 사용자 ID 저장
        api.defaults.headers["authorization"] = "Bearer " + response.data.token;
        setError(""); // 에러 메시지 초기화
        navigate("/"); // 로그인 후 홈 페s이지로 리디렉션
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setError(error.message);
      window.alert(error.message); // 에러 메시지 표시
    }
  };

  return (
    <div className="display-center">
      {error && <div className="red-error">{error}</div>}
      <Form className="login-box" onSubmit={handleLogin}>
        <h1>로그인</h1>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)} // email 상태 업데이트
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)} // password 상태 업데이트
          />
        </Form.Group>

        <div className="button-box">
          <Button type="submit" className="button-primary">
            Login
          </Button>
          <span>
            계정이 없다면? <Link to="/register">회원가입 하기</Link>
          </span>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;

