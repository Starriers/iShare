import { useState, useEffect } from 'react';
import './Banner.css';

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const banners = [
    { src: '/api/assert/images/it.png', href: '#' },
    { src: '/api/assert/images/life.png', href: '#' },
    { src: '/api/assert/images/food.png', href: '#' },
    { src: '/api/assert/images/read.png', href: '#' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section id="banner">
      <div id="banners">
        <div className="banner-container">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <img src={banner.src} alt={`Banner ${index + 1}`} />
            </div>
          ))}
          <div className="banner-dots">
            {banners.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
