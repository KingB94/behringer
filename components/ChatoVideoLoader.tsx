"use client";

import { useEffect } from "react";

/**
 * 2-Klick-YouTube auf der Chato-Seite: ersetzt beim Klick auf #video-wrapper
 * das Vorschaubild durch das eingebettete (nocookie-)YouTube-Video.
 */
export default function ChatoVideoLoader() {
  useEffect(() => {
    const wrapper = document.getElementById("video-wrapper");
    if (!wrapper) return;
    const onClick = () => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute(
        "src",
        "https://www.youtube-nocookie.com/embed/GPn9DYGMM9w?autoplay=1&rel=0&modestbranding=1"
      );
      iframe.setAttribute("title", "YouTube video player");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      );
      iframe.setAttribute("allowfullscreen", "");
      iframe.style.position = "absolute";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      wrapper.innerHTML = "";
      wrapper.appendChild(iframe);
    };
    wrapper.addEventListener("click", onClick);
    return () => wrapper.removeEventListener("click", onClick);
  }, []);

  return null;
}
