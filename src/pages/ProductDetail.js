import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StyleWeb/ProductDetail.css";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", err);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div>Đang tải...</div>;

    return (
        <div className="product-detail-container">
            <button onClick={() => navigate("/products")} className="btn-back">Quay lại</button>

            <h2 style={{ marginLeft: "300px" }}>Chi tiết sản phẩm</h2>
            <h3><p><strong>Tên sản phẩm: </strong> {product.name}</p></h3>
            {/* Ảnh đại diện */}
            <h3>Ảnh đại diện:</h3>
            {product.image && (
                <img
                    src={`http://localhost:5000${product.image}`}
                    alt="Ảnh đại diện"
                    className="main-image"
                    style={{ maxWidth: "300px", borderRadius: "8px", marginBottom: "10px" }}
                />
            )}

            {/* Ảnh bổ sung */}
            {product.images?.length > 0 && (
                <>
                    <h3>Ảnh bổ sung:</h3>
                    <div className="image-list">
                        {product.images
                            .filter((img) => img !== product.image) // tránh trùng ảnh chính
                            .map((img, idx) => (
                                <img
                                    key={idx}
                                    src={`http://localhost:5000${img}`}
                                    alt={`img-${idx}`}
                                    className="sub-image"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        marginRight: "10px",
                                        borderRadius: "4px"
                                    }}
                                />
                            ))}
                    </div>
                </>
            )}

            <p><strong>Giá:</strong> {product.price.toLocaleString()}₫</p>
            <p><strong>Thương hiệu:</strong> {product.brand}</p>
            <p><strong>Danh mục:</strong> {product.category}</p>
            <p><strong>Trạng thái:</strong> {product.status}</p>
            <p><strong>Tổng số lượng:</strong> {product.quantity}</p>

            <h3>Mô tả sản phẩm:</h3>
            <ul>
                {product.description?.map((d, idx) => (
                    <li key={idx}><strong>{d.field}:</strong> {d.value}</li>
                ))}
            </ul>

            <h3>Biến thể (Màu + Size + SL):</h3>
            <table className="variation-table">
                <thead>
                    <tr>
                        <th>Màu</th>
                        <th>S</th>
                        <th>M</th>
                        <th>L</th>
                        <th>XL</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const grouped = {};
                        product.variations?.forEach(v => {
                            if (!grouped[v.color]) grouped[v.color] = {};
                            grouped[v.color][v.size] = v.quantity;
                        });
                        return Object.entries(grouped).map(([color, sizes], idx) => (
                            <tr key={idx}>
                                <td>{color}</td>
                                {["S", "M", "L", "XL"].map(size => (
                                    <td key={size}>{sizes[size] || 0}</td>
                                ))}
                            </tr>
                        ));
                    })()}
                </tbody>
            </table>
        </div>
    );
}
