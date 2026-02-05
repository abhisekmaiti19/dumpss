import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { css } from "@emotion/css";
import { useProductStore } from "./useProductStore";

export default function InfiniteProductCarousel() {
  const { products, fetchProducts } = useProductStore();

  const [slidesPerView, setSlidesPerView] = useState(1);
  const [index, setIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  const trackRef = useRef(null);
  const startX = useRef(0);

  /* ---------------- Prevent FOUC ---------------- */
  useLayoutEffect(() => {}, []);

  /* ---------------- Fetch products ---------------- */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ---------------- Responsive logic ---------------- */
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

  if (!products.length) return null;

  /* ---------------- Clone slides for infinite loop ---------------- */
  const clonesBefore = products.slice(-slidesPerView);
  const clonesAfter = products.slice(0, slidesPerView);
  const slides = [...clonesBefore, ...products, ...clonesAfter];

  const totalRealSlides = products.length;
  const startIndex = slidesPerView;

  /* ---------------- Init index ---------------- */
  useEffect(() => {
    setIndex(startIndex);
  }, [slidesPerView]);

  /* ---------------- Auto scroll ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      moveNext();
    }, 3000);
    return () => clearInterval(timer);
  });

  const moveNext = () => {
    setEnableTransition(true);
    setIndex((i) => i + slidesPerView);
  };

  const movePrev = () => {
    setEnableTransition(true);
    setIndex((i) => i - slidesPerView);
  };

  /* ---------------- Handle infinite jump ---------------- */
  const onTransitionEnd = () => {
    if (index >= totalRealSlides + slidesPerView) {
      setEnableTransition(false);
      setIndex(startIndex);
    }

    if (index <= 0) {
      setEnableTransition(false);
      setIndex(totalRealSlides);
    }
  };

  return (
    <div className={carousel}>
      <h2 className={title}>Featured Products</h2>

      <div
        className={viewport}
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = startX.current - e.changedTouches[0].clientX;
          if (diff > 50) moveNext();
          if (diff < -50) movePrev();
        }}
      >
        <div
          ref={trackRef}
          className={track}
          style={{
            transform: `translateX(-${
              (index * 100) / slidesPerView
            }%)`,
            transition: enableTransition
              ? "transform 0.6s ease"
              : "none",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {slides.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
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

      <button className={`${navBtn} left`} onClick={movePrev}>
        ‹
      </button>
      <button className={`${navBtn} right`} onClick={moveNext}>
        ›
      </button>
    </div>
  );
}

/* ===================== STYLES ===================== */

const carousel = css`
  max-width: 1200px;
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
  will-change: transform;
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
