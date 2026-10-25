import { useEffect, useState } from "react";

export function useMotion() {
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem("portfolio-motion") === "paused";
    } catch {
      return false;
    }
  });
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const enabled = !paused && !reduced;
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("motion-on", enabled);
    document.documentElement.classList.toggle("motion-off", !enabled);
    try {
      localStorage.setItem("portfolio-motion", paused ? "paused" : "enabled");
    } catch {
      /* Storage is optional. */
    }
  }, [enabled, paused]);
  return { enabled, reduced, toggle: () => setPaused((value) => !value) };
}

export function useScrollState() {
  const [state, setState] = useState({
    progress: 0,
    scrolled: false,
    showTop: false,
    current: "",
  });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      let current = "";
      for (const id of ["experience", "work", "skills", "contact"]) {
        if (document.getElementById(id)?.getBoundingClientRect().top <= 170)
          current = id;
      }
      setState({
        progress: total > 0 ? Math.min(1, y / total) : 0,
        scrolled: y > 20,
        showTop: y > 700,
        current,
      });
      frame = 0;
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const observer = new ResizeObserver(queue);
    observer.observe(document.body);
    update();
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return state;
}

export function useReveal(enabled, filter) {
  useEffect(() => {
    const items = document.querySelectorAll(
      ".section-heading,.experience-explorer,.career-line,.project-card,.skill-group,.journey-intro,.journey-interactive,.about-grid,.contact-inner",
    );
    if (!enabled || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.remove("reveal-pending"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );
    items.forEach((item) => {
      item.classList.add("reveal-item");
      if (item.getBoundingClientRect().top > window.innerHeight * 0.9)
        item.classList.add("reveal-pending");
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [enabled, filter]);
}
