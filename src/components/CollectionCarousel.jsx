import { useState, useEffect } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=600&fit=crop",
    title: "New Collection",
    subtitle: "Discover our latest handcrafted pieces"
  },
  {
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&h=600&fit=crop",
    title: "Festive Collection",
    subtitle: "Timeless jewellery for every celebration"
  },
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=600&fit=crop",
    title: "Bridal Collection",
    subtitle: "Elegance crafted for your special day"
  },
  {
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=600&fit=crop",
    title: "Classic Pieces",
    subtitle: "Timeless designs that never go out of style"
  }
];

export default function CollectionCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[260px] w-full overflow-hidden sm:h-[360px] lg:h-[480px]">
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
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
            
            {/* Text overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center text-white">
                <h2 className="font-serif text-3xl font-semibold sm:text-4xl lg:text-6xl">
                  {slide.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base lg:text-xl">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
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
    </div>
  );
}
