import { NavLink } from "react-router-dom";
import {
  FaChartPie, FaBoxOpen, FaTags, FaClipboardList, FaUsers, FaCogs,
  FaShoppingBag, FaTextHeight, FaAlignLeft, FaChevronDown, FaChevronRight
} from "react-icons/fa";
import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <div className="sidebar">
      <h2 className="logo">Mazone Admin</h2>

      <nav className="nav-links">
        {/* Menu cha: Bảng điều khiển */}
        <div
          className="menu-parent"
          onClick={() => setIsDashboardOpen(!isDashboardOpen)}
        >
          <FaChartPie className="icon" />
          <span style={{ flex: 1 }}>Bảng điều khiển</span>
          {isDashboardOpen ? (
            <FaChevronDown className="arrow-icon" />
          ) : (
            <FaChevronRight className="arrow-icon" />
          )}
        </div>

        {isDashboardOpen && (
          <div className="submenu">
            <NavLink to="/statistics/products" className={({ isActive }) => (isActive ? "active" : "")}>
              Thống kê sản phẩm
            </NavLink>
            <NavLink to="/statistics/inventory" className={({ isActive }) => (isActive ? "active" : "")}>
              Thống kê tồn kho
            </NavLink>
            <NavLink to="/statistics/orders" className={({ isActive }) => (isActive ? "active" : "")}>
              Doanh thu & Đơn hàng
            </NavLink>
          </div>
        )}

        {/* Các menu khác giữ nguyên */}
        <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaBoxOpen className="icon" /> Sản phẩm
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaTags className="icon" /> Danh mục
        </NavLink>
        <NavLink to="/descriptions" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaAlignLeft className="icon" /> Mô tả
        </NavLink>
        <NavLink to="/brands" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaShoppingBag className="icon" /> Thương hiệu
        </NavLink>
        <NavLink to="/sizes" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaTextHeight className="icon" /> Kích cỡ
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaClipboardList className="icon" /> Đơn hàng
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaUsers className="icon" /> Khách hàng
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaCogs className="icon" /> Cài đặt
        </NavLink>
      </nav>
    </div>
  );
}
