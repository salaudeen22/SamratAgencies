import { useState, useEffect, useRef } from 'react';

const Counter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span ref={counterRef}>
      {count}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  const stats = [
    {
      value: 29,
      suffix: '+',
      label: 'Years of Trust',
      description: 'Serving families since 1996',
    },
    {
      value: 50000,
      suffix: '+',
      label: 'Happy Families',
      description: 'Homes transformed across Bangalore',
    },
    {
      value: 1000,
      suffix: '+',
      label: 'Beautiful Designs',
      description: 'Carefully selected for you',
    },
  ];

  return (
    <section className="py-6 sm:py-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D7B790 0%, #E5EFF2 100%)' }}>
      {/* Decorative circles */}
      <div className="absolute top-3 left-3 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: '#816047' }}></div>
      <div className="absolute bottom-3 right-3 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: '#CDAA82' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-0.5" style={{ color: '#2F1A0F' }}>A Legacy of Quality</h2>
          <p className="text-xs" style={{ color: '#2F1A0F', opacity: 0.7 }}>Building beautiful homes, one family at a time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-black mb-0.5" style={{ color: '#816047' }}>
                <Counter end={stat.value} suffix={stat.suffix} duration={2000} />
              </div>
              <div className="text-sm sm:text-base font-bold mb-0.5" style={{ color: '#2F1A0F' }}>
                {stat.label}
              </div>
              <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
