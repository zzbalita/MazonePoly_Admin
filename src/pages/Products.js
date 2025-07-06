import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StyleWeb/Products.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ProductCard from "../components/ProductCard";


export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi tải sản phẩm", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id)); // Cập nhật danh sách
      alert("Đã xoá sản phẩm!");
    } catch (err) {
      console.error("Lỗi xoá sản phẩm", err);
      alert("Không thể xoá sản phẩm");
    }
  };

  return (
    <div className="product-page">

      <div style={{ background: "#fff", marginBottom: "10px", padding: "5px", borderRadius: "10px" }}>
        <div className="product-header">
          <h2>Quản Lý Sản Phẩm</h2>
          <button className="btn-add" onClick={() => navigate("/products/add")}>
            + Thêm sản phẩm mới
          </button>
        </div>

        <div className="product-search">
          <input name="ip-search" placeholder="...Tìm theo tên sản phẩm" />
          <select>
            <option>Tên A-Z</option>
            <option>Tên Z-A</option>
            <option>Giá tăng</option>
            <option>Giá giảm</option>
          </select>
          <button className="btn-search">Tìm kiếm</button>
        </div>

      </div>

      <div className="product-scroll-container">
        <div className="product-list">
          {products.map((prod) => (
            <div className="product-card" key={prod._id}>
              <ProductCard key={prod._id} product={prod} />
              <div className="product-info">
                <h3>{prod.name}</h3>

                <div className="info-boxes">
                  <div className="box">
                    <p>Danh mục: {prod.category}</p>
                    <p>Thương hiệu: {prod.brand}</p>
                    <p>Giá bán: {prod.price?.toLocaleString()}₫</p>
                    <p>
                      Tổng kho:{" "}
                      {prod.variations
                        ? prod.variations.reduce((sum, v) => sum + (v.quantity || 0), 0)
                        : 0}
                    </p>

                  </div>
                </div>

                <div className="actions">
                  <span className="status">
                    {prod.status === "Đang bán" ? "🟢 Đang bán" : "🔴 Ngừng bán"}
                  </span>
                  <div className="icons">
                    <FaEye
                      title="Xem chi tiết"
                      style={{ cursor: "pointer", color: "green" }}
                      onClick={() => navigate(`/products/${prod._id}`)}
                    />
                    <FaEdit
                      title="Sửa"
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={() => navigate(`/products/edit/${prod._id}`)}
                    />
                    <FaTrash
                      title="Xoá"
                      onClick={() => handleDeleteProduct(prod._id)}
                      style={{ color: "red", cursor: "pointer" }}
                    />
                  </div>
                  <button className="btn-import">Nhập hàng</button>
                </div>

                <div className="updated-date">
                  Cập nhật: {new Date(prod.updatedAt).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
