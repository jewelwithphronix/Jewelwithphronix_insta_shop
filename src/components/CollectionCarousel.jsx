import { useState, useEffect } from "react";
import { useSlides, DEFAULT_SLIDES } from "../utils/slideStore.js";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function CollectionCarousel() {
  // Admin panel madhun add kelele slides; ek pan nasel tar default slides
  const stored = useSlides();
  const slides = stored.length ? stored : DEFAULT_SLIDES;
  const [slideIndex, setCurrentSlide] = useState(0);
  const currentSlide = slideIndex % slides.length;
  // auto-play stops on hover / keyboard focus, with the pause button, and for "reduce motion" users
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused || hovering) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [slides.length, paused, hovering]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section
      className="relative h-[240px] w-full overflow-hidden sm:h-[340px] lg:h-[440px]"
      aria-roledescription="carousel"
      aria-label="Collections"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id ?? index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={slide.image}
              alt=""
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Text overlay (title / subtitle blank asel tar dakhvat nahi) */}
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center text-white">
                  {slide.title && (
                    <p className="font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </p>
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

      {/* Dots (44px tap area) + pause */}
      {slides.length > 1 && (
      <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className="group flex h-11 w-8 items-center justify-center"
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === currentSlide}
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/60 group-hover:bg-white/80"
              }`}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="ml-1 flex h-11 w-11 items-center justify-center text-white"
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
        >
          <span aria-hidden="true" className="text-sm">{paused ? "▶" : "❚❚"}</span>
        </button>
      </div>
      )}
    </section>
  );
}