import React, { useState, useRef } from "react";
import { css } from "@emotion/css";

/* ------------------ DATA ------------------ */
const products = [
  {
    id: 1,
    title: "Air Sneakers",
    price: "$129",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: 2,
    title: "Leather Backpack",
    price: "$179",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
  },
  {
    id: 3,
    title: "Smart Watch",
    price: "$249",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
  {
    id: 4,
    title: "Headphones",
    price: "$199",
    image: "https://images.unsplash.com/photo-1518441902113-f3e7c1f5c8c1",
  },
];

/* ------------------ COMPONENT ------------------ */
export default function ProductCarousel() {
  const [index, setIndex] = useState(0);
  const startX = useRef(0);

  const prev = () =>
    setIndex((i) => (i === 0 ? products.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i === products.length - 1 ? 0 : i + 1));

  return (
    <div className={carousel}>
      <h2 className={title}>Featured Products</h2>

      <div
        className={trackWrapper}
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = startX.current - e.changedTouches[0].clientX;
          if (diff > 50) next();
          if (diff < -50) prev();
        }}
      >
        <div
          className={track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {products.map((p) => (
            <div key={p.id} className={card}>
              <img src={p.image} alt={p.title} />
              <div className="info">
                <h3>{p.title}</h3>
                <p>{p.price}</p>
                <button>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button className={`${navBtn} left`} onClick={prev}>‹</button>
      <button className={`${navBtn} right`} onClick={next}>›</button>

      {/* Dots */}
      <div className={dots}>
        {products.map((_, i) => (
          <span
            key={i}
            className={`${dot} ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------ STYLES ------------------ */

const carousel = css`
  max-width: 1100px;
  margin: auto;
  padding: 40px 20px;
  position: relative;
`;

const title = css`
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
`;

const trackWrapper = css`
  overflow: hidden;
`;

const track = css`
  display: flex;
  transition: transform 0.5s ease;
`;

const card = css`
  min-width: 100%;
  padding: 10px;

  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 12px;
  }

  .info {
    padding: 16px;
    text-align: center;
  }

  h3 {
    margin: 8px 0;
    font-size: 20px;
  }

  p {
    opacity: 0.7;
    margin-bottom: 12px;
  }

  button {
    background: #000;
    color: #fff;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  @media (hover: hover) {
    button:hover {
      transform: scale(1.05);
    }
  }

  @media (hover: none) {
    button:active {
      transform: scale(0.95);
    }
  }

  @media (min-width: 768px) {
    min-width: 50%;
  }

  @media (min-width: 1024px) {
    min-width: 33.333%;
  }
`;

const navBtn = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #000;
  color: white;
  border: none;
  font-size: 28px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const dots = css`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 8px;
`;

const dot = css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;

  &.active {
    background: #000;
    width: 24px;
    border-radius: 6px;
  }
`;
