import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./StyleWeb/CustomerList.css";

const { Search } = Input;
const { Option } = Select;

export default function CustomerList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/users`, {
        params: { keyword, status: statusFilter },
        withCredentials: true,
      });
      setUsers(res.data.users || []);
    } catch (err) {
      message.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [keyword, statusFilter]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/admin/users/${id}/status`,
        { status: currentStatus === 1 ? 0 : 1 },
        { withCredentials: true }
      );
      fetchUsers();
      message.success("Cập nhật trạng thái thành công");
    } catch (err) {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <div className="customer-container">
      <h2>Quản lý tài khoản khách hàng</h2>

      <div className="customer-filter">
        <Search
          placeholder="Tìm theo tên, email, SĐT"
          onSearch={(value) => setKeyword(value)}
          allowClear
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          value={statusFilter || undefined}
          onChange={(value) => setStatusFilter(value)}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="1">Hoạt động</Option>
          <Option value="0">Bị khóa</Option>
        </Select>
      </div>

      <div className="customer-table">
        <table>
          <thead>
  <tr>
    <th>Avatar</th>
    <th>Họ tên</th>
    <th>Email</th>
    <th>SĐT</th>
    <th>Trạng thái</th>
    <th>Hành động</th>
  </tr>
</thead>
<tbody>
  {loading ? (
    <tr><td colSpan="6">Đang tải dữ liệu...</td></tr>
  ) : users.length === 0 ? (
    <tr><td colSpan="6">Không có dữ liệu người dùng.</td></tr>
  ) : (
    users.map((user) => (
      <tr key={user._id}>
        <td className="avatar-cell">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#fff"
            }}>
              N/A
            </div>
          )}
        </td>
        <td>{user.full_name}</td>
        <td>{user.email}</td>
        <td>{user.phone_number || "Chưa có"}</td>
        <td style={{ color: user.status === 1 ? "green" : "red" }}>
          {user.status === 1 ? "Hoạt động" : "Bị khóa"}
        </td>
        <td>
          <button
            className="btn-edit"
            onClick={() => navigate(`/admin/customers/${user._id}`)}
          >
            ✏️
          </button>
          <button
            className="btn-delete"
            onClick={() => handleToggleStatus(user._id, user.status)}
          >
            {user.status === 1 ? "🔒" : "🔓"}
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}
