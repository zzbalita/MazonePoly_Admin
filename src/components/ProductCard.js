import React, { useState } from "react";

export default function ProductCard({ product }) {
  // Tạo mảng tất cả ảnh: [ảnh đại diện, ...ảnh bổ sung]
  const allImages = [
    product.image?.startsWith("http") || product.image?.startsWith("/")
      ? product.image
      : `/uploads/${product.image}`, // hoặc fallback
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean); // loại bỏ giá trị null/undefined

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img
          src={`http://localhost:5000${allImages[currentImageIndex]}`}
          alt={product.name}
          className="main-image"
        />

        {allImages.length > 1 && (
          <>
            <button className="nav left" onClick={handlePrev}>❮</button>
            <button className="nav right" onClick={handleNext}>❯</button>
          </>
        )}
      </div>
    </div>
  );
}
