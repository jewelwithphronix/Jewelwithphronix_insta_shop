import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIcon, CloseIcon } from "./Icons.jsx";

const GAP = 10; // must match .gallery__track gap in styles.css

/*
  One markup, two layouts (decided in CSS):
  - Phone / tablet : swipeable slider + thumbnail strip
  - Desktop (1024+): all images stacked in a single column
*/
export default function ProductGallery({ images = [], alt = "", fallbackColor = "#eee" }) {
  const trackRef = useRef(null);
  const thumbsRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [zoomSrc, setZoomSrc] = useState(null);

  // reset when the product changes
  useEffect(() => {
    setIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [images]);

  // keep active thumbnail visible (scrolls only the thumb strip, never the page)
  useEffect(() => {
    const list = thumbsRef.current;
    const el = list?.children[index];
    if (list && el) {
      list.scrollTo({ left: el.offsetLeft - (list.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
    }
  }, [index]);

  // close lightbox on Esc + lock page scroll while open
  useEffect(() => {
    if (!zoomSrc) return;
    const onKey = (e) => e.key === "Escape" && setZoomSrc(null);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomSrc]);

  function handleScroll() {
    const el = trackRef.current;
    if (!el || el.scrollWidth <= el.clientWidth + 2) return; // desktop: not a slider
    const step = el.children[0].offsetWidth + GAP;
    setIndex(Math.max(0, Math.min(images.length - 1, Math.round(el.scrollLeft / step))));
  }

  function goTo(i) {
    const el = trackRef.current;
    if (!el) return;
    const step = el.children[0].offsetWidth + GAP;
    el.scrollTo({ left: i * step, behavior: "smooth" });
    setIndex(i);
  }

  if (!images.length) {
    return <div className="gallery"><div className="gallery__slide" style={{ background: fallbackColor }} /></div>;
  }

  const multi = images.length > 1;

  return (
    <div className={"gallery" + (multi ? " gallery--multi" : "")}>
      <div className="gallery__track" ref={trackRef} onScroll={handleScroll}>
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            className="gallery__slide"
            onClick={() => setZoomSrc(src)}
            aria-label={`Open image ${i + 1} of ${images.length}`}
          >
            <img src={src} alt={`${alt} — photo ${i + 1}`} draggable="false" loading={i === 0 ? "eager" : "lazy"} />
            {i === 0 && (
              <span className="gallery__zoom" aria-hidden="true"><ZoomIcon size={18} /></span>
            )}
          </button>
        ))}
      </div>

      {multi && (
        <div className="gallery__thumbs">
          <button
            type="button"
            className="gallery__arrow"
            aria-label="Previous thumbnails"
            onClick={() => thumbsRef.current?.scrollBy({ left: -180, behavior: "smooth" })}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="gallery__thumb-list" ref={thumbsRef}>
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                className={"gallery__thumb" + (i === index ? " gallery__thumb--active" : "")}
                onClick={() => goTo(i)}
                aria-label={`Show photo ${i + 1}`}
              >
                <img src={src} alt="" draggable="false" />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="gallery__arrow"
            aria-label="Next thumbnails"
            onClick={() => thumbsRef.current?.scrollBy({ left: 180, behavior: "smooth" })}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {zoomSrc && (
        <div className="lightbox" onClick={() => setZoomSrc(null)} role="dialog" aria-modal="true">
          <button type="button" className="lightbox__close" aria-label="Close" onClick={() => setZoomSrc(null)}>
            <CloseIcon size={28} />
          </button>
          <img src={zoomSrc} alt={alt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}