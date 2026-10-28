import { useState, useEffect } from "react";
import { useSlides, DEFAULT_SLIDES } from "../utils/slideStore.js";

export default function CollectionCarousel() {
  // Admin panel madhun add kelele slides; ek pan nasel tar default slides
  const stored = useSlides();
  const slides = stored.length ? stored : DEFAULT_SLIDES;
  const [slideIndex, setCurrentSlide] = useState(0);
  const currentSlide = slideIndex % slides.length;

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[260px] w-full overflow-hidden sm:h-[360px] lg:h-[480px]">
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id ?? index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
            
            {/* Text overlay (title / subtitle blank asel tar dakhvat nahi) */}
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center text-white">
                  {slide.title && (
                    <h2 className="font-serif text-3xl font-semibold sm:text-4xl lg:text-6xl">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="mt-2 text-sm sm:text-base lg:text-xl">
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      )}
    </div>
  );
}