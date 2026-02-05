import { css, keyframes } from "@emotion/css";

export default function EmotionsSlider() {
  return (
    <section>
      <div className={emotionsSlider}>
        {/* Navigation */}
        <div className={sliderNav}>
          <div className={sliderNavItem} tabIndex={0}><svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M14 26L2 14L14 2" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
						</svg></div>
          <div className={sliderNavItem} tabIndex={0}><svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2 26L14 14L2 2" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
						</svg></div>
        </div>

        {/* Slider */}
        <div className="swiper">
          <div className="swiper-wrapper">
            <div className={`swiper-slide ${slide}`}>
              <div className={sliderItem}>
                <div className="image">
                  <img
                    src="https://bato-web-agency.github.io/bato-shared/img/slider-1/slide-1.jpg"
                    alt="Winds of Change"
                  />
                </div>

                <div className="content">
                  <div className="price">$175</div>

                  <h2>Winds of Change</h2>
                  <p>
                    Gentle pink and blue hues remind us of moments when everything
                    changes for the better.
                  </p>

                  <a href="/" className={sliderBtn} onClick={(e) => e.preventDefault()}>
                    <span>View more</span>
                    <span className="icon" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   Animations
========================= */

const arrowMove = keyframes`
  0% { transform: translate(0, 0); }
  100% { transform: translate(100%, -100%); }
`;

/* =========================
   Styles
========================= */

const emotionsSlider = css`
  --color-gray: #818181;
  --color-gray-dark: #1e1e1e;

  position: relative;
  padding-inline: 98px;

  @media (max-width: 767.9px) {
    padding: 0;
    margin-inline: -20px;
  }
`;

const sliderNav = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  inset: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;

  @media (max-width: 767.9px) {
    display: none;
  }
`;

const sliderNavItem = css`
  width: 48px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: #4da3ff;
    }
  }

  @media (hover: none) {
    &:active {
      color: #4da3ff;
    }
  }
`;

const slide = css`
  display: flex;
  align-items: center;
  min-height: 550px;
`;

const sliderItem = css`
  width: calc(100dvw - 60px);
  max-width: 400px;
  background: var(--color-gray-dark);
  border-radius: 10px;
  overflow: hidden;

  .image {
    aspect-ratio: 400 / 270;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .content {
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  h2 {
    font-size: 20px;
    margin: 0;
  }

  p {
    font-size: 16px;
    opacity: 0.7;
  }

  .price {
    font-size: 22px;
    font-weight: 600;
  }
`;

const sliderBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  color: white;
  text-decoration: none;

  .icon {
    width: 24px;
    aspect-ratio: 1;
    position: relative;
    overflow: hidden;
  }

  .icon::before,
  .icon::after {
    content: "";
    position: absolute;
    inset: 0;
    background: url("https://bato-web-agency.github.io/bato-shared/img/slider-1/icon-btn-arrow.svg")
      center / cover no-repeat;
  }

  .icon::after {
    transform: translate(-100%, 100%);
  }

  /* Hover animation (desktop) */
  @media (hover: hover) and (pointer: fine) {
    &:hover .icon::before,
    &:hover .icon::after {
      animation: ${arrowMove} 0.4s ease forwards;
    }
  }

  /* Active animation (mobile) */
  @media (hover: none) {
    &:active .icon::before,
    &:active .icon::after {
      animation: ${arrowMove} 0.4s ease forwards;
    }
  }
`;
