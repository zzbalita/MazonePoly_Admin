import { NavLink } from "react-router-dom";
import { FaChartPie, FaBoxOpen, FaTags, FaClipboardList, FaUsers, FaCogs, FaShoppingBag, FaTextHeight, FaAlignLeft } from "react-icons/fa";
import "./Sidebar.css";


export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2 className="logo">Mazone Admin</h2>

            <nav className="nav-links">
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                    <FaChartPie className="icon" /> Tổng quan
                </NavLink>
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
