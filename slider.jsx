import React, { useRef, useState, useEffect } from "react";
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

export default function ProductCarousel() {
  const wrapperRef = useRef(null);
  const intervalRef = useRef(null);
  const isPaused = useRef(false);

  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [slideWidth, setSlideWidth] = useState(0);

  const total = products.length;
  const slides = [
    products[total - 1],
    ...products,
    products[0],
  ];

  /* ---------- slide width ---------- */
  useEffect(() => {
    const resize = () => {
      const visible =
        window.innerWidth >= 1024 ? 3 :
        window.innerWidth >= 768 ? 2 : 1;

      setSlideWidth(wrapperRef.current.offsetWidth / visible);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------- auto scroll ---------- */
  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      if (!isPaused.current) next();
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const next = () => {
    setAnimate(true);
    setIndex((i) => i + 1);
  };

  const prev = () => {
    setAnimate(true);
    setIndex((i) => i - 1);
  };

  const onTransitionEnd = () => {
    if (index === 0) {
      setAnimate(false);
      setIndex(total);
    }
    if (index === total + 1) {
      setAnimate(false);
      setIndex(1);
    }
  };

  return (
    <div className={carousel}>
      <h2 className={title}>Featured Products</h2>

      <div
        ref={wrapperRef}
        className={trackWrapper}
        onMouseEnter={() => (isPaused.current = true)}
        onMouseLeave={() => (isPaused.current = false)}
        onTouchStart={() => (isPaused.current = true)}
        onTouchEnd={() => (isPaused.current = false)}
      >
        <div
          className={track}
          onTransitionEnd={onTransitionEnd}
          style={{
            transform: `translateX(-${index * slideWidth}px)`,
            transition: animate ? "transform 0.5s ease" : "none",
          }}
        >
          {slides.map((p, i) => (
            <div key={i} className={card}>
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
    </div>
  );
}
