import { useEffect } from "react";

export default function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    if (elements.length === 0) return;

    const onIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.15,
    });

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}


