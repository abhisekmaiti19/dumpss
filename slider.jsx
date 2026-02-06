/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect } from "react";
import { css } from "@emotion/css";
import { createAmplanceLink } from "../../../../../config/utils";
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'

export default function Carousel() {
 const isTransitioning = useRef(false);
  const wrapperRef = useRef(null);
  const intervalRef = useRef(null);
  const isPaused = useRef(false);

  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [slideWidth, setSlideWidth] = useState(0);

  const [image, setImage] = useState(null);
  const [total, setTotal] = useState(0);
  const [slides, setSlides] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const siteURI = `${getAppOrigin()}/mobify/proxy`;

  function prepareData(dataArray){
     let resArr = [];
     dataArray.map((item,i)=>{
         resArr.push({
             id:item.imageblock.id,
             image: createAmplanceLink('media', `${getAppOrigin()}/mobify/proxy/amp-media`,  item.imageblock.endpoint, item.imageblock.name),
             title: item.topLine
         })
     })
     return resArr;
  }
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${createAmplanceLink('',siteURI,'content/id','c879d318-3fd9-472c-bf55-67dbe59672a2')}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        if(result && result.content && result.content.sliderContentDesktop){
            setImage(prepareData(result.content.sliderContentDesktop));
            setIsLoading(false);
            console.log(image);
            setTotal(image.length);
            setSlides([
              image[total - 1],
              ...image,
              image[0],
               ...image ])
               console.log(slides)
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
    // The empty dependency array [] ensures this effect runs only once after the initial render
  }, []); 

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
      if (!isPaused.current && !isTransitioning.current) next();
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const next = () => {
    if(isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimate(true);
    setIndex((i) => i + 1);
  };

  const prev = () => {
    if(isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimate(true);
    setIndex((i) => i - 1);
  };

  const onTransitionEnd = () => {
    isTransitioning.current = false;
    if (index === 0) {
      setAnimate(false);
      setIndex(total);

      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
            setAnimate(true);
        })
      })
    }
    if (index === total + 1) {
      setAnimate(false);
      setIndex(1);

      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
            setAnimate(true);
        })
      })
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
          {slides && slides.map((item) => (
            <div key={item.id} className={card}>
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
