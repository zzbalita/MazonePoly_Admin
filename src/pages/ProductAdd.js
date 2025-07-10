import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StyleWeb/ProductAdd.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";


export default function ProductAdd() {
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

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  const [variations, setVariations] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [variationQty, setVariationQty] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchSizes();
    fetchDescriptionFields();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get(`${BASE_URL}/api/categories`);
    setCategories(res.data);
  };

  const fetchBrands = async () => {
    const res = await axios.get(`${BASE_URL}/api/brands`);
    setBrands(res.data);
  };

  const fetchSizes = async () => {
    const res = await axios.get(`${BASE_URL}/api/sizes`);
    setSizeOptions(res.data);
  };

  const fetchDescriptionFields = async () => {
    const res = await axios.get(`${BASE_URL}/api/description-fields`);
    setDescriptionFields(res.data);
  };

  const MAX_IMAGES = 6;

  const handleImageListChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (images.length + newFiles.length > MAX_IMAGES) {
      setMessage(`Chỉ cho phép tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }

    setImages((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!name.trim()) errors.push("Vui lòng nhập tên sản phẩm.");
    if (!price || isNaN(price) || Number(price) <= 0)
      errors.push("Giá sản phẩm phải là số dương.");
    if (!category) errors.push("Vui lòng chọn danh mục.");
    if (!brand) errors.push("Vui lòng chọn thương hiệu.");
    if (!images.length) errors.push("Vui lòng chọn ít nhất một ảnh sản phẩm.");
    if (variations.length === 0) errors.push("Vui lòng thêm ít nhất một biến thể sản phẩm.");
    if (!image) errors.push("Vui lòng chọn ảnh đại diện.");


    const emptyDescriptions = descriptions.filter((desc) => !desc.value.trim());
    if (emptyDescriptions.length > 0) {
      errors.push(
        `Vui lòng điền nội dung cho: ${emptyDescriptions.map((d) => d.field).join(", ")}.`
      );
    }

    if (errors.length > 0) {
      setMessage("❌ " + errors.join(" "));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image); // ảnh đại diện
      formData.append("description", JSON.stringify(descriptions));
      formData.append("price", price);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("status", status);
      formData.append("variations", JSON.stringify(variations));
      images.forEach((img) => formData.append("images", img));
      
      await axios.post(`${BASE_URL}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      setMessage("✅ Thêm sản phẩm thành công!");
      setTimeout(() => navigate("/products"), 1000);
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      setMessage("❌ Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  return (
    <div className="product-add-container">
      <button onClick={() => navigate("/products")} className="btn-back">Quay lại</button>
      <h2 style={{ marginLeft: "220px" }}>Thêm sản phẩm mới ✏️</h2>
      {message && <div className="message-box">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sản phẩm</label>
          <input name="product-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setImagePreview(URL.createObjectURL(file));
            }}
          />
          {imagePreview && (
            <div className="preview-list">
              <img src={imagePreview} alt="preview" className="preview-img" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Chọn nhiều ảnh</label>
          <input type="file" multiple accept="image/*" onChange={handleImageListChange} />
          <div className="preview-list">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="preview-item" onClick={() => handleRemoveImage(idx)}>
                <img src={src} alt={`preview-${idx}`} className="preview-img" />
              </div>
            ))}
          </div>
        </div>

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

                setVariations([
                  ...variations,
                  {
                    color: selectedColor,
                    size: selectedSize,
                    quantity: Number(variationQty),
                  },
                ]);
                setSelectedColor("");
                setSelectedSize("");
                setVariationQty("");
                setMessage("");
              }}
            >
              + Thêm
            </button>
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
                  title="Nhấn để xóa"
                >
                  {v.color} - {v.size} - SL: {v.quantity}
                </div>
              ))}
            </div>
          )}

        </div>
        <div className="form-group">
          <label>Tổng số lượng</label>
          <input
            type="number"
            value={variations.reduce((sum, v) => sum + Number(v.quantity || 0), 0)}
            readOnly
          />
        </div>


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

        <div className="form-group">
          <label>Giá</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
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

        <button type="submit" className="submit-btn">Lưu sản phẩm</button>
        {message && <div className="message-box">{message}</div>}
      </form>
    </div>
  );
}
