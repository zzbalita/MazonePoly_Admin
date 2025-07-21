import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StyleWeb/Login.css";
import { BASE_URL } from "../config";


export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); //điều hướng

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/login`, {
        phone,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Đăng nhập thành công");
      navigate("/dashboard"); // điều hướng đến dashboard
    } catch (err) {
      alert("Sai số điện thoại hoặc mật khẩu");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Đăng nhập</h2>

        <div className="input-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-button">
          Đăng nhập 
        </button>

         <div className="login-link">
          <span>Quên mật khẩu? </span>
          <button type="button" onClick={() => navigate("/forgot-password")}>
            Lấy lại mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
}
