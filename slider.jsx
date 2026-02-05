import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { css } from "@emotion/css";

/* ---------------- DATA ---------------- */
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

export default function ProductCarousel() {
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const startX = useRef(0);

  /* ⛔ Prevent first unstyled paint */
  useLayoutEffect(() => {
    setReady(true);
  }, []);

  /* Responsive logic */
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setSlidesPerView(3);
      else if (window.innerWidth >= 768) setSlidesPerView(2);
      else setSlidesPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = Math.ceil(products.length / slidesPerView);

  /* Auto-scroll */
  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % pages);
    }, 3000);
    return () => clearInterval(timer);
  }, [pages, ready]);

  const next = () => setPage((p) => (p + 1) % pages);
  const prev = () => setPage((p) => (p - 1 + pages) % pages);

  /* ⛔ Hide until styles are ready */
  if (!ready) return null;

  return (
    <div className={carousel}>
      <h2 className={title}>Featured Products</h2>

      <div
        className={viewport}
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = startX.current - e.changedTouches[0].clientX;
          if (diff > 50) next();
          if (diff < -50) prev();
        }}
      >
        <div
          className={track}
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              className={card}
              style={{ width: `${100 / slidesPerView}%` }}
            >
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

      <button className={`${navBtn} left`} onClick={prev}>‹</button>
      <button className={`${navBtn} right`} onClick={next}>›</button>

      <div className={dots}>
        {Array.from({ length: pages }).map((_, i) => (
          <span
            key={i}
            className={`${dot} ${i === page ? "active" : ""}`}
            onClick={() => setPage(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const carousel = css`
  max-width: 1100px;
  margin: auto;
  padding: 40px 20px;
  position: relative;
`;

const title = css`
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
`;

const viewport = css`
  overflow: hidden;
`;

const track = css`
  display: flex;
  transition: transform 0.6s ease;
`;

const card = css`
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

  button {
    background: black;
    color: white;
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
`;

const navBtn = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: black;
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 28px;
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
  gap: 8px;
  margin-top: 16px;
`;

const dot = css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;

  &.active {
    width: 24px;
    border-radius: 6px;
    background: black;
  }
`;
