/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect, useMemo } from "react";
import { css } from "@emotion/css";
import { createAmplanceLink } from "../../../../../config/utils";
import { getAppOrigin } from "@salesforce/pwa-kit-react-sdk/utils/url";

export default function Carousel() {
  const isTransitioning = useRef(false);
  const wrapperRef = useRef(null);
  const intervalRef = useRef(null);
  const isPaused = useRef(false);

  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [slideWidth, setSlideWidth] = useState(0);

  const [image, setImage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const siteURI = `${getAppOrigin()}/mobify/proxy`;

  /* ---------- prepare data ---------- */
  function prepareData(dataArray = []) {
    return dataArray.map((item) => ({
      id: item.imageblock.id,
      image: createAmplanceLink(
        "media",
        `${getAppOrigin()}/mobify/proxy/amp-media`,
        item.imageblock.endpoint,
        item.imageblock.name
      ),
      title: item.topLine
    }));
  }

  /* ---------- fetch data ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          createAmplanceLink(
            "",
            siteURI,
            "content/id",
            "c879d318-3fd9-472c-bf55-67dbe59672a2"
          )
        );

        if (!response.ok) throw new Error(response.status);

        const result = await response.json();
        const data = prepareData(result?.content?.sliderContentDesktop);

        setImage(data);
        setIsLoading(false);
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- derived state ---------- */
  const total = image.length;

  const slides = useMemo(() => {
    if (!total) return [];
    return [
      image[total - 1],
      ...image,
      image[0]
    ];
  }, [image, total]);

  /* ---------- slide width ---------- */
  useEffect(() => {
    if (!wrapperRef.current) return;

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

  /* ---------- auto scroll (FIXED) ---------- */
  useEffect(() => {
    if (!total || !slideWidth) return;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!isPaused.current && !isTransitioning.current) {
        next();
      }
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [total, slideWidth]);

  /* ---------- navigation ---------- */
  const next = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimate(true);
    setIndex((i) => i + 1);
  };

  const prev = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimate(true);
    setIndex((i) => i - 1);
  };

  /* ---------- infinite loop ---------- */
  const onTransitionEnd = () => {
    isTransitioning.current = false;

    if (index === 0) {
      setAnimate(false);
      setIndex(total);
      requestAnimationFrame(() => setAnimate(true));
    }

    if (index === total + 1) {
      setAnimate(false);
      setIndex(1);
      requestAnimationFrame(() => setAnimate(true));
    }
  };

  /* ---------- guards ---------- */
  if (isLoading) return null;
  if (error) return null;
  if (!total) return null;

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
            transition: animate ? "transform 0.5s ease" : "none"
          }}
        >
          {slides.map((item, i) => (
            <div key={`${item.id}-${i}`} className={card}>
              <img src={item.image} alt={item.title} />
              <div className="info">
                <h3>{item.title}</h3>
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

/* ------------------ STYLES (UNCHANGED) ------------------ */
