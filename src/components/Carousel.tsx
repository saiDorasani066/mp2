import { useState } from "react";
import GalleryView from "./GalleryView";
import Home from "./Home";
import ListView from "./ListView";

function Carousel() {
  const [section, setSection] = useState(0);

  function nextSection() {
    setSection((current) => Math.min(current + 1) % 3);
  }

  function prevSection() {
    setSection((current) => Math.max(current - 1 + 3) % 3);
  }

  return (
    <div>
      <button onClick={nextSection}>Next</button>
      <div className={`carousel-track section-${section}`}>
        <Home />
        <ListView />
        <GalleryView />
      </div>
      <button onClick={prevSection}>Previous</button>
    </div>
  );
}

export default Carousel;
