"use client";

import { useEffect } from "react";

export function ScrollImageAnimations() {
  useEffect(() => {
    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-image-reveal-visible");
            entry.target.classList.add("scroll-text-reveal-visible");
            entry.target.classList.add("story-image-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.2,
      },
    );

    function collectElements() {
      const images = Array.from(document.querySelectorAll("img"));
      const textBlocks = Array.from(
        document.querySelectorAll("main h1, main h2, main h3, main p, main section, main article"),
      ).filter((element): element is HTMLElement => element instanceof HTMLElement && !element.closest("[data-no-scroll-reveal]"));
      const storyImages = Array.from(
        document.querySelectorAll(".story-image-left, .story-image-right"),
      ).filter((element): element is HTMLElement => element instanceof HTMLElement);

      images.forEach((image, index) => {
        if (observed.has(image)) return;
        image.classList.add("scroll-image-reveal");
        image.style.setProperty("--scroll-image-delay", `${Math.min(index % 6, 5) * 80}ms`);
        observed.add(image);
        observer.observe(image);
      });

      textBlocks.forEach((element, index) => {
        if (observed.has(element)) return;
        element.classList.add("scroll-text-reveal");
        element.style.setProperty("--scroll-text-delay", `${Math.min(index % 5, 4) * 70}ms`);
        observed.add(element);
        observer.observe(element);
      });

      storyImages.forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
      });
    }

    collectElements();

    const mutationObserver = new MutationObserver(() => {
      window.requestAnimationFrame(collectElements);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
