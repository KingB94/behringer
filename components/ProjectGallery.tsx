"use client";

import { useEffect } from "react";

/**
 * Ersetzt die 32 identischen Inline-Slideshow-Skripte der Projektseiten.
 * Bindet sich an die vom Fragment gelieferte Markup (.mySlides, .thumbnail,
 * #prevSlide, #nextSlide) — Logik 1:1 aus dem Original übernommen.
 */
export default function ProjectGallery() {
  useEffect(() => {
    const slides = Array.from(
      document.getElementsByClassName("mySlides")
    ) as HTMLElement[];
    const thumbnails = Array.from(
      document.getElementsByClassName("thumbnail")
    ) as HTMLElement[];
    if (slides.length === 0) return;

    let slideIndex = 1;

    function showSlides(n: number) {
      if (n > slides.length) slideIndex = 1;
      if (n < 1) slideIndex = slides.length;
      slides.forEach((s) => (s.style.display = "none"));
      thumbnails.forEach((t) => t.classList.remove("active-thumbnail"));
      slides[slideIndex - 1].style.display = "block";
      if (thumbnails[slideIndex - 1])
        thumbnails[slideIndex - 1].classList.add("active-thumbnail");
    }

    const plusSlides = (n: number) => showSlides((slideIndex += n));
    const currentSlide = (n: number) => showSlides((slideIndex = n));

    showSlides(slideIndex);

    const thumbHandlers = thumbnails.map((thumb) => {
      const handler = () => {
        const num = parseInt(thumb.getAttribute("data-slide") || "1", 10);
        currentSlide(num);
      };
      thumb.addEventListener("click", handler);
      return handler;
    });

    const prevBtn = document.getElementById("prevSlide");
    const nextBtn = document.getElementById("nextSlide");
    const onPrev = () => plusSlides(-1);
    const onNext = () => plusSlides(1);
    prevBtn?.addEventListener("click", onPrev);
    nextBtn?.addEventListener("click", onNext);

    return () => {
      thumbnails.forEach((thumb, i) =>
        thumb.removeEventListener("click", thumbHandlers[i])
      );
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
    };
  }, []);

  return null;
}
