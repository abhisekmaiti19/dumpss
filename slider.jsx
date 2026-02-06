/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/css";
import { createAmplanceLink } from "../../../../../config/utils";
import { getAppOrigin } from "@salesforce/pwa-kit-react-sdk/utils/url";

export default function Carousel() {
  const timerRef = useRef(null);
  const isPaused = useRef(false);

  const [rawSlides, setRawSlides] = useState([]);
  const [index, setIndex] = useState(1);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [loading, setLoading] = useState(true);

  const siteURI = `${getAppOrigin()}/mobify/proxy`;

  /* ------------------ PREPARE DATA ------------------ */
  const prepareData = (data = []) =>
    data.map((item) => ({
      id: item.imageblock?.id,
      image: createAmplanceLink(
        "media",
        `${getAppOrigin()}/mobify/proxy/amp-media`,
        item.imageblock?.endpoint,
        item.imageblock?.name
      ),
      title: item.topLine
    }));

  /* ------------------ FETCH AMPLIENCE ------------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          createAmplanceLink(
            "",
            siteURI,
            "content/id",
            "c879d318-3fd9-472c-bf55-67dbe59672a2"
          )
        );

        const json = await res.json();
        const data = prepareData(json?.content?.sliderContentDesktop);

        setRawSlides(data);
        setLoading(false);
      } catch (e) {
        console.error("Carousel fetch error", e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = rawSlides.length;

  /* ------------------ INFINITE SLIDES ------------------ */
  const slides = useMemo(() => {
    if (!total) return [];
    return [rawSlides[total - 1], ...rawSlides, rawSlides[0]];
  }, [rawSlides, total]);

  /* ------------------ RESPONSIVE ------------------ */
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setSlidesToShow(3);
      else if (window.innerWidth >= 768) setSlidesToShow(2);
      else setSlidesToShow(1);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ------------------ AUTOPLAY ------------------ */
  useEffect(() => {
    if (!total) return;

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!isPaused.current) {
        setIndex((i) => i + 1);
      }
    }, 3000);

    return () => clearInterval(timerRef.current);
  }, [total]);

  /* ------------------ INFINITE JUMP ------------------ */
  useEffect(() => {
    if (!animate) return;

    if (index === total + 1) {
      setTimeout(() => {
        setAnimate(false);
        setIndex(1);
      }, 500);
    }

    if (index === 0) {
      setTimeout(() => {
        setAnimate(false);
        setIndex(total);
      }, 500);
    }
  }, [index, animate, total]);

  useEffect(() => {
    if (!animate) {
      requestAnimationFrame(() => setAnimate(true));
    }
  }, [animate]);

  /* ------------------ GUARDS ------------------ */
  if (loading || !total) return null;

  return (
    <div
      className={carousel}
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
      onTouchStart={() => (isPaused.current = true)}
      onTouchEnd={() => (isPaused.current = false)}
    >
      <h2 className={title}>Featured Products</h2>

      <div className={viewport}>
        <div
          className={track}
          style={{
            transform: `translateX(-${(100 / slidesToShow) * index}%)`,
            transition: animate ? "transform 0.5s ease" : "none"
          }}
        >
          {slides.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className={slide}
              style={{ flex: `0 0 ${100 / slidesToShow}%` }}
            >
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <button className={`${nav} left`} onClick={() => setIndex((i) => i - 1)}>
        ‹
      </button>
      <button className={`${nav} right`} onClick={() => setIndex((i) => i + 1)}>
        ›
      </button>
    </div>
  );
}

/* ------------------ STYLES ------------------ */

const carousel = css`
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;
  position: relative;
`;

const title = css`
  text-align: center;
  margin-bottom: 20px;
`;

const viewport = css`
  overflow: hidden;
`;

const track = css`
  display: flex;
  will-change: transform;
`;

const slide = css`
  padding: 10px;
  box-sizing: border-box;

  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 12px;
  }

  h3 {
    text-align: center;
    margin-top: 10px;
    font-size: 18px;
  }
`;

const nav = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #000;
  color: #fff;
  border: none;
  width: 44px;
  height: 44px;
  font-size: 26px;
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
