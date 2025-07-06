import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./StyleWeb/ProductAdd.css";

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [status, setStatus] = useState("Đang bán");

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const [descriptionFields, setDescriptionFields] = useState([]);

    const [selectedFields, setSelectedFields] = useState([]);
    const [descriptions, setDescriptions] = useState([]);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [oldImage, setOldImage] = useState(null);

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imagesToKeep, setImagesToKeep] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);

    const [variations, setVariations] = useState([]);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [variationQty, setVariationQty] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProduct();
        fetchCategories();
        fetchBrands();
        fetchSizes();
        fetchDescriptionFields();
    }, []);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products/${id}`);
            const data = res.data;
            setName(data.name);
            setPrice(data.price);
            setCategory(data.category);
            setBrand(data.brand);
            setStatus(data.status);
            setDescriptions(data.description || []);
            setOldImage(data.image);
            setImagePreview(data.image ? `http://localhost:5000${data.image}` : null);
            setImagesToKeep(data.images || []);
            setVariations(data.variations || []);

            // Chọn sẵn các trường mô tả đang có
            setSelectedFields((data.description || []).map((d) => d.field));
        } catch (err) {
            setMessage("❌ Không thể tải dữ liệu sản phẩm.");
        }
    };

    const fetchCategories = async () => {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
    };

    const fetchBrands = async () => {
        const res = await axios.get("http://localhost:5000/api/brands");
        setBrands(res.data);
    };

    const fetchSizes = async () => {
        const res = await axios.get("http://localhost:5000/api/sizes");
        setSizeOptions(res.data);
    };

    const fetchDescriptionFields = async () => {
        const res = await axios.get("http://localhost:5000/api/description-fields");
        setDescriptionFields(res.data);
    };

    const handleToggleField = (field) => {
        const updated = selectedFields.includes(field)
            ? selectedFields.filter((f) => f !== field)
            : [...selectedFields, field];

        setSelectedFields(updated);

        if (!selectedFields.includes(field)) {
            setDescriptions((prev) => [...prev, { field, value: "" }]);
        } else {
            setDescriptions((prev) => prev.filter((d) => d.field !== field));
        }
    };

    const handleImageListChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (images.length + imagesToKeep.length + newFiles.length > 6) {
            setMessage("❌ Tối đa 6 ảnh sản phẩm.");
            return;
        }
        setImages((prev) => [...prev, ...newFiles]);
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const handleRemoveOldImage = (idx) => {
        const removed = imagesToKeep[idx];
        setImagesToKeep((prev) => prev.filter((_, i) => i !== idx));
        setImagesToRemove((prev) => [...prev, removed]);
    };

    const handleRemoveNewImage = (idx) => {
        const newImgs = [...images];
        const newPreviews = [...imagePreviews];
        newImgs.splice(idx, 1);
        newPreviews.splice(idx, 1);
        setImages(newImgs);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];
        if (!name.trim()) errors.push("Tên không được để trống.");
        if (!price || isNaN(price) || Number(price) <= 0) errors.push("Giá không hợp lệ.");
        if (!category) errors.push("Chọn danh mục.");
        if (!brand) errors.push("Chọn thương hiệu.");
        if (variations.length === 0) errors.push("Thêm ít nhất một biến thể.");
        const emptyDescriptions = descriptions.filter((desc) => !desc.value.trim());
        if (emptyDescriptions.length > 0)
            errors.push("Mô tả còn trống: " + emptyDescriptions.map((d) => d.field).join(", "));

        if (errors.length > 0) {
            setMessage("❌ " + errors.join(" "));
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("brand", brand);
            formData.append("status", status);
            formData.append("description", JSON.stringify(descriptions));
            formData.append("variations", JSON.stringify(variations));

            if (image) {
                formData.append("image", image);
            } else {
                formData.append("imageMode", "keep");
            }

            formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
            if (images.length > 0) {
                images.forEach((img) => formData.append("images", img));
                formData.append("imagesMode", "append");
            } else {
                formData.append("imagesMode", "keep");
            }

            await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("✅ Cập nhật thành công!");
            setTimeout(() => navigate("/products"), 1000);
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
            setMessage("❌ Cập nhật thất bại.");
        }
    };

    return (
        <div className="product-add-container">
            <button onClick={() => navigate("/products")} className="btn-back">Quay lại</button>
            <h2 style={{ marginLeft: "220px" }}>Chỉnh sửa sản phẩm</h2>
            {message && <div className="message-box">{message}</div>}

            <form onSubmit={handleSubmit}>
                {/* Tên sản phẩm */}
                <div className="form-group">
                    <label>Tên sản phẩm</label>
                    <input name="product-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                {/* Ảnh đại diện */}
                <div className="form-group">
                    <label>Ảnh đại diện</label>
                    <div className="preview-list">


                        {imagePreview && (
                            <img src={imagePreview} alt="current" className="preview-img" />
                        )}</div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setImage(file);
                            setImagePreview(URL.createObjectURL(file));
                        }}
                    />
                </div>

                {/* Ảnh bổ sung */}
                <div className="form-group">
                    <label>Ảnh bổ sung hiện tại</label>
                    <div className="preview-list">
                        {imagesToKeep.map((img, idx) => (
                            <div key={idx} className="preview-item">
                                <img
                                    src={`http://localhost:5000${img}`}
                                    alt={`img-${idx}`}
                                    className="preview-img"
                                    onClick={() => handleRemoveOldImage(idx)}
                                    title="Nhấn để xóa ảnh"
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
                        ))}
                        {imagePreviews.map((src, idx) => (
                            <div key={idx} className="preview-item">
                                <img
                                    src={src}
                                    alt={`new-${idx}`}
                                    className="preview-img"
                                    onClick={() => handleRemoveNewImage(idx)}
                                    title="Nhấn để xóa ảnh"
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
                        ))}
                    </div>

                    <input type="file" multiple onChange={handleImageListChange} />
                </div>

                {/* Biến thể */}
                <div className="form-group">
                    <label>Thêm biến thể (Màu + Size + Số lượng)</label>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                        <input
                            type="text"
                            placeholder="Màu"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            style={{ width: "120px" }}
                        />
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            style={{ width: "100px" }}
                        >
                            <option value="">Size</option>
                            {sizeOptions.map((s) => (
                                <option key={s._id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Số lượng"
                            min={1}
                            value={variationQty}
                            onChange={(e) => setVariationQty(e.target.value)}
                            style={{ width: "100px" }}
                        />
                        <button
                            className="add-btn"
                            type="button"
                            onClick={() => {
                                if (!selectedColor || !selectedSize || !variationQty || variationQty <= 0) {
                                    setMessage("Vui lòng nhập đủ thông tin biến thể.");
                                    return;
                                }
                                const exists = variations.find(
                                    (v) => v.color === selectedColor && v.size === selectedSize
                                );
                                if (exists) {
                                    setMessage("Biến thể này đã tồn tại.");
                                    return;
                                }
                                setVariations([...variations, {
                                    color: selectedColor,
                                    size: selectedSize,
                                    quantity: Number(variationQty),
                                }]);
                                setSelectedColor("");
                                setSelectedSize("");
                                setVariationQty("");
                            }}
                        >+ Thêm</button>
                    </div>
                    {variations.length > 0 && (
                        <div className="variation-list">
                            {variations.map((v, idx) => (
                                <div
                                    key={idx}
                                    className="variation-tag"
                                    onClick={() =>
                                        setVariations(variations.filter((_, i) => i !== idx))
                                    }
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: "#f0f0f0",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        display: "inline-block",
                                        margin: "4px",
                                        userSelect: "none",
                                    }}
                                    title="Nhấn để xóa biến thể này"
                                >
                                    {v.color} - {v.size} - SL: {v.quantity}
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                {/* Tổng số lượng */}
                <div className="form-group">
                    <label>Tổng số lượng</label>
                    <input
                        type="number"
                        readOnly
                        value={variations.reduce((sum, v) => sum + Number(v.quantity || 0), 0)}
                    />
                </div>

                {/* Mô tả */}
                <div className="form-group">
                    <label>Chọn các mục mô tả</label>
                    <div className="desc-options">
                        {descriptionFields.map((field) => (
                            <label key={field._id}>
                                <input
                                    type="checkbox"
                                    checked={selectedFields.includes(field.name)}
                                    onChange={() => handleToggleField(field.name)}
                                />
                                {field.name}
                            </label>
                        ))}
                    </div>
                </div>
                {descriptions.map((desc, index) => (
                    <div key={index} className="desc-field">
                        <strong>{desc.field}</strong>
                        <textarea
                            maxLength={200}
                            value={desc.value}
                            onChange={(e) => {
                                const newDescs = [...descriptions];
                                newDescs[index].value = e.target.value;
                                setDescriptions(newDescs);
                            }}
                            className="desc-textarea"
                        />
                    </div>
                ))}

                {/* Giá, danh mục, thương hiệu, trạng thái */}
                <div className="form-group">
                    <label>Giá</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Danh mục</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Thương hiệu</label>
                    <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                        <option value="">-- Chọn thương hiệu --</option>
                        {brands.map((b) => (
                            <option key={b._id} value={b.name}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Trạng thái</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option>Đang bán</option>
                        <option>Ngừng bán</option>
                    </select>
                </div>

                <button type="submit" className="submit-btn">Lưu thay đổi</button>
                {message && <div className="message-box">{message}</div>}

            </form>
        </div>
    );
}
