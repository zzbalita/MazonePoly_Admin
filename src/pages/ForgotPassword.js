import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StyleWeb/Login.css";
import { BASE_URL } from "../config";

export default function ForgotPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert("❌ Mật khẩu mới không khớp!");
    }

    try {
      await axios.post(
        `${BASE_URL}/api/admin/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("✅ Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Lỗi khi đổi mật khẩu");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleChangePassword}>
        <h2>Đổi mật khẩu</h2>

        <div className="input-group">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Nhập lại mật khẩu mới</label>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-button">Đổi mật khẩu</button>

        <div className="login-link">
          <span>Đã nhớ mật khẩu? </span>
          <button type="button" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
}
